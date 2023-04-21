const router = require('express').Router();
const User = require("..//models/User");
// const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const { S3Client ,PutObjectCommand, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const {mainAdminverifyTokenAndAdmin} = require('./mainAdminverify');
const bcrypt = require('bcryptjs');
const Seller = require('../models/Seller');
const Post = require('../models/Post');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const bucketNAME= process.env.BUCKET_NAME;
const bucketREGION= process.env.BUCKET_REGION;
const accessKEY= process.env.ACCESS_KEY;
const secretaccess= process.env.SECRETACCESS;


const s3 = new S3Client({
    region:bucketREGION,
    credentials:{
          accessKeyId:accessKEY,
          secretAccessKey:secretaccess
    },
})

//Update User
router.put("/:id",verifyToken , async(req , res)=>{
    try {
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        req.body.password = secPass;
    } 
    try {
        const updateuser = await User.findByIdAndUpdate(req.params.id , {
            $set:req.body
        })
        res.status(200).json("You successfully update your details")
    } catch (error) {
        return res.status(400).json("Some error occured")
    }
            
} catch (error) {
     return res.status(500).json("Internal error occured")   
}
})

//Delete User
router.delete("/:id",verifyTokenAndAuthorization , async(req , res)=>{
    try {
         await User.findByIdAndDelete(req.params.id)
         res.status(200).json("User deleted")
    } catch (error) {
        return res.status(500).json("Some error occure")
    }
})

// Get user by mainAdmin
router.get("/:id" , mainAdminverifyTokenAndAdmin , async(req , res)=>{
    try {
        let user = await User.findById(req.params.id)
        const {password , phoneNumber , ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})


// Get user for himself
router.get("/own/:id" , verifyToken , async(req , res)=>{
    try {
        let user = await User.findById(req.params.id)
        const {password , ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})


// // Get all user
router.get("/" , mainAdminverifyTokenAndAdmin , async(req , res)=>{
    try {
        let user = await User.find()
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})



/// Get a Following user
router.get("/following/:id" , async(req , res)=>{
    try {
          const user = await User.findById(req.params.id);
          const followingsseller = await Promise.all(
                user.following.map((item)=>{
                      return Seller.findById(item)
                })
          )

          let followersList=[];
          followingsseller.map((person)=>{
                const {email, password , phoneNumber ,paymentDateAt,paymentPendingDate ,shopAddress, 
                Following ,state,username ,National_id ,Pan_Number,startAt ,verified, Post_Number,city ,
                 ...others} = person._doc;
                followersList.push(others);
          })

          return res.status(200).json(followersList);
    } catch (error) {
         return res.status(500).json("Internal server error")
    }
})

//Following
router.put("/feed/following/:id" , verifyToken , async(req , res)=>{
    if(req.params.id !== req.body.user){
        const user = await User.findById(req.params.id);
        const otheruser = await User.findById(req.body.user);

        if(!user.Userfollowers.includes(req.body.user)){
            await user.updateOne({$push:{Userfollowers:req.body.user}});
            await otheruser.updateOne({$push:{Userfollowing:req.params.id}});
            return res.status(200).json("User has followed");
        }else{
            await user.updateOne({$pull:{Userfollowers:req.body.user}});
            await otheruser.updateOne({$pull:{Userfollowing:req.params.id}});
            return res.status(200).json("User has Unfollowed");
        }
    }else{
        return res.status(400).json("You can't follow yourself")
    }
})


//Fetch post from following
router.get("/flw/:id", verifyToken, async (req, res) => {
    try {

        const { page, limit } = req.query;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const user = await User.findById(req.params.id);
        const followersPost = await Promise.all(
            user.Userfollowing.map((item) => {
                return Post.find({ user: item });
            })
        );

        const userPost = await Post.find({ user: user._id });
        let filterproduct = userPost.concat(...followersPost);

        // Assign a weight to each post based on its age and likes
        filterproduct.forEach((post) => {
            const postAge = new Date() - new Date(post.createdAt);
            const ageWeight = 1 - postAge / (1000 * 60 * 60 * 24); // weight decreases as post gets older
            const likeWeight = post.like.length / 100;
            const commentWeight = post.comments.length / 100;
            post.weight = ageWeight + likeWeight + commentWeight;
        });
        
        // Sort posts based on their weight
        filterproduct.sort((a, b) => b.weight - a.weight);

        // const subsetPosts = filterproduct.slice(startIndex, endIndex);
        for(let post of filterproduct){
            if(post.image !== ""){

                  const getObjectParams = {
                        Bucket:bucketNAME,
                        Key:post.image,
                  }
                  const command = new GetObjectCommand(getObjectParams);
                  const url = await getSignedUrl(s3 , command);
                  post.image = url;
            }
        }
        for(let post of filterproduct){
            if(post.video !== ""){

                  const getObjectParamss = {
                        Bucket:bucketNAME,
                        Key:post.video,
                  }
                  const commandd = new GetObjectCommand(getObjectParamss);
                  const urll = await getSignedUrl(s3 , commandd);
                  post.video = urll;
            }
        }
        res.status(200).json(filterproduct);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
});





//get user details for post
router.get("/post/user/details/:id" , async(req , res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(400).json("User not found")
        }
        const {email , password , phonenumber , ...others}=user._doc;
        res.status(200).json(others);
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})

//get user to follow
router.get("/all/user/:id" , async(req , res)=>{
    try {
        const allUser = await User.find();
        const user = await User.findById(req.params.id);
        const followinguser = await Promise.all(
            user.Userfollowing.map((item)=>{
                return item;
            })
        )
        let UserToFollow = allUser.filter((val)=>{
            return !followinguser.find((item)=>{
                return val._id.toString()===item;
            })
        })

        let filteruser = await Promise.all(
            UserToFollow.map((item)=>{
                const {email , phonenumber , followers , following , password , ...others} = item._doc;
                return others
            })
        )

        res.status(200).json(filteruser)
    } catch (error) {
        
    }
})

//get user to follow
router.get("/all/user" , async(req , res)=>{
    try {
        const allUser = await User.find();
        let filteruser = await Promise.all(
            allUser.map((item)=>{
                const {email , phonenumber , followers , following , password , ...others} = item._doc;
                return others
            })
        )
        return res.status(200).json(filteruser)
    } catch (error) {
        
    }
})



module.exports = router