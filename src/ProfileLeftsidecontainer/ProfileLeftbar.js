import React, { useEffect } from 'react'
import "./profileleftbar.css";
import image from "../Assest/AdobeStock_364410756-1024x683.jpeg"
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
export default function ProfileLeftbar() {
  let userDetails = useSelector(state => state.user)
  let location = useLocation();
  const accessToken = userDetails?.currentUser?.accessToken;
  let id = location.pathname.split("/")[3];
  let ids = userDetails?.currentUser?.others?._id;
  const [Follow, setUnFollow] = useState([userDetails?.currentUser?.others?.Userfollowing?.includes(id) ? "Unfollow" : "Follow"]);

  const [users, setuser] = useState([]);
  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`http://172.232.73.46:80/api/user/post/user/details/${id}`)
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [id])
  let followersCounter = users?.followers?.length;
  let followingCounter = users?.following?.length;

  const [Followinguser, setFollowinguser] = useState([]);
  useEffect(() => {
    const getFollowing = async () => {
      try {
        const res = await axios.get(`http://172.232.73.46:80/api/post/following/${id}`);
        setFollowinguser(res.data);
      } catch (error) {
        console.log("Error")
      }
    }
    getFollowing();
  }, [id])

  const handleFollow = async () => {
    if (Follow === "Follow") {
      await fetch(`http://172.232.73.46:80/api/user/following/${id}`, { method: 'PUT', headers: { 'Content-Type': "application/JSON", token: accessToken }, body: JSON.stringify({ user: `${userDetails?.currentUser?.others?._id}` }) })
      setUnFollow("UnFollow")
    } else {
      await fetch(`http://172.232.73.46:80/api/user/following/${id}`, { method: 'PUT', headers: { 'Content-Type': "application/JSON", token: accessToken }, body: JSON.stringify({ user: `${userDetails?.currentUser?.others?._id}` }) })
      setUnFollow("Follow")
    }
  }

  return (
    <div className='ProfileLeftbar'>
      <div className='ProfiledetailUserContainer'>
        <img src={`${image}`} className="ProfilepageCover" alt="" />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: -30 }}>
          <img src={`${users.profile}`} className="Profilepageimage" alt="" />
          <div>
            <p style={{ marginLeft: 6, marginTop: 20, color: "black", textAlign: 'start' }}>{users.username}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Followings</p>
          <p style={{ color: "black", marginRight: 20, fontSize: "12px", marginTop: 17 }}>{followingCounter}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -20 }}>
          <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Followers</p>
          <p style={{ color: "black", marginRight: 20, fontSize: "12px", marginTop: 17 }}>{followersCounter}</p>
        </div>
        {userDetails?.currentUser?.others?._id !== id ? "" :
          <div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -20 }}>
              <Link to={"/user/earning"} style={{ textDecoration: "none" }}>
                <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Check Your Earning</p>
              </Link>
            </div>

          

            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <Link to={"/order"} style={{ textDecoration: "none" }}>
                <p style={{ color: "black", marginLeft: 20, fontSize: "14px" , marginTop:-5 }}>Your orders</p>
              </Link>
            </div>

          </div>
        }

        {userDetails?.currentUser?.others?._id !== id ? <div onClick={handleFollow}><button style={{ width: "100%", paddingTop: 7, paddingBottom: 7, border: "none", backgroundColor: "green", color: "white" }}>{Follow}</button></div> : <div><Link to={"/my/profile"}><button style={{ width: "100%", paddingTop: 7, paddingBottom: 7, border: "none", backgroundColor: "green", color: "white" }}>Setting</button></Link></div>}
      </div>

      <div className='ProfiledetailUserContainer1'>
        <h3>Followings</h3>
        <div style={{ display: "flex", justifyContent: 'space-between' }}>
          <p style={{ marginLeft: 10 }}>Friends</p>
          <p style={{ marginRight: 10, color: "#aaa" }}>See all</p>
        </div>
        <div style={{ display: 'flex', flexWrap: "wrap", marginLeft: 5 }}>
          {Followinguser?.map((item) => (
            <Link to={`/user/profile/${item._id}`}>
              <div style={{ marginLeft: 4, cursor: "pointer" }} key={item._id}>
                <img src={`${item.profile}`} className="friendimage" alt="" />
                <p style={{ marginTop: -2 }}>{item.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
