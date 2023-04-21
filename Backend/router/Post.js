const router = require("express").Router();

const { S3Client ,PutObjectCommand } = require("@aws-sdk/client-s3");
const Post = require("../models/Post");
const crypto  = require("crypto")
const Seller = require("../models/Seller");
const User = require("../models/User");
const { verifyToken } = require("./verifytoken");
const multer  = require('multer')
const sharp = require('sharp');
const storage = multer.memoryStorage()
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const { basename } = require('path');
const fs = require('fs');
const os = require('os');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


const upload = multer({ storage: storage })
const dotenv = require("dotenv");
dotenv.config();
const randomfileName = (bytes = 32)=>crypto.randomBytes(bytes).toString('hex')
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
//Create Post
router.post("/user/post" , verifyToken , upload.fields([
      { name: 'image', maxCount: 1 },
    ]) , async(req , res)=>{
      
         
         const fileBuffer = await sharp(req.files.image[0].buffer)
         .jpeg({ quality: 40 })
         .toBuffer()
         const imageName = randomfileName();
            const params = {
                  Bucket : bucketNAME,
                  Key : imageName,
                  Body:fileBuffer,
                  ContentType:req.files.image[0].mimetype,
            }

            const command = new PutObjectCommand(params);
            await s3.send(command)
            let {title  , ProductLinks , subcategories , categories} = req.body;
            let newpost = new Post({
             title , image:imageName , subcategories , categories , video:"" , ProductLinks , user:req.user.id 
            })
            const post = await newpost.save()
            res.status(200).json(post)
      //     } catch (error) {
      //               return res.status(500).json("Internal error occured")
      //     }
})

//Create Post
router.post('/user/post/video', verifyToken, upload.fields([{ name: 'video', maxCount: 1 }]), async (req, res) => {
      try {
        const videoBuffer = req.files.video[0].buffer;
        console.log(req.files)
        const fileName = randomfileName();

        const compressedFileName = fileName + "-920x520.mp4";
        const tempFilePath = os.tmpdir() + '/' + fileName + '.mp4';
        
        // Write buffer to temp file
        fs.writeFileSync(tempFilePath, videoBuffer);
        
        // Compress video using ffmpeg
        await new Promise((resolve, reject) => {
          ffmpeg(tempFilePath)
            .output(compressedFileName)
            .videoCodec('libx264')
            .audioCodec('aac')
            .audioBitrate('128k')
            .size('720x480')
            .aspectRatio('4:3')
            .videoBitrate('1000k')
            .outputOptions('-crf 23')
            .on('error', function (error) {
              console.log("error: " + error.message);
              reject(error);
            })
            .on('progress', function (progress) {
              console.log("frames" + progress.frames);
            })
            .on('end', function () {
              console.log("Finished processing");
              resolve();
            })
            .run();
        });
        
        // Read compressed file into buffer
        const compressedBuffer = fs.readFileSync(compressedFileName);
        
        const params = {
          Bucket: bucketNAME,
          Key: fileName,
          Body: compressedBuffer,
          ContentType: req.files.video[0].mimetype
        };
    
        const command = new PutObjectCommand(params);
        await s3.send(command);
    
        // Delete the temporary video file and HLS files
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(compressedFileName);
    
        const VideoName = randomfileName();
        // Save the video post data in the database
        const { title, ProductLinks, subcategories, categories } = req.body;
        const newpost = new Post({
          title,
          image: '',
          subcategories,
          categories,
          video: fileName,
          ProductLinks,
          user: req.user.id,
        });
        const post = await newpost.save();
        res.status(200).json(post);
    
      } catch (error) {
        console.error(error);
        res.status(500).json('Internal error occurred');
      }
    });
    
  

//upload post by one user
router.get("/get/post/:id" , async(req , res)=>{
          try {
                   const mypost = await Post.find({user:req.params.id});
                   if(!mypost){
                    return res.status(200).json("You don't have any post")
                   }
                   for(let post of mypost){
                        console.log(mypost)
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
                    for(let post of mypost){
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
                   res.status(200).json(mypost)
          } catch (error) {
                res.status(500).json("Internal server error")    
          }
})

//update user post
router.put("/update/post/:id" , verifyToken , async(req ,res)=>{
          try {
                   let post = await Post.findById(req.params.id);
                   if(!post){
                    return res.status(400).json("Post does not found")
                   };
                   
                   post = await Post.findByIdAndUpdate(req.params.id , {
                    $set:req.body
                   })
                   let updatepost = await post.save();
                   res.status(200).json(updatepost);
          } catch (error) {
                   return res.status(500).json("Internal error occured") 
          }
})

//Like
router.put("/:id/like" ,verifyToken, async(req , res)=>{
      try {
            const post = await Post.findById(req.params.id);
            if(!post.like.includes(req.user.id)){
                  if(post.dislike.includes(req.user.id)){
                        await post.updateOne({$pull:{dislike:req.user.id}})
                  }
                  await post.updateOne({$push:{like:req.user.id}})
                  return res.status(200).json("Post has been liked")
                  
            }else{
                  await post.updateOne({$pull:{like:req.user.id}});
                  return res.status(200).json("Post has been unlike")
            }
            
      } catch (error) {
       return res.status(500).json("Internal server error ")     
      }
})
//Dislike
router.put("/:id/dislike" ,verifyToken, async(req , res)=>{
      try {
            const post = await Post.findById(req.params.id);
            if(!post.dislike.includes(req.user.id)){
                  if(post.like.includes(req.user.id)){
                        await post.updateOne({$pull:{like:req.user.id}})
                  }
                  await post.updateOne({$push:{dislike:req.user.id}})
                  return res.status(200).json("Post has been disliked")
            }else{
                  await post.updateOne({$pull:{dislike:req.user.id}});
                  return res.status(200).json("Post has been unlike")
            }
            
      } catch (error) {
            return res.status(500).json("Internal server error")
      }

})


// Get all Product for User with it's Category
router.get("/getallpost", async (req, res) => {
      const qCategory = req.query.category;
      const qsubCategory = req.query.subcategories;
      try {
            let posts;
            if (qCategory && qsubCategory) {
                posts = await Post.find({
                    categories: { $in: [qCategory] },
                    subcategories: { $in: [qsubCategory] }
                })
                .sort({ likes: -1, comments: -1 });
            } else if (qCategory) {
                posts = await Post.find({
                    categories: { $in: [qCategory] },
                })
                .sort({ likes: -1, comments: -1 });
            } else if (qsubCategory) {
                posts = await Post.find({
                    subcategories: { $in: [qsubCategory] },
                })
                .sort({ likes: -1, comments: -1 });
            } else {
                posts = await Post.find()
                .sort({ likes: -1, comments: -1 });
            }
            
            posts.forEach((post) => {
                  const postAge = new Date() - new Date(post.createdAt);
                  const ageWeight = 1 - postAge / (1000 * 60 * 60 * 24); // weight decreases as post gets older
                  const likeWeight = post.like.length / 100;
                  const commentWeight = post.comments.length / 100;
                  post.weight = ageWeight + likeWeight + commentWeight;
              });
              
              // Sort posts based on their weight
              posts.sort((a, b) => b.weight - a.weight);
      
          let post = await Promise.all(posts.map(async(item)=>{
             
                  if(item.image !== ""){
      
                        const getObjectParams = {
                              Bucket:bucketNAME,
                              Key:item.image,
                        }
                        const command = new GetObjectCommand(getObjectParams);
                        const url = await getSignedUrl(s3 , command);
                        item.image = url;
                        return item
                  }
      
      
                  if(item.video !== ""){
      
                        const getObjectParamss = {
                              Bucket:bucketNAME,
                              Key:item.video,
                        }
                        const commandd = new GetObjectCommand(getObjectParamss);
                        const urll = await getSignedUrl(s3 , commandd);
                        item.video = urll;
                        return item
                  }
                }));
          
          return res.status(200).json(post)
      } catch (error) {
          return res.status(500).json("Internal error occure")
      }
  })

  


//Comment 
router.put("/comment/post" , verifyToken , async(req , res)=>{
      try {
            const {comment , postid , profile} = req.body;
            const comments={
                  user:req.user.id,
                  username:req.user.username,
                  comment,
                  profile
            }
            const post = await Post.findById(postid);
            post.comments.push(comments);
            await post.save();
            return res.status(200).json(post);
      } catch (error) {
            return res.status(500).json("Internal server error")
      }
})

//Delete post 
router.delete("/delete/post/:id" , verifyToken , async(req , res)=>{
      try {
            const post = await Post.findById(req.params.id);
            if(post.user === req.user.id){
                  const deletepost = await Post.findByIdAndDelete(req.params.id);
                  return res.status(200).json("You post has been deleted")
            }else{
                  return res.status(400).json("You are not allow to delete this post")
            }
      } catch (error) {
            return res.status(500).json("Internal server error")
      }
})

/// Get a Following user
router.get("/following/:id" , async(req , res)=>{
      try {
            const user = await User.findById(req.params.id);
            console.log(user)
            const followinguser = await Promise.all(
                  user.Userfollowing.map((item)=>{
                        return User.findById(item);
                  })
            )

            let followingList=[];
            followinguser.map((person)=>{
                  const {email, password , phonenumber , Userfollowing , Userfollowers , ...others} = person._doc;
                  followingList.push(others);
            })

            return res.status(200).json(followingList);
      } catch (error) {
           return res.status(500).json("Internal server error")
      }
})

/// Get a Following user
router.get("/followers/:id" , async(req , res)=>{
      try {
            const user = await User.findById(req.params.id);
            const followersuser = await Promise.all(
                  user.Userfollowing.map((item)=>{
                        return User.findById(item)
                  })
            )

            let followersList=[];
            followersuser.map((person)=>{
                  const {email, password , phonenumber , Userfollowing , Userfollowers , ...others} = person._doc;
                  followersList.push(others);
            })

            return res.status(200).json(followersList);
      } catch (error) {
           return res.status(500).json("Internal server error")
      }
})


module.exports = router;