const router = require("express").Router();
const Influencer = require("../models/Influencer");
const UserBankAccount = require("../models/InfluencerBankAccount");
const {InfluencerverifyToken} = require("./InfluencerverifyToken");
const { verifyToken } = require("./verifyToken");
const crypto = require('crypto');
require("dotenv").config();
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.BankACEn;
const inVec = process.env.INVEC

//Create bank account
router.post("/create/bank/account", verifyToken, async(req , res)=>{
    // try {
        
        
        let cipher = crypto.createCipheriv(algorithm , secretKey , inVec)
        let secBankName =  cipher.update(req.body.BankName, 'utf-8' , "hex")
        let secaccountName = cipher.update(req.body.accountName, 'utf-8' , "hex")
        let secaccountNumber = cipher.update(req.body.accountNumber, 'utf-8' , "hex")
        let secBankAddress = cipher.update(req.body.BankAddress, 'utf-8' , "hex")

        cipher.final('hex');
        const newBank = await UserBankAccount.create({
            BankName : secBankName,
            accountName : secaccountName,
            accountNumber : secaccountNumber,
            BankAddress : secBankAddress,
            user : req.user.id
        });
        const saveAccout = await newBank.save();
        res.status(200).json("You successfully add a bank account on aavelance");
    // } catch (error) {
    //    return res.status(500).json("Some error occure");
    // };
});


//Get a user bank
router.get("/user/account" , verifyToken , async(req , res)=>{
    try {
        const accounts = await UserBankAccount.find({ user: req.user.id });
        const decipher = crypto.createDecipheriv(algorithm , secretKey , inVec);
        const account = await Promise.all(accounts.map((item)=>{
            return new Promise((resolve, reject) => {
                item.BankName = decipher.update(item.BankName , "hex" , "utf-8");
                item.accountName = decipher.update(item.accountName , "hex" , "utf-8");
                item.accountNumber = decipher.update(item.accountNumber , "hex" , "utf-8");
                item.BankAddress = decipher.update(item.BankAddress , "hex" , "utf-8");
                console.log(item)
                resolve(item);
            });
        }))
        res.json(account)
    } catch (error) {
        return res.status(400).json('Some error occured')
    }
})

//Update user bankaccount
router.put("/:id", verifyToken, async(req, res) => {
    try {
      const { BankName, accountName, accountNumber, BankAddress } = req.body;
      if (!BankName || !accountName || !accountNumber || !BankAddress) {
        return res.status(400).json("Missing required fields");
      }
      // Validate account number format
      const accountNumberRegex = /^\d{9,18}$/;
      if (!accountNumberRegex.test(accountNumber)) {
        return res.status(400).json("Invalid account number format" );
      }
      const user = await UserBankAccount.findOne({ user: req.params.id });
      if (!user) {
        return res.status(404).json("User bank account not found");
      }
      const cipher = crypto.createCipheriv(algorithm , secretKey , inVec);
      const secBankName = cipher.update(BankName, 'utf-8', 'hex');
      const secaccountName = cipher.update(accountName, 'utf-8', 'hex');
      const secaccountNumber = cipher.update(accountNumber, 'utf-8', 'hex');
      const secBankAddress = cipher.update(BankAddress, 'utf-8', 'hex');
      await UserBankAccount.findByIdAndUpdate(user._id, {
        $set: { BankName: secBankName, accountName: secaccountName, accountNumber: secaccountNumber, BankAddress: secBankAddress }
      }, { new: true });
      return res.status(200).json("Your bank information has been successfully updated" );
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal error occurred" );
    }
  });
  

module.exports = router;