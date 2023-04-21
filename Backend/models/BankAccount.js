const mongoose = require("mongoose");
const BankAccountSchema = new mongoose.Schema(
    {
        seller:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Seller',
        },
        BankName:{
            type:String,
            required:true
        },
        accountName:{
         type:String,
         required:true
     },
       accountNumber:{
           type:String,
           required:true
       },
       BankAddress:{
        type:String,
        required:true
       },

    }, {timestamps:true}
);




module.exports = mongoose.model("BankAccount" , BankAccountSchema)