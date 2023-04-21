const mongoose = require("mongoose");
const crypto = require("crypto");
const InfluencerSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        }, 
        password:{
            type:String,
            required:true,
            select:false
        },
        phoneNumber:{
            type:Number,
            required:true,
            unique:true
        },
        PAN:{
            type:Number,
            required:true,
        },
        State:{
            type:String,
            required:true
        },
        City:{
            type:String,
            required:true
        },
        isInfluencer:{
            type:Boolean,
            default:true
        },
        followers:{
            type:Array,
            default:[]
    
        },
        following:{
            type:Array,
            default:[]
    
        },
        startAt:{
            type:Date,
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



InfluencerSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetpasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("Influencer" , InfluencerSchema)