const router = require("express").Router();
const { json } = require("express");
const { verifyToken } = require("./verifyToken");
const messageModel = require("../models/messageModel");
const GroupChat = require("../models/GroupChat");
const User = require("../models/User");


router.post("/send/msg", verifyToken , async(req , res)=>{
    const {chatId , content , image } = req.body;
    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.status(404).json("Server error");
    }

    let newmessage = {
        sender:req.user.id,
        content:content,
        image:image,
        group:chatId
    };

    try {
        let message = await messageModel.create(newmessage);
        message = await message.populate("sender", "profile , username");
        message = await message.populate("group");
        message = await User.populate(message, {
            path: "group.users",
            select: "profile username",
          });

          await GroupChat.findByIdAndUpdate(req.body.chatId,{latestMessage:message })
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

router.get("/get/all/group/msg/:id", verifyToken , async(req , res)=>{
    try {
        const Group = await GroupChat.findById(req.params.id);
        if(Group.users.includes(req.user.id)){
            const messages = await messageModel.find({group:req.params.id})
            .populate("sender" , "username profile email")
            .populate("group");
            return res.status(200).json(messages)
        }else{
            return res.status(404).json("Sorry you are not members of this group")
        }
    } catch (error) {
        return res.status(500).json("Server error")
    }
})


router.get("/get/all" , verifyToken , async(req , res)=>{
    // try {
      const Chatal = await GroupChat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password -isPartner -phoneNumber -Userfollowing -Userfollowers -following -followers -isAdmin -startAt -paymentDateAt -paymentPendingDate -verified -preferences")
      .populate("groupAdmin", "-password -isPartner -phoneNumber -Userfollowing -Userfollowers -following -followers -isAdmin -startAt -paymentDateAt -paymentPendingDate -verified -preferences")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username profile email",
        });
        res.status(200).send(results);
    });
    // } catch (error) {
    //     return res.status(500).json("Server error")
    // }
})
module.exports = router;