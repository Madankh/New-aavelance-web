import React, { useEffect, useState } from 'react'
import "../Makeup/makeup.css"
import Navbar from '../../component/Navbar'
import Announcement from '../../component/Announcement'
import LiveAnnouncement from '../../component/LiveAnnouncement'
import axios from 'axios'
import ImageIcon from "../../Assest/image.png"
import VideoIcon from "../../Assest/video.png"
import MakeupContent from './makeupContent'
import Rightbar from '../../FeedUserComponent/RightsideContainer/Rightbar'
export default function Makeup() {

  const [Posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`http://139.162.11.30:5000/api/post/getallpost?category=Beauty and Personal Care`)
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
      <div style={{display:"flex" , marginLeft:"15px"}}>
        <div className='leftSide'>
        <Rightbar/>
        </div>
          <div className='makeupContent' >
          {Posts.map((item) => (
            <MakeupContent item={item} />
            ))}
          </div>

      </div>


    </div>
  )
}
