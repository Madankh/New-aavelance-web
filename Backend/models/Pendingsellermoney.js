const mongoose = require("mongoose")

const PendingMoneySchema = new mongoose.Schema(
    {
        seller:{
            type:mongoose.Schema.ObjectId,
            ref:"Seller",
            required:true
        },
        amount:{  
            type: Number,
            required: true,
            default: 0
        },
        executeDate:{
            type : Date,
        },
        status:{
            type : String,
            required : true,
            default : "Pending"
        },
        TranfermoneyAt:Date,    
    }, {timestamps:true}
);

module.exports = mongoose.model("Pendingsellermoney" , PendingMoneySchema)