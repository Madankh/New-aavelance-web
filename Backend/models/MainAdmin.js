const mongoose = require("mongoose");
const MainAdminSchema = new mongoose.Schema(
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
        isAdmin:{
            type:Boolean,
            default:true
        },
        isMainAdmin:{
            type:Boolean,
            default:true
        }

    }, {timestamps:true}
);

module.exports = mongoose.model("MainAdmin" , MainAdminSchema)