import React from 'react'
import "./mainPost.css";
import ContentPost from "../ContentPostContainer/ContentPost"
import Post from '../PostContainer/Post';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function MainPost() {
  let userDetails = useSelector(state => state.user)
  let id = userDetails?.currentUser?.others?._id;
  const accesstoken = userDetails?.currentUser?.accessToken;
  const [post , setPost] = useState([]);
  useEffect(() => {
   const getPost = async()=>{
    try {
      const res = await axios.get(`http://139.162.11.30:80/api/user/flw/${id}` , {
        headers:{
          token:accesstoken
        }
      })
      setPost(res.data);
    } catch (error) {
      
    }
   }
   getPost();
  }, [])


  return (
    <div className='mainPostContainer'>
      <ContentPost/>
      <div style={{marginLeft:"-10px"}}>
      {post.map((item)=>(
        <Post post={item}/>
        ))}
      </div>
   
    </div>
  )
}
