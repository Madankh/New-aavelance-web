const mongoose = require("mongoose");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema(
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
        profile:{
            type:String,
            default:""
        },
        phoneNumber:{
            type:Number,
            required:true,
            unique:true

        },
        followers:{
            type:Array,
            default:[]
    
        },
        following:{
            type:Array,
            default:[]
    
        },
        Userfollowers:{
            type:Array,
            default:[]
    
        },
        Userfollowing:{
            type:Array,
            default:[]
    
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        isPartner:{
            type:Boolean,
            default:false
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
        preferences: {
            beauty:{
                type:Number,
                default:0
            },
            fashion:{
                type:Number,
                default:0
            },
            kids:{
                type:Number,
                default:0
            },
          },
        resetPasswordToken: String,
        resetPasswordExpire: Date,

    }, {timestamps:true}
);


module.exports = mongoose.model("User" , UserSchema)
