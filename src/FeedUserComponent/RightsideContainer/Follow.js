import React from 'react'
import image1 from "../Images/profileimg.png";
import addFriends from "../Images/add-user.png";
import UserToFollow from "../Images/afterFollowImg.png"
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Follow({userdetails}) {
  let userDetails = useSelector(state => state.user)
  let id = userDetails?.currentUser?.others?._id;
  const accessToken = userDetails?.currentUser?.accessToken;
  console.log(userdetails._id);

  console.log(id);

    const [Follow , setFollow] = useState(addFriends);
    const handleFollow= async(e)=>{
            await fetch(`http://139.162.11.30:80/api/user/feed/following/${userdetails._id}` , {method:'PUT', headers:{'Content-Type':"application/JSON" , token:accessToken} , body:JSON.stringify({user:`${id}`})})
            setFollow(UserToFollow);
      }
  return (
          <div style={{marginTop:"-10px" , marginLeft:"10px"}} key={userdetails._id}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to={`/user/profile/${userdetails._id}`}>
            <div style={{ display: 'flex', alignItems: "center" }}>
              {userdetails?.profile !== '' ?
              <img src={`${userdetails?.profile}`} className="Profileimage" alt="" />:<img src={`${image1}`} style={{width:"30px" , height:"30px" , borderRadius:"50%"}} />
              }
              <div>
                <p style={{ marginLeft: "10px" , textAlign:'start' }}>{userdetails.username}</p>
                <p style={{ marginLeft: "10px" , textAlign:'start' , marginTop:"-16px" , fontSize:"11px" , color:"#aaa" }}>Suggested for you</p>
              </div>
            </div>
            </Link>
            <div style={{ backgroundColor: "#aaa", padding: '8px', marginRight: 13, borderRadius: "50%" , cursor:'pointer' }} onClick={e=>handleFollow(userdetails._id)}>
              <img src={`${Follow}`} className="addfriend" alt=""  />
            </div>
          </div>
        </div>
  )
}
