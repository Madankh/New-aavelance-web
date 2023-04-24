import React, { useEffect, useState } from 'react'
import "../Makeup/makeup.css"
import Navbar from '../../component/Navbar'
import Announcement from '../../component/Announcement'
import LiveAnnouncement from '../../component/LiveAnnouncement'
import { useSelector } from 'react-redux';
import axios from 'axios';
import Discover from '../Makeup/Discover'
import Rightbar from "../../FeedUserComponent/RightsideContainer/Rightbar"
export default function MainDiscover() {

  const [Posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`http://139.162.11.30:80/api/post/getallpost`)
        setPosts(res.data);
      } catch (error) {
        console.log("Sorry you got error")
      }
    }
    getPosts();
  }, [])

  

  return (
    <div style={{backgroundColor:"rgb(216 216 219 / 62%)"}}>
    <Navbar/>
    <Announcement />
    <LiveAnnouncement/>
    <div style={{display:"flex" , marginLeft:"14px" }}>
      <div className='leftSide'>
           <Rightbar/>
        
      </div>
        <div className='makeupContent' >
        {Posts.map((item) => (
          <Discover item={item}/>
          ))}
        </div>

    </div>


  </div>
  )
}
