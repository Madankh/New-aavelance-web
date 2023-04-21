const router = require("express").Router();
const { json } = require("express");
const GroupChat = require("../models/GroupChat");
const { verifyToken } = require("./verifyToken");
const User = require("../models/User");


router.post("/create/group", verifyToken, async (req, res) => {
    if (!req.body.users || !req.body.Chatname) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
  
    let users = JSON.parse(req.body.users);
    users.push(req.user.id);
  
    try {
      const groupChat = await GroupChat.create({
        Chatname: req.body.Chatname,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user.id,
      });
  
      const fullGroupChat = await GroupChat.findOne({ _id: groupChat._id })
      .populate("users", "-password -isPartner -phoneNumber -Userfollowing -Userfollowers -following -followers -isAdmin -startAt -paymentDateAt -paymentPendingDate -verified -preferences")

        

  
      return res.status(200).json(fullGroupChat);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Server error");
    }
  });
  


// rename the group name
router.put("/rename/group", verifyToken , async(req , res)=>{
    try {
        const {chatId , Chatname} = req.body;
        const updateChatName = await GroupChat.findByIdAndUpdate(chatId,{
            Chatname:Chatname
        },{
            new:true,
        }).populate("users" , "-password").populate("groupAdmin" , "-password");
        if(!updateChatName){
            return res.status(400).json("Sorry we got a error")
        };        
        return res.status(200).json("Your group Name is successfully updated")
        
    } catch (error) {
        return res.status(500).json("Server error")
    }
})

router.get("/groups", verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find all groups where the user is a member or admin
      const groups = await GroupChat.find({
        $or: [{ users: userId }, { groupAdmin: userId }]
      }).populate("users", "-password").populate("groupAdmin", "-password");
      groups.sort((a, b) => b.createdAt - a.createdAt);
      return res.status(200).json({ groups });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
});
  

// Remove a user from group
router.put("/remove/user" , verifyToken , async(req, res)=>{
    try {
        const {chatId , userId} = req.body;
        
        const removedUser = await GroupChat.findByIdAndUpdate(chatId,{
            $pull:{users:userId},
        },{
            new:true
        }).populate("users", "-password -isPartner -phoneNumber -Userfollowing -Userfollowers -following -followers -isAdmin -startAt -paymentDateAt -paymentPendingDate -verified -preferences");


        if(!removedUser){
            return res.status(404).json("Sorry you got a server error , Please try again");
        }
        
        return res.status(200).json("User is successfully remove from your group");
        
    } catch (error) {
        return res.status(500).json("Server error")
    }
    })


///Add a user in a group
router.put("/add/user" , verifyToken , async(req, res)=>{
    // try {
        const {chatId , userId} = req.body;
        //add a user to the group
        const addNewUserToGroup = await GroupChat.findByIdAndUpdate(chatId,{
            $push:{users:userId},
        },{
            new : true
        }).populate("users", "-password -isPartner -phoneNumber -Userfollowing -Userfollowers -following -followers -isAdmin -startAt -paymentDateAt -paymentPendingDate -verified -preferences")
        if(!addNewUserToGroup){
            return res.status(404).json("Sorry you got a server error");
        }
        return res.status(200).json("Your successfully added a new user to the group")  
    // } catch (error) {
    //     return res.status(500).json("Server error")
    // }
})
module.exports = router;