const mongoose = require("mongoose");
const crypto = require("crypto");
const SellerSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        }, 
        password:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true,
            unique:true

        },
        avatar:{
            type:String,
        },
        shopname:{
            type:String,
            required:true,
            unique:true
        },

        shopAddress:{
            type:String,
            required:true,
        },
        Pan_Number:{
            type:Number,
            required:true,
            unique:true
        },
        Post_Number:{
            type:Number,
            required:true,
        },
        National_id:{
            type:String,
            required:true,
        },
        followers:{
            type:Array,
            default:[]
    
        },
        following:{
            type:Array,
            default:[]
    
        },
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        isSeller:{
            type:Boolean,
            default:true
        },
        startAt:{
            type:Date
        },
        paymentDateAt:{
            type:Date
        },
        paymentPendingDate:{
          type:Date  
        },
        verified:{
            type:Boolean,
            default:false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,

    }, {timestamps:true}
);

SellerSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("Seller" , SellerSchema)