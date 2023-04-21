const mongoose = require("mongoose")

const UserMoneySchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        amount:{  
            type: Number,
            required: true
        },
        Sales:{
            type:Number,
            required:true
        },
        status:{
            type : String,
            required : true,
            default : "Pending"
        },
        TranfermoneyAt:Date,    
    }, {timestamps:true}
);

module.exports = mongoose.model("UserMoneyTransaction" , UserMoneySchema)