const router = require('express').Router();
const Influencer = require("..//models/Influencer");
const { body, validationResult } = require('express-validator');
const {InfluencerverifyToken} = require("../router/InfluencerverifyToken")
const {mainAdminverifyTokenAndAdmin} = require('./mainAdminverify');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require("../sendEmail");
const InfluencerverificationToken = require('../models/InfluencerverificationToken');
const { generateOTP } = require('../utils/mail');
const InfluencerResetToken = require('../models/InfluencerResetToken');
const nodemailer = require('nodemailer');
const SparkPost = require('sparkpost');
const client = new SparkPost('4c77c975e0779ec0e726bd82fd0a6642ac0c6481');

//Register 
router.post("/register" ,
    [
        body('email', 'Enter your valid email').isEmail(),
        body('username' , "Username must be 5 char").isLength({min:5}),
        body('password').isLength({ min: 5 }),
        body('phoneNumber' , "Number must be 10 digit").isLength({ min: 10 }),
        body('PAN', "PAN number must be 9 digit").isLength({min:9}),
        body('State', "State name must be 3 char").isLength({min:3}),
        body('City', "City name must be 3 char").isLength({min:3})
    ], async(req, res) =>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array("Some error occure")});
      }
    // try {
        let influencer = await Influencer.findOne({email: req.body.email});
        if(influencer){
            return res.status(400).json("Please login With correct password");
        }
        
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        influencer = await Influencer.create({
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            PAN:req.body.PAN,
            State:req.body.State,
            City:req.body.City,
            password:secPass,
            startAt: Date.now(),
            paymentDateAt: new Date(Date.now() + 1e5),
            paymentPendingDate: new Date(Date.now() + 1e5),
          });
          const accessToken = jwt.sign({
            id:influencer._id,
            isAdmin: influencer.isAdmin,
            username:influencer.username
        },process.env.INFLU, {expiresIn:"7d"});
        let OTP = generateOTP();
        let influencerverificationTokenOTP =  await InfluencerverificationToken.create({
          influencer: influencer._id,
          token:OTP
      })

      influencerverificationTokenOTP.save().then(()=>{
          client.transmissions.send({
            content: {
              from: 'contact@aavelance.com',
              subject: 'Verify your account in Aavelance',
              html:`<p>Verify your email address to complete this signup and login process</p><p>This link expires <b>in 6 hour </b></p><p> ${OTP} </p>`
            },
            recipients: [
              {address: req.body.email}
            ]
          })
          .then(data => {
            res.status(200).json({Status:"Pending" , influencer:influencer._id})
          })
          .catch(err => {
            console.log('Whoops! Something went wrong');
            console.log(err);
          });
    })
    
        //   return res.status(200).json({influencer, accessToken});
        
    // } catch (error) {
    //     res.status(500).json("Internal error occured");
    // }
})


//Verify email
router.post("/verify/email" , async(req , res)=>{
    const {influencer , OTP} = req.body;
  //   if(!user || OTP.trim()) return res.status(400).json("Invalid request, missing parameters")
    
    const maininfluencer = await Influencer.findById(influencer);
    console.log(maininfluencer)
    if(!maininfluencer) return res.status(400).json("Sorry user not found")
    if(maininfluencer.verified) return res.status(200).json('This account is already verifyed');
  
    const token = await InfluencerverificationToken.findOne({influencer:maininfluencer._id});
    if(!token) return res.status(400).json("Sorry, user not found");
  
  //   const isMatched = await token.compareToken(OTP);
    console.log(token.token);  
    const isMatched = await bcrypt.compareSync(OTP ,  token.token);
  //   console.log(compareToken)
    
    if(!isMatched) return res.status(400).json("Please provide a valid token");
    maininfluencer.verified = true;
    await InfluencerverificationToken.findByIdAndDelete(token._id);
    await maininfluencer.save();
    const accessToken = jwt.sign({
      id: maininfluencer._id,
      username:maininfluencer.username,
      isAdmin: maininfluencer.isAdmin,
      
  }, process.env.INFLU, { expiresIn: "7d" })
    const {password , ...others} = maininfluencer._doc;
    client.transmissions.send({
      content: {
        from: 'contact@aavelance.com',
        subject: 'Successfully Verify email',
        html:`<p>Thank you for verify email Now login and make money with aavelance</p>`
      },
      recipients: [
        {address: maininfluencer.email}
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
router.post('/login', [
    body('email', 'Enter your valid email').isEmail(),
    body('password' , 'Enter your valid password').exists(),
], async(req , res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array("Some error occure")});
        }
        // const {email , password} = req.body;
        const influencer = await Influencer.findOne({email:req.body.email}).select("+password");
        if(!influencer){
            return res.status(400).json("User could not found");
        }
        const comparePassword = await bcrypt.compare(req.body.password , influencer.password);
        if(!comparePassword){
            return res.status(400).json("Password is incorrected");
        } 
        const accessToken = jwt.sign({
            id:influencer._id,
            isAdmin: influencer.isAdmin,
            username:influencer.username
        },process.env.INFLU, {expiresIn:"7d"})
        const {password  , ...others} = influencer._doc;
        return res.status(200).json({others, accessToken});
    } catch{
        return res.status(500).json("Internal error occured");
    }  
    })


//Forget Password
router.post("/forgetpassword", async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json("Please provide a valid email");
    };
    const influencer = await Influencer.findOne({email:email});
    if(!influencer){
        return res.status(400).json("User not found , Invalid request!")
    };
    const token = await InfluencerResetToken.findOne({influencer:influencer._id});
    if(token) return res.status(200).json("After one hour you can request for another token")
    

    //Generating Token 
    const RandomTxt = crypto.randomBytes(20).toString("hex");
    const restToken = new InfluencerResetToken({influencer:influencer._id , token:RandomTxt});
    console.log(RandomTxt);
    await restToken.save();

    client.transmissions.send({
        content: {
          from: 'contact@aavelance.com',
          subject: 'Password Reset Successfully ',
          html:`http://localhost:3000/influencer/reset/password?token=${RandomTxt}&_id=${influencer._id}`
        },
        recipients: [
          {address: influencer.email}
        ]
      })
      .then(data => {
        return res.json({success:true, message:"Password reset link is sent to your email"})
      })
      .catch(err => {
        return res.json('Whoops! Something went wrong');
      });


      
})

//reset password
router.put("/reset/password", async (req, res) => {
// try {
    const {token , _id} = req.query;
    if(!token || !_id){
        return res.status(400).json("Invalid request");
    }
    const influencer  = await Influencer.findOne({_id:_id});
    console.log(influencer)
    if(!influencer){
        return res.status(400).json("influencer not found")
    }
    const resetToken = await InfluencerResetToken.findOne({influencer:influencer._id});
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
    influencer.password = secPass;
    await influencer.save();

    client.transmissions.send({
        content: {
          from: 'contact@aavelance.com',
          subject: 'Password Reset Successfully ',
          html:`Password Reset Successfully Now you can login with new password`
        },
        recipients: [
          {address: influencer.email}
        ]
      })
      return res.status(200).json("Done")

})


// router.get("/ma"  , async(req , res)=>{
//   const influencer = await Influencer.find({email:req.body.email}).select("+password");
//   console.log(influencer)
//   res.status(200).json(influencer.password);
// })

//Update influencer password
router.put("/update/password/:id",
 body('newPassword' , "new Password should be min 5 char").isLength({ min: 5 }),
 body('comfirmPassword' , "comfirmPassword should be min 5 char").isLength({ min: 5 }),
  InfluencerverifyToken, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array("Some error occure") });
    }
    try {
        const influencer = await Influencer.findById(req.params.id).select("+password");
        if (!influencer) {
            return res.status(400).json({error:{msg:"influencer doesn't exists"}})
        }
        console.log(influencer)
        const isPasswordMatched = await bcrypt.compare(req.body.oldpassword , influencer.password);
        if (!isPasswordMatched) {
            return res.status(401).json({error:{msg:"Old password is incorrect"}});
        }
        if (req.body.newPassword !== req.body.comfirmPassword) {
            return res.status(401).json({error:{msg:"Password doesn't match"}});
        }

        const salt = await bcrypt.genSalt(10);
        influencer.password = await bcrypt.hash(req.body.newPassword , salt);
        await influencer.save();
        const {password , ...others} = influencer._doc;
        return res.status(200).json({error:{msg:"Your email has been change successfully"}})

    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})


//Update Influencer details
router.put("/change/details/:id", InfluencerverifyToken , async(req , res)=>{
    try {
        const updateinfluencer = await Influencer.findByIdAndUpdate(req.params.id , {
            $set:req.body
        })
        res.status(200).json("Your information was updated")
    } catch (error) {
        res.status(500).json("Internal error occured")
    }
})

//Delete Influencer
router.delete("/:id", InfluencerverifyToken , async(req , res)=>{
    try {
         await Influencer.findByIdAndDelete(req.params.id)
         res.status(200).json("User deleted")
    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})

//Get influencer
router.get("/:id" , mainAdminverifyTokenAndAdmin , async(req , res)=>{
    try{
        let influencer = await Influencer.findById(req.params.id)
        const {password , phoneNumber , ...others} = influencer._doc;
        res.status(200).json(others);
    }catch (error) {
        return res.status(500).json("Internal server error");
    }
})

//Get influencer for himself
router.get("/myself/:id" , InfluencerverifyToken , async(req , res)=>{
  try{
      let influencer = await Influencer.findById(req.params.id)
      const {password , ...others} = influencer._doc;
      res.status(200).json(others);
  }catch (error) {
      return res.status(500).json("Internal server error");
  }
})

//Get all Influancer
router.get("/" , mainAdminverifyTokenAndAdmin , async(req , res)=>{
    try {
        let influencer = await Influencer.find()
        res.status(200).json(influencer);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
})





module.exports = router