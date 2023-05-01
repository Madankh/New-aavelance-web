import React, { useEffect, useState } from 'react'
import "../Makeup/makeup.css"
import Navbar from '../../component/Navbar'
import Announcement from '../../component/Announcement'
import LiveAnnouncement from '../../component/LiveAnnouncement'
import { useSelector } from 'react-redux';
import axios from 'axios';
import MakeupContent from '../Makeup/makeupContent'
import Rightbar from "../../FeedUserComponent/RightsideContainer/Rightbar"
export default function FashionContent() {

  let userDetails = useSelector(state => state.user)


  const [Posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/post/getallpost?category=Women's Fashion`)
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
    <div style={{display:"flex" , marginLeft:"13px"}}>
      <div className='leftSide'>
           <Rightbar/>
        
      </div>
        <div className='makeupContent' >
        {Posts.map((item) => (
          <MakeupContent item={item}/>
          ))}
        </div>

    </div>


  </div>
  )
}
