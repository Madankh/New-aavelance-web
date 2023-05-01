import React, { useEffect } from 'react'
import "./profilemainPost.css";
import Coverimage from "../Assest/AdobeStock_364410756-1024x683.jpeg"
import ContentPost from '../FeedUserComponent/ContentPostContainer/ContentPost';
import Post from '../ProfilePostContainer/Post';
import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
export default function ProfileMainPost() {
  const [post , setPost] = useState([]);
  let location = useLocation();
  let id = location.pathname.split("/")[3];
  
  useEffect(() => {
    const getPost = async()=>{
      try {
        const res = await axios.get(`https://api.aavelance.com/api/post/get/post/${id}`)
        setPost(res.data);
      } catch (error) {
        console.log("error occured")
      }
    }
    getPost();
  }, [id])

  return (
    <div className='ProfilemainPostContainer'>
      <div>
        <img src={`${Coverimage}`} className="profileCoverimage" alt="" />
        <h2 style={{marginTop:-43 , color:"white" , textAlign:"start" , marginLeft:"34px"}}>Your Profile</h2>
      </div>
      <ContentPost/>
      {post?.map((item)=>(
        <Post detail={item}/>
      ))}
    </div>
  )
}
