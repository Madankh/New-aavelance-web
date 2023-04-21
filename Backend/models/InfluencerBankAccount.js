const mongoose = require("mongoose");
const UserBankAccountSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
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

module.exports = mongoose.model("UserBankAccount" , UserBankAccountSchema)