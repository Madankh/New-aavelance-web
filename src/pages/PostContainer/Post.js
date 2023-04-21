import React, { useState } from 'react'
import "./posts.css";
import LikeIcon from "../../FeedUserComponent/Images/like.png"
import anotherlikeicon from "../../FeedUserComponent/Images/setLike.png"
import UserProfile from "../../Assest/UserProfile.png"
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { publicRequest } from '../../requestMethos';
import Modal from 'react-modal';
import CommentIcon from "../../FeedUserComponent/Images/speech-bubble.png";
export default function Post({ post }) {
  let userDetails = useSelector(state => state.user)
  let users = userDetails?.user;
  let id = userDetails?.currentUser?.others?._id;
  const accessToken = userDetails?.currentUser?.accessToken;



  const [user, setuser] = useState([]);
  console.log(user)
  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`http://192.168.18.4:5000/api/user/post/user/details/${post.user}`)
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [])
  
  const [Like, setLike] = useState([post.like.includes(id) ? anotherlikeicon : LikeIcon]);
  const [count, setCount] = useState(post?.like?.length);
  const [Comments, setComments] = useState(post.comments);
  const [commentwriting, setcommentwriting] = useState('');
  const [productitem , setproductitem] = useState('');
  const [show, setshow] = useState(false);
  const productLink = post?.ProductLinks[0]?.slice(35,90);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  console.log(productLink)
  console.log(post?.ProductLinks[0])
  const [product , setproduct] = useState('');
  
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products/find/` + productLink);
        setproduct(res.data);
      } catch (error) {

      }
    };
    getProduct()
  }, []);
console.log(product)

  const handleLike = async () => {
    if (Like == LikeIcon) {
      await fetch(`http://192.168.18.4:5000/api/post/${post._id}/like`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken } })
      setLike(anotherlikeicon);
      setCount(count + 1);
    } else {
      await fetch(`http://192.168.18.4:5000/api/post/${post._id}/like`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken } })
      setLike(LikeIcon)
      setCount(count - 1);
    }
  }

  const addComment = async () => {
    const comment = {
      "postid": `${post._id}`,
      "username": `${userDetails?.currentUser?.others?.username}`,
      "comment": `${commentwriting}`,
      "profile": `${userDetails?.currentUser?.others?.profile}`
    }
    await fetch(`http://192.168.18.4:5000/api/post/comment/post`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken }, body: JSON.stringify(comment) })
    setComments(Comments.concat(comment));
  }

  const handleComment = () => {
    addComment();
  }

  const handleClick = (post)=>{
    if(modalIsOpen == false){
      setModalIsOpen(true);
      setproductitem(post);
    }
  }

  const handleshow = () => {
    if (show === false) {
      setshow(true)
    } else {
      setshow(false)
    }
  }
 


  return (
    <div className='HomePostContainer' onClick={()=>handleClick(post)}> 
      <div className='HomeSubPostContainer'>

          <div style={{ display: 'flex', alignItems: "center" }}>
            {user?.profile == '' ? <img src={`${UserProfile}`} className="HomeuserprofileImage" alt="" /> : <img src={`${user?.profile}`} className="HomeprofileImage" alt="" />}

            <div>
              <p style={{ marginLeft: '5px', textAlign: "start" , fontSize:11 , color:"black" }}>{user.username}</p>
              <p style={{ fontSize: 11, textAlign: "start", marginLeft: 5, marginTop: -10, color: "#aaa" }}>User who already buy</p>
            </div>
          </div>
          <p style={{ textAlign: 'start', width: "96%", marginLeft: 4, marginTop: -6 , fontSize:11 , color:"black"}}>{post.title.slice(0,50)}</p>
          {post?.image !== '' ? <img src={`${post.image}`} className='HomePosttImage' alt="" /> : post.video !== ''? <video src={`${post?.video}`} controls controlsList="nodownload" className='HomePosttImage'></video>:""
            }
          {product !== null && product !== '' ? 
          <div>
          <div className='HomeproductContainer'>
            {product?.img?.slice(0,1).map((item)=>(
              <img src={`${item}`} className="HomeProductImageForPost"  alt="" />
              ))}
            <div style={{ marginLeft: "10px" }}>
              <p className='HomeproductTextforpost'>{product?.title?.slice(0,30)}..</p>
              <p className='HomeproductTextdescforpost'>{product?.desc?.slice(0,50)}</p>
            </div>
           
          </div>
            <a href={`/product/find/${productLink}`}>
              <button className='Homebtnforpost' style={{ }}>Buy</button>
            </a>
          </div>
          :''
          }


          
        </div>

        <Modal
       isOpen={modalIsOpen}
       onRequestClose={() => setModalIsOpen(false)}
       contentLabel="Create New Group"
       style={{
        content: {
        width: "45%",
        height: "70%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        padding: "20px",
        border: "none",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
         },
         overlay: {
           backgroundColor: "rgb(255 255 255 / 93%)",
         },
         }}>
          <div style={{display:"flex"}}>
          <div style={{flex:2}}>
            {post?.image == "" ? <video src={`${post?.video}`} controls controlsList="nodownload" style={{width:"100%" , height:"100vh" , marginTop:"-300px"}}></video> : 
            <img src={`${post?.image}`} style={{width:"100%"}} className=""  alt="" />}
          </div>
          <div style={{flex:2}}>
            <div style={{display:"flex" , justifyContent:"space-between"}}>
              <div style={{display:"flex" , alignItems:"center" , marginLeft:"20px"}}>
                <img src={`https://news.artnet.com/app/news-upload/2022/12/prisma-labs-lensa-ai.jpg`} style={{width:"30px" , height:"30px", borderRadius:"50%"}} className=""  alt="" />
                <p style={{marginLeft:"10px"}}>Suman</p>
              </div>
              <div style={{marginTop:"10px"}}>
                <button style={{paddingLeft:"25px" ,color:"white" ,borderRadius:"10px", paddingRight:"25px" , paddingTop:"4px" , paddingBottom:"4px" , backgroundColor:"black"}}>Follow</button>
              </div>
            </div>
            <p style={{marginLeft:"30px"}}>{post?.title}</p>
            {product !== null && product !== '' ? 
            <div style={{marginTop:'-10px' , marginLeft:"15px"}}>
             <div className='productContainer'>
               {product?.img?.slice(0,1).map((item)=>(
                   <img src={`${item}`} className="makeProductImageForPostt"  alt="" />
                   ))}
               <div style={{ marginLeft: "10px" }}>
                 <p className='productdesincontent' >{product?.title?.slice(0,30)}</p>
                 <p className='otherproductdesincontent' >{product?.desc?.slice(0,50)}</p>
               </div>
              
               
             </div>
               <a href={`/product/find/${productLink}`}>
                 <button className='btnformakeup' style={{ width:"100%",border: "none", 
                 marginRight: "10px", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "black", color: "white", 
                 borderBottomLeftRadius: "10px", cursor: "pointer", marginBottom: "0px", fontWeight: "600" 
                 }}>Buy</button>
               </a>
            </div>
          :''
          }
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                {id == undefined || null ? 
                <a href='/login' style={{textDecoration:"none"}}>
                <div style={{display:"flex" , alignItems:"center"}}>
                  <img src={`${Like}`} className="iconsforPost"  alt="" />
                  <p style={{ marginLeft: "6px" }}>{count} Likes</p>
                </div>
                </a>
              :
              <div style={{display:"flex" , alignItems:"center"}}  onClick={handleLike} >
              <img src={`${Like}`} className="iconsforPost"  alt="" />
              <p style={{ marginLeft: "6px" }}>{count} Likes</p>
            </div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", marginLeft: 20, cursor: "pointer" }} onClick={handleshow}>
              {id == undefined || null ? 
              <a href='/login' style={{textDecoration:"none"}}>
                <div style={{display:"flex" , alignItems:"center"}} >
                  <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p>
                </div>
              </a>
              :
              <div style={{display:"flex" , alignItems:"center"}} onClick={handleshow}>
                <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p>
            </div>}
                {/* <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p> */}
              </div>
            </div>

          </div>

          {show === true ?
            <div style={{ padding: '10px' }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={`${user?.profile}`} className="PostImage" alt="" />
                {/* <p style={{marginLeft:"6px"}}>Suman</p> */}
                <input type="text" className='commentinput' placeholder='Write your thought' onChange={(e) => setcommentwriting(e.target.value)} />
                <button className='addCommentbtn' onClick={handleComment}>Post</button>
              </div>
              {Comments.map((item) => (
                <div style={{ alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {item.profile === '' ?
                      <img src={`https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`} className="PostImage" alt="" /> : <img src={`${item.profile}`} className="PostImage" alt="" />
                    }
                    <p style={{ marginLeft: "6px", fontSize: 18, marginTop: 6 }}>{item.username}</p>
                  </div>
                  <p style={{ marginLeft: "55px", textAlign: 'start', marginTop: -16 }}>{item.comment}</p>
                  <p style={{ marginLeft: "55px", textAlign: 'start', marginTop: -10, color: "#aaa", fontSize: 11 }}>Reply</p>

                </div>

              ))}
            </div> : ''
          }
          </div>
          </div>
    </Modal>
      </div>
    // </div>
  )
}
