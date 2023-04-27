import React, { useState } from 'react'
import "./post.css";
import LikeIcon from "../Images/like.png";
import CommentIcon from "../Images/speech-bubble.png";
import UserProfile from "../../Assest/UserProfile.png"
import anotherlikeicon from "../Images/setLike.png"
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { publicRequest } from '../../requestMethos';

export default function Post({ post }) {
  let userDetails = useSelector(state => state.user)
  let id = userDetails?.currentUser?.others?._id;
  const accessToken = userDetails?.currentUser?.accessToken;
  const [user, setuser] = useState([]);
  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`http://api.aavelance.com/api/user/post/user/details/${post.user}`)
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
  const [show, setshow] = useState(false);
  const productLink = post?.ProductLinks[0]?.slice(35,90);
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
      await fetch(`http://api.aavelance.com/api/post/${post._id}/like`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken } })
      setLike(anotherlikeicon);
      setCount(count + 1);
    } else {
      await fetch(`http://api.aavelance.com/api/post/${post._id}/like`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken } })
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
    await fetch(`http://api.aavelance.com/api/post/comment/post`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken }, body: JSON.stringify(comment) })
    setComments(Comments.concat(comment));
  }

  const handleComment = () => {
    addComment();
  }


  const handleshow = () => {
    if (show === false) {
      setshow(true)
    } else {
      setshow(false)
    }
  }
 


  return (
    <div className='PostContainerr'> 
      <div className='SubPostContainer'>
        <div>
          <div style={{ display: 'flex', alignItems: "center" }}>
            {user?.profile == '' ? <img src={`${UserProfile}`} className="userprofileImage" alt="" /> : <img src={`${user?.profile}`} className="profileImage" alt="" />}

            <div>
              <p style={{ marginLeft: '5px', textAlign: "start" }}>{user.username}</p>
              <p style={{ fontSize: "11px", textAlign: "start", marginLeft: 5, marginTop: -13, color: "#aaa" }}>Following by suman</p>
            </div>
          </div>
          <p style={{ textAlign: 'start', width: "96%", marginLeft: 10, marginTop: 0 }}>{post.title}</p>
          {post?.image !== '' ? <img src={`${post.image}`} className='PosttImage' alt="" /> : post.video !== ''? <video src={`${post?.video}`} controls controlsList="nodownload" className='PosttImage'></video>:""
            }
          {product !== null && product !== '' ? 
          <div className='productContainer'>
            {product?.img?.slice(0,1).map((item)=>(
              <img src={`${item}`} className="ProductImageForPost"  alt="" />
              ))}
            <div style={{ marginLeft: "10px" }}>
              <p className='productTextforpost'>{product?.title?.slice(0,60)}</p>
              <p className='productTextdescforpost'>{product?.desc?.slice(0,70)}</p>
            </div>
           
            <a href={`/product/find/${productLink}`}>
              <button className='btnforpost' style={{ paddingLeft: "38px", paddingRight: "30px", border: "none", marginRight: "10px", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "white", color: "black", borderRadius: "10px", cursor: "pointer", marginBottom: "42px", fontWeight: "600" }}>Buy</button>
            </a>
            
          </div>
          :''
          }

          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <img src={`${Like}`} className="iconsforPost" onClick={handleLike} alt="" />
                <p style={{ marginLeft: "6px" }}>{count} Likes</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginLeft: 20, cursor: "pointer" }} onClick={handleshow}>
                <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p>
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
    </div>
  )
}
