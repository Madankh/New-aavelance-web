import React, { useEffect } from 'react'
import "./rightbar.css"
import ads from "../Images/ads.jpg";
import image1 from "../Images/image3.jpg";
import axios from 'axios';
import { useState } from 'react';
import Follow from './Follow';
import { useSelector } from 'react-redux';
export default function Rightbar() {
  let userDetails = useSelector(state => state.user)
  let id = userDetails?.currentUser?.others?._id;
 const [users , setUsers] = useState([]);
  useEffect(() => {
    const getuser = async()=>{
      try {
        const res  = await axios.get(`http://139.162.11.30:80/api/user/all/user/${id}`)
        setUsers(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [])
  console.log(users)
  return (
    <div className='rightbar'>
      <div className='rightcontainer'>
        <div className='adsContainer'>
          <img src={`${ads}`} className="adsimg" alt="" />
          <div>
            <p style={{ textAlign: 'start', marginLeft: '10px', marginTop: -20 }}>CodeDemy</p>
            <p style={{ textAlign: 'start', marginLeft: '10px', fontSize: "12px", marginTop: "-16px" , width:"100px" }}>Buy codedemy course</p>
          </div>
        </div>
        <div className='adsContainer'>
          <img src={`${image1}`} className="adsimg" alt="" />
          <div>
            <p style={{ textAlign: 'start', marginLeft: '10px', marginTop: -20 }}>CodeDemy</p>
            <p style={{ textAlign: 'start', marginLeft: '10px', fontSize: "12px", marginTop: "-16px" }}>Buy codedemy course</p>
          </div>
        </div>

      </div>

      <div className='rightcontainer2'>
        <h4 style={{textAlign:"start" , marginLeft:"10px"}}>Suggested for you</h4>
        <div className='subUser'>
        {users.map((item)=>(
          <Follow userdetails={item}/>
          ))}
        </div>
        

        

      </div>


    </div>
  )
}
