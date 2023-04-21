const mongoose = require("mongoose");
const GroupSchema = new mongoose.Schema({
    Chatname:{
        type:String,
        require:true
    },
    isGroupChat:{
        type:Boolean
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ],
    latestMessage:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

})
module.exports = mongoose.model("Group" , GroupSchema );