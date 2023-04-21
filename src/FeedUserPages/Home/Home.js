import React from 'react'
import { useSelector } from 'react-redux'
// import Leftbar from '../../Component/Leftsidecontainer/Leftbar'
import MainPost from "../../FeedUserComponent/MainPostContainer/MainPost"
// import Rightbar from '../../Component/RightsideContainer/Rightbar'
import Rightbar from "../../FeedUserComponent/RightsideContainer/Rightbar"
import "./home.css"
import Navbar from '../../component/Navbar'
import Announcement from '../../component/Announcement'
import { Footer } from '../../component/Footer'
import LiveAnnouncement from '../../component/LiveAnnouncement'
export default function Home() {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user
  console.log(user)
  return (
    <div>
      <div className='home'>
        <Navbar />
        <Announcement />
        <LiveAnnouncement/>
        <div className="HomeConainerForFeed">
          <Rightbar />
          <MainPost />
        </div>
      </div>
      <Footer />
    </div>
  )
}
