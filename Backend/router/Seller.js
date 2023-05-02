const router = require("express").Router();
const Seller = require("..//models/Seller");
const { body, validationResult } = require('express-validator');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const {SellerverifyTokenAndAuthorization, sellerverifyToken } = require("./SellerverifyToken");
const bcrypt = require('bcryptjs');
const { mainAdminverifyToken } = require("./mainAdminverify");
const nodemailer = require('nodemailer');
const User = require("../models/User");
const Influencer = require("../models/Influencer");
const Product = require("../models/Product");
const SellerverificationTokenOTP = require("../models/SellerverificationToken");
const { generateOTP } = require("../utils/mail");
const SellerResetToken = require("../models/SellerResetToken")
require("dotenv").config();
const sparkPostTransport = require('nodemailer-sparkpost-transport')
const transporter = nodemailer.createTransport(sparkPostTransport({
    'sparkPostApiKey': process.env.SPARKPOSTAPIKEY
}))
const {generatePasswordResetTemplate , OTPTem} = require('../router/mail')

const multer = require('multer')
const storage = multer.memoryStorage()
const sharp = require('sharp');
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const upload = multer({ storage: storage })

const randomfileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const bucketNAME = process.env.BUCKET_NAME;
const bucketREGION = process.env.BUCKET_REGION;
const accessKEY = process.env.ACCESS_KEY;
const secretaccess = process.env.SECRETACCESS;

const s3 = new S3Client({
    region: bucketREGION,
    credentials: {
        accessKeyId: accessKEY,
        secretAccessKey: secretaccess
    },
})
dotenv.config();

const SparkPost = require('sparkpost');
const client = new SparkPost(process.env.SPARKPOSTAPIKEY);

const ResetToken = require("../models/ResetToken");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();
//Register 
router.post("/register" ,
        body('email', 'Enter your valid email').isEmail(),
        body('username', "Username must be 4 char").isLength({ min: 3 }),
        body('password' , "password must be 5 char with @ or $ or # and some digit").isLength({ min: 5 }),
        body('shopname' , "Shop name must be 6 char").isLength({min: 6}),
        body('shopAddress', "ShopAddress must be 5 char" ).isLength({min:5}),
        body('Pan_Number' , "Pan_number must be 16 digit").isLength({ min: 16 }),
        body('National_id' , "National_id must be 10 digit").isLength({min:10}),
        body('Post_Number' ).isLength(),
        body('city' , "City must be 3 char").isLength({min:3}),
        body('state' , "State must be 5 char").isLength({min:5}),
        // body('Phonenumber' , "Phonenumber must be 10 digit").isLength({min:10}),
         async(req, res) =>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array("Some error occure")});
      }
      // try {
        let seller = await Seller.findOne({email: req.body.email});
        if(seller){
            return res.status(400).json({errors:"Please login With correct password"});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        const newseller = await Seller.create({
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: secPass,
            phoneNumber: req.body.phoneNumber,
            shopname: req.body.shopname,
            avatar: req.body.avatar,
            shopAddress : req.body.shopAddress,
            Pan_Number: req.body.Pan_Number,
            Post_Number: req.body.Post_Number,
            National_id: req.body.National_id,
            state: req.body.state,
            city: req.body.city,
            startAt: Date.now(),
            paymentDateAt: new Date(Date.now() + 12096e5),
            paymentPendingDate: new Date(Date.now() + 12096e5),
            isSuppliers:req.body.isSuppliers,
            isSeller:req.body.isSeller
             
          })
          const accessToken = jwt.sign({
            id:newseller._id,
            isSeller: newseller.isSeller,
            isSuppliers: newseller.isSuppliers
        },process.env.SELL_SEC, {expiresIn:"7d"})
        let OTP = generateOTP();
        let sellerverificationTokenOTP =  await SellerverificationTokenOTP.create({
          seller: newseller._id,
          token:OTP
      })

        sellerverificationTokenOTP.save().then(()=>{
          client.transmissions.send({
            content: {
              from: 'contact@aavelance.com',
              subject: 'Verify your account in Aavelance',
              html:OTPTem(OTP)
            },
            recipients: [
              {address: req.body.email}
            ]
          })
          .then(data => {
            res.status(200).json({Status:"Pending" , seller:newseller._id})
          })
          .catch(err => {
            return res.json('Whoops! Something went wrong');
          });
    })
    await newseller.save();
})

//Verify email
router.post("/verify/email" , async(req , res)=>{
  const {seller , OTP} = req.body;
//   if(!user || OTP.trim()) return res.status(400).json("Invalid request, missing parameters")
  
  const mainseller = await Seller.findById(seller);
  console.log(mainseller)
  if(!mainseller) return res.status(400).json("Sorry seller not found")
  if(mainseller.verified) return res.status(200).json('This account is already verifyed');

  const token = await SellerverificationTokenOTP.findOne({seller:mainseller._id});
  if(!token) return res.status(400).json("Sorry, user not found");

  console.log(token.token);  
  const isMatched = await bcrypt.compareSync(OTP ,  token.token);
  
  if(!isMatched) return res.status(400).json("Please provide a valid token");
  mainseller.verified = true;
  await SellerverificationTokenOTP.findByIdAndDelete(token._id);
  await mainseller.save();
  const accessToken = jwt.sign({
    id: mainseller._id,
    username:mainseller.username,
    isAdmin: mainseller.isAdmin,
    
}, process.env.SELL_SEC, { expiresIn: "7d" })
  const {password , ...others} = mainseller._doc;
  client.transmissions.send({
    content: {
      from: 'contact@aavelance.com',
      subject: 'Successfully Verify email',
      html:`<p>Thank you for verify email Now login and Sell your product</p>`
    },
    recipients: [
      {address: mainseller.email}
    ]
  })
  .then(data => {
    return res.status(200).json({others , accessToken})
  })
  .catch(err => {
    return res.json('Whoops! Something went wrong');
  });
  
})


//Login
router.post("/login" ,[
        body('email', 'Enter your valid email').isEmail(),
        body('password' , 'Password must be 5 char').isLength({ min: 5 }),
], async(req , res)=>{
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    let seller = await Seller.findOne({email: req.body.email}).select("+password");
    if(!seller){
      return res.status(400).json("Some Error occure ")
    }
    const comparePassword = await bcrypt.compare(req.body.password , seller.password);
    
    if(!comparePassword){
      return res.status(400).json("Password is incorrected")
    }
    const {password , ...others} = seller._doc;
    const accessToken = jwt.sign({
      id:seller._id,
      isSeller: seller.isSeller,
      isSuppliers:seller.isSuppliers
    },process.env.SELL_SEC, {expiresIn:"7d"})
    
    res.json({...others,accessToken})
    
  } catch (error) {
    return res.status(400).json("Internal error occured")
  }
    
})

//Forget Password
// router.post("/forgetpassword", async (req, res) => {
//   const {email} = req.body;
//   if(!email){
//       return res.status(400).json("Please provide a valid email");
//   };
//   const seller = await Seller.findOne({email:email});
//   if(!seller){
//       return res.status(400).json("User not found!")
//   };
//   const token = await SellerResetToken.findOne({seller:seller._id});
//   if(token) return res.status(200).json("After one hour you can request for another token")
  

//   //Generating Token 
//   const RandomTxt = crypto.randomBytes(20).toString("hex");
//   const restToken = new SellerResetToken({seller:seller._id , token:RandomTxt});
//   console.log(RandomTxt);
//   await restToken.save();
//   client.transmissions.send({
//     content: {
//       from: 'contact@aavelance.com',
//       subject: 'Successfully Verify email',
//       html:generatePasswordResetTemplate(`https://www.aavelance.com/seller/reset/password?token=${RandomTxt}&_id=${seller._id}`)
//     },
//     recipients: [
//       {address: seller.email}
//     ]
//   })
//   .then(data => {
//     return res.status(200).json("Password reset link is sent to your email")
//   })
//   .catch(err => {
//     return res.json('Whoops! Something went wrong');
//   });

    
// })

//reset password
router.put("/reset/password", async (req, res) => {
// try {
  const {token , _id} = req.query;
  if(!token || !_id){
      return res.status(400).json("Invalid request")
  }
  const seller  = await Seller.findOne({_id:_id});
  console.log(seller)
  if(!seller){
      return res.status(400).json("seller not found")
  }
  const resetToken = await SellerResetToken.findOne({seller:seller._id});
  if(!resetToken){
      return res.status(400).json("Reset token not found")
  }

  const isMatched = await bcrypt.compareSync(token ,  resetToken.token);
  if(!isMatched){
      return res.status(400).json("Reset token is not invalid")
  }
  const {password} = req.body;
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt)
  seller.password = secPass;
  await seller.save();
  client.transmissions.send({
    content: {
      from: 'contact@aavelance.com',
      subject: 'Password Reset Successfully ',
      html:`Password Reset Successfully Now you can login with new password`
    },
    recipients: [
      {address: seller.email}
    ]
  })
  await res.status(200).json("Done")

})



// Find seller username
router.get("/seller/:id" , async(req , res)=>{
  try {
    let seller = await Seller.findById(req.params.id).select(["+password" , "+startAt" , "+email" , "+phoneNumber" , "shopname" , "+shopAddress" , "+Pan_Number" , "+National_id" ,"+Post_Number" ,"avatar" , "+username" , "+paymentDateAt" , "+paymentPendingDate" , "+isSeller" , "+city" , "+updatedAt" ] );
    if(!seller){
      return res.status(400).json("Some Error occure ")
    }
    const {password ,phoneNumber ,isSeller,city,state , National_id ,email ,avatar ,paymentDateAt,paymentPendingDate , _id ,shopAddress,createdAt, Pan_Number , updatedAt ,  ...others} = seller._doc;
    res.json(others)
    
  } catch (error) {
    return res.status(400).json("Internal error occured")
  }

})

//Update Seller
router.put("/:id", SellerverifyTokenAndAuthorization , async(req , res)=>{
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        req.body.password = secPass;
    }
    try {
        const updateuser = await Seller.findByIdAndUpdate(req.params.id , {
            $set:req.body
        })
        res.status(200).json("Your information updated")
    } catch (error) {
        return res.status(400).json("Internal error occured")
    }
})


//Forget Password
router.post("/forgetpassword", async (req, res) => {
  const {email} = req.body;
  if(!email){
      return res.status(400).json("Please provide a valid email");
  };
  const seller = await Seller.findOne({email:email});
  if(!seller){
      return res.status(400).json("seller not found , Invalid request!")
  };
  const token = await SellerResetToken.findOne({seller:seller._id});
  if(token) return res.status(200).json("After one hour you can request for another token")
  

  //Generating Token 
  const RandomTxt = crypto.randomBytes(20).toString("hex");
  const restToken = new ResetToken({seller:seller._id , token:RandomTxt});
  console.log(RandomTxt);
  await restToken.save();
  transporter.sendMail({
      from: "contact@aavelance.com",
      to: seller.email,
      subject: 'Password Reset ',
      html: `http://www.aavelance.com/reset/password?token=${RandomTxt}&_id=${seller._id}`
    })

    res.status(200).json("Password reset link is sent to your email")
    
})



//reset password
router.put("/reset/password", async (req, res) => {
  try {
      const {token , _id} = req.query;
      if(!token || !_id){
          return res.status(400).json("Invalid request")
      }
      // if(!isValidObjectId(id)){
      //     return res.json("Invalid request");
      // }
      const seller  = await Seller.findOne({_id:_id});
      console.log(seller)
      if(!seller){
          return res.status(400).json("seller not found")
      }
      const sellerresetToken = await SellerResetToken.findOne({seller:seller._id});
      if(!sellerresetToken){
          return res.status(400).json("Reset token not found")
      }
  
      const isMatched = await bcrypt.compareSync(token ,  sellerresetToken.token);
      if(!isMatched){
          return res.status(400).json("Reset token is not invalid")
      }
      const {password} = req.body;
      // const isSamePassword = await bcrypt.compare(password, user.password);
      // if(isSamePassword){
      //     res.status(400).json("Please add another password");
      // };
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt)
      seller.password = secPass;
      await seller.save();
      transporter.sendMail({
          from: "contact@aavelance.com",
          to: seller.email,
          subject: 'Password Reset Successfully ',
          html: `Password Reset Successfully Now you can login with new password`
      })
      await ResetToken.findOne({seller:seller._id})
      res.status(200).json("Done")
  
    } catch (error) {
      return res.status(403).json("Internal error")
    }
  })




// //reset password
// router.put("/reset/password/:token" , async(req , res)=>{
//   try {

//     const resetPasswordToken = crypto.createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");
//     const seller = await Seller.findOne({resetPasswordToken, resetPasswordExpire:{$gt:Date.now()},});
//     console.log(seller);
    
//     if(!seller){
//         return res.status(400).json("Reset password Token is invalid or has been expired");
//     }
//     if(req.body.password !== req.body.comfirmPassword){
//         return res.status(400).json("password doesn't match");
//     }

//     seller.password = req.body.password;
//     if(seller.password){
//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(seller.password, salt)
//         seller.password = secPass;
//     }
//     seller.resetPasswordToken = undefined;
//     seller.resetPasswordExpire = undefined;

//     await seller.save();
//     res.status(200).json(seller)
        
//   } catch (error) {
//     return res.status(500).json("Internal error occured")
//   }
// })

//Update seller password
router.put("/update/password/:id", sellerverifyToken, async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(400).json("Seller doesn't exists")
        }
        const isPasswordMatched = await bcrypt.compare(req.body.oldpassword , seller.password);
        if (!isPasswordMatched) {
            return res.status(401).json("Old password is incorrect");
        }
        if (req.body.newPassword !== req.body.comfirmPassword) {
           return res.status(401).json("Password doesn't match");
        }

        const salt = await bcrypt.genSalt(10);
        seller.password = await bcrypt.hash(req.body.newPassword , salt);
        // const secPass = await bcrypt.hash(req.body.password, salt)
        await seller.save();

        res.status(200).json("Your password is successfully updated")

    } catch (error) {
        return res.status(500).json("Internal error occured")
    }

})


//Delete User
router.delete("/:id", SellerverifyTokenAndAuthorization , async(req , res)=>{
    try {
         await Seller.findByIdAndDelete(req.params.id)
         res.status(200).json("User deleted")
    } catch (error) {
        console.log("Some error occure")
    }
})




//Follow a seller
router.put('/:id/follow', async(req , res)=>{
  try {
    if(req.body.user !== req.params.id){
    //   try {
        const seller = await Seller.findById(req.params.id);
        const currentuser = await User.findById(req.body.user);
  
        if(!seller.followers.includes(req.body.user)){
          await seller.updateOne({$push:{followers:req.body.user}});
          await currentuser.updateOne({$push:{following:req.params.id}})
          return res.json("User has followed")
        }
        else{
          await seller.updateOne({$pull:{followers:req.body.user}});
          await currentuser.updateOne({$pull:{following:req.params.id}})
          return res.status(403).json("you already follow this User");
        }
    }
    else{
      return res.status(403).json("You can't follow your own account")
    }
        
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
  })
  
  
  //Unfollow User
  router.put('/:id/unfollow', async(req , res)=>{
    try {
    if(req.body.user !== req.params.id){
      try {
        const seller = await Seller.findById(req.params.id);
        const currentuser = await User.findById(req.body.user);
  
        if(seller.followers.includes(req.body.user)){
          await seller.updateOne({$pull:{followers:req.body.user}});
          await currentuser.updateOne({$pull:{following:req.params.id}})
          return res.json("User has unfollowed")
        }
        else{
          return res.status(403).json("you already unfollow this User");
        }
  
      } catch (error) {
        return res.status(500).json(error)
      }
    }
    else{
      return res.status(403).json("You already unfollow user")
    }
          
  } catch (error) {
     return res.status(500).json("Internal error occured") 
  }
  })

//Follow a seller by influencer
router.put('/:id/influencer/follow', async(req , res)=>{
  try {

    if(req.body.influencer !== req.params.id){
        const seller = await Seller.findById(req.params.id);
        console.log(seller)
        const currentinfluencer = await Influencer.findById(req.body.influencer);
        if(!seller?.followers.includes(req.body.influencer)){
          await seller?.updateOne({$push:{followers : req.body.influencer}});
          await currentinfluencer?.updateOne({$push : {following:req.params.id}})
          return res.json("Influencer has followed")
        }
        else{
          return res.status(403).json("you already follow this Influencer");
        }
    }
    else{
      return res.status(403).json("You can't follow your own account")
    }
        
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
  })
  
  
  //Unfollow seller by influencer
  router.put('/:id/influencer/unfollow', async(req , res)=>{
    try {
    if(req.body.influencer !== req.params.id){
      try {
        const seller = await Seller.findById(req.params.id);
        const currentinfluencer = await Influencer.findById(req.body.influencer);
  
        if(seller?.followers.includes(req.body.influencer)){
          await seller?.updateOne({$pull:{followers:req.body.influencer}});
          await currentinfluencer?.updateOne({$pull:{following:req.params.id}})
          res.json("Influencer has unfollowed")
        }
        else{
          return res.status(403).json("you already unfollow this influencer");
        }
  
      } catch (error) {
        return res.status(500).json(error)
      }
    }
    else{
      return res.status(403).json("You already unfollow influencer")
    }
          
  } catch (error) {
      return res.status(500).json("Internal error occured")
  }
  })

  //Fetch product from followed seller for user
  router.get("/flwpdu/:id"  ,  async(req , res)=>{
      try {
          const user = await User.findById(req.params.id);
          const follow = await Promise.all(
              user.following.map((item)=>{
                  return Product.find({seller : item})
                })
                )
              
          const product = await Promise.all(follow.map(async(item)=>{
           
            const singleProduct = await Promise.all(item.map(async subitem => {
              const images = await Promise.all(subitem.img.map(async imageKey => {
                // Create a GetObjectCommand with the necessary parameters
                const command = new GetObjectCommand({
                  Bucket: bucketNAME,
                  Key: imageKey,
                });
                // Get the signed URL for the image
                const url = await getSignedUrl(s3, command);
                return url;
              }));
              // console.log(images , "Images")
              subitem.img = images
              return subitem
            }));
            console.log(singleProduct , "SingleProduct")
            return singleProduct;
          }))
           
            res.status(200).json(product)
            } catch (error) {
                return res.status(400).json("some error occured")
            }
  })


//Fetch product from followed seller for user
//   router.get("/influencer/flwpdu/:id"  ,  async(req , res)=>{
//     try {
//         const influencer = await Influencer.findById(req.params.id);
//         const follow = await Promise.all(
//             influencer.following.map((item)=>{
//                 return Product.find({seller : item})
//               })
//               )
//               res.json(follow);  
//           } catch (error) {
//               return res.status(400).json("some error occured")
//           }
// })

// Get seller for admin
router.get("/get/seller/:id" , mainAdminverifyToken , async(req , res)=>{
    try {
        let seller = await Seller.findById(req.params.id)
        const {password , phoneNumber , ...others} = seller._doc
        res.status(200).json(others)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

// Get all seller for admin
router.get("/get/all/seller" , mainAdminverifyToken , async(req , res)=>{
    try {
        let seller = await Seller.find()
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})


module.exports = router;