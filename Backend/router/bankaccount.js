const router = require("express").Router();
const BankAccount = require("..//models/BankAccount");
const Bankaccount = require("..//models/BankAccount");
const { sellerverifyToken } = require("./SellerverifyToken");
const { verifyToken } = require("./verifyToken");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const crypto = require('crypto');
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.BankACEn;
const inVec = process.env.INVEC



router.post("/accountdetail", sellerverifyToken, async (req, res) => {
    let account = await BankAccount.findOne({seller : req.seller.id});
    if(!account){
        // try {
            let cipher = crypto.createCipheriv(algorithm , secretKey , inVec)
            let secBankName =  cipher.update(req.body.BankName, 'utf-8' , "hex")
            let secaccountName = cipher.update(req.body.accountName, 'utf-8' , "hex")
            let secaccountNumber = cipher.update(req.body.accountNumber, 'utf-8' , "hex")
            let secBankAddress = cipher.update(req.body.BankAddress, 'utf-8' , "hex")

            cipher.final('hex');

            let newAccount = new Bankaccount({
            BankName:secBankName, accountName:secaccountName, 
            accountNumber:secaccountNumber, BankAddress:secBankAddress, 
            seller: req.seller.id
        });
        const saveAccout = await newAccount.save();
        res.status(200).json("Bank Account has been added ");
    // } catch (error) {
    //     return res.status(500).json("Some error occure");
    // }
}else{
    return res.status(400).json("your bank account already exist")
}
})

//Update Product
router.put("/:id", sellerverifyToken, async (req, res) => {
    try {

    if (req.params.id === req.seller.id) {
        let seller = await Bankaccount.findOne({ seller: req.params.id });
        let cipher = crypto.createCipheriv(algorithm , secretKey , inVec)
        req.body.BankName = cipher.update(req.body.BankName, 'utf-8' , "hex")
        req.body.accountName = cipher.update(req.body.accountName, 'utf-8' , "hex")
        req.body.accountNumber = cipher.update(req.body.accountNumber, 'utf-8' , "hex")
        req.body.BankAddress = cipher.update(req.body.BankAddress, 'utf-8' , "hex")
        cipher.final('hex');
        
        updateaccount = await Bankaccount.findByIdAndUpdate(
            seller._id, {
            $set: req.body
        }, { new: true })
        await updateaccount.save();
        return res.status(200).json("Successfully update your bank account")
    } else {
        return res.status(400).json("Sorry you got a server error")
    }
            
   } catch (error) {
   return res.status(500).json("Server error occured")     
}
})


router.get("/accountdetail", sellerverifyToken, async (req, res) => {
    try {
        const accounts = await BankAccount.find({ seller: req.seller.id });
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




module.exports = router;