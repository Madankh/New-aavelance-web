const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        content:{type:String , trim:true},
        image: {type: String , default: null
        },
        group:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group"
        },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    }
)

module.exports = mongoose.model("Message" , messageModel );