import React from 'react'
import { useSelector } from 'react-redux'
import ProfileLeftbar from "../ProfileLeftsidecontainer/ProfileLeftbar";
import ProfileMainPost from "../ProfileMainPostContainer/ProfileMainPost";
import { Footer } from '../component/Footer';
import Navbar from '../component/Navbar';
import "./profile.css";


export default function Profile() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails.user
  console.log(user)
  return (
    <div>
    <div className='ProfileContainer'>
          <Navbar/>
          <div className='subProfileContainer'>
                    <ProfileLeftbar/>
                    <ProfileMainPost/>
          </div>
    </div>
    <Footer/>
    </div>
  )
}
