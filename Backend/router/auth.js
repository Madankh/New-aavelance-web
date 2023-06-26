const router = require("express").Router();
const User = require("..//models/User");
const { body, validationResult } = require('express-validator');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { verifyToken } = require("./verifyToken");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require("path");
const { generateOTP } = require("../utils/mail");
const ResetToken = require("../models/ResetToken");
const { isValidObjectId } = require("mongoose");
require("dotenv").config();
const VerificationTokenOTP = require("../models/verificationToken")
const sparkPostTransport = require('nodemailer-sparkpost-transport')
const transporter = nodemailer.createTransport(sparkPostTransport({
    'sparkPostApiKey': process.env.SPARKPOSTAPIKEY
}))
const {OTPTem, generatePasswordResetTemplate} = require('../router/mail')

//Register 
router.post("/register",
    [
        body('email', 'Enter your valid email').isEmail(),
        body('username', "Enter a valid username").isLength({ min: 3 }),
        body('password').isLength({ min: 5 }),
        body('phoneNumber', "Number must be 10 digit").isLength({ min: 10 })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array("Some error occure") });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json("Please login With correct password");
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)

            const newuser = await User.create({
                username: req.body.username,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                avatar: req.body.avatar,
                password: secPass,
                startAt: Date.now(),
                paymentDateAt: new Date(Date.now() + 12096e5),
                paymentPendingDate: new Date(Date.now() + 12096e5),
            })
            const accessToken = jwt.sign({
                id: newuser._id,
                username:newuser.username,
                isAdmin: newuser.isAdmin,
                
            }, process.env.JWT_SEC, { expiresIn: "7d" })

            let OTP = generateOTP();
            let verificationTokenOTP =  await VerificationTokenOTP.create({
                user: newuser._id,
                token:OTP
            })
            // await verificationTokenOTP.save();
            verificationTokenOTP.save().then(()=>{
                transporter.sendMail({
                    from: "contact@aavelance.com",
                    to: req.body.email,
                    subject: 'Verify your account in Aavelance',
                    html:OTPTem(OTP)
                  }).then(()=>{
                    return res.json({status:"Pending", message:"Verification email sent" , user:newuser._id}
                  )
                  })
            })
            await newuser.save();

        } catch (error) {
            return res.status(500).json("Internal error occured")
        }
    })

//Verify email
router.post("/verify/email" , async(req , res)=>{
  const {user , OTP} = req.body;
//   if(!user || OTP.trim()) return res.status(400).json("Invalid request, missing parameters")
  
  const mainuser = await User.findById(user);
  console.log(mainuser)
  if(!mainuser) return res.status(400).json("Sorry user not found")
  if(mainuser.verified) return res.status(200).json('This account is already verifyed');

  const token = await VerificationTokenOTP.findOne({user:mainuser._id});
  if(!token) return res.status(400).json("Sorry, user not found");

//   const isMatched = await token.compareToken(OTP);
  console.log(token.token);  
  const isMatched = await bcrypt.compareSync(OTP ,  token.token);
//   console.log(compareToken)
  
  if(!isMatched) return res.status(400).json("Please provide a valid token");
  mainuser.verified = true;
  await VerificationTokenOTP.findByIdAndDelete(token._id);
  await mainuser.save();
  const accessToken = jwt.sign({
    id: mainuser._id,
    username:mainuser.username,
    isAdmin: mainuser.isAdmin,
    
}, process.env.JWT_SEC, { expiresIn: "7d" })
  const {password , ...others} = mainuser._doc;
  transporter.sendMail({
    from: "contact@aavelance.com",
    to: mainuser.email,
    subject: 'Thank you for Verify ',
    html: `<p>Email verified Successfully</p>`
  }).then(()=>{
    return res.json(
        {others , accessToken}
    )
  })
  
})


//Login
router.post('/login', [
    body('email', 'Enter your valid email').isEmail(),
    body('password', 'Enter your valid password').exists(),
], async (req, res) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array("Some error occure") });
    }
        const user = await User.findOne({ email: req.body.email }).select("+password");
        if (!user) {
            return res.status(400).json("Some error occured");
        }
        if(user.verified === false){
            return res.json("You are not verify user please verify your account")
        }else{
            const comparePassword = await bcrypt.compare(req.body.password, user.password);
    
            if (!comparePassword) {
                return res.status(400).json("Password is incorrected")
            }
            const accessToken = jwt.sign({
                id: user._id,
                username:user.username,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SEC, { expiresIn: "7d" })
            const { password, ...others } = user._doc;
            res.status(200).json({ others, accessToken })
        }
    } catch (error) {
        return res.status(400).json("Internal error")
    }
})

// Search a user in order to create a group
router.get("/get/search/user" , verifyToken , async(req, res)=>{
    try {

    const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
  return res.status(200).json(users);      
} catch (error) {
      return res.status(500).json("Internal server error")  
}
})

//Forget Password
router.post("/forgetpassword", async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json("Please provide a valid email");
    };
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(400).json("User not found , Invalid request!")
    };
    const token = await ResetToken.findOne({user:user._id});
    if(token) return res.status(200).json("After one hour you can request for another token")
    

    //Generating Token 
    const RandomTxt = crypto.randomBytes(20).toString("hex");
    const restToken = new ResetToken({user:user._id , token:RandomTxt});
    await restToken.save();
    console.log(RandomTxt);
    await restToken.save();
    transporter.sendMail({
        from: "contact@aavelance.com",
        to: user.email,
        subject: 'Password Reset ',
        html:generatePasswordResetTemplate(`https://www.aavelance.com/reset/password?token=${RandomTxt}&_id=${user._id}`)
        // html: `http://139.162.11.30:80/reset/password?token=${RandomTxt}&_id=${user._id}`
      })

      res.json({success:true, message:"Password reset link is sent to your email"})
      
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
    const user  = await User.findOne({_id:_id});
    console.log(user)
    if(!user){
        return res.status(400).json("User not found")
    }
    const resetToken = await ResetToken.findOne({user:user._id});
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
    user.password = secPass;
    await user.save();
    transporter.sendMail({
        from: "contact@aavelance.com",
        to: user.email,
        subject: 'Password Reset Successfully ',
        html: `Password Reset Successfully Now you can login with new password`
    })
    await ResetToken.findOne({user:user._id})
    res.json("Done")

  } catch (error) {
    return res.status(403).json("Internal error")
  }
})




//Update user password
router.put("/update/password/:id", verifyToken, [
   
    body('newPassword' , "Password should be min 5 char").isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array("Some error occure") });
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({errors:{meg:"user doesn't exists"}})
        }

        const isPasswordMatched = await bcrypt.compare(req.body.oldpassword , user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({errors:{msg:"Old password is incorrect"}});
        }
        if (req.body.newPassword !== req.body.comfirmPassword) {
            return res.status(401).json({errors:{msg:"Password doesn't match"}});
        }


        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword , salt);
        // const secPass = await bcrypt.hash(req.body.password, salt)
        await user.save();

        res.status(200).json("Your password is successfully change")

    } catch (error) {
        return res.status(500).json("Internal error occured")
    }

})

module.exports = router;
