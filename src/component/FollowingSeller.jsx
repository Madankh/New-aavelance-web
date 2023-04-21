import React, { useEffect,useState } from 'react'
import Navbar from './Navbar';
import profile from "../Assest/AdobeStock_364410756-1024x683.jpeg"
import { useSelector  } from 'react-redux';
import { publicRequest } from "../../src/requestMethos"
import { Link } from 'react-router-dom';
import "./followingseller.css"
export default function FollowingSeller() {
  
      const [users , setusers] = useState([]);
      let user = useSelector(state => state.user)
      let userid = user?.currentUser?.others?._id;

      useEffect(() => {
            const getusers = async () => {
              try {
                const res = await publicRequest.get(`/user/following/` + userid);
                setusers(res.data);
              } catch (error) {
        
              }
            };
            getusers()
          }, []);

          console.log(users)
        
  return (
    <div>
          <Navbar/>
          <h3 className='followingheadname' >All Your Followings</h3>
          <div className='FollowingitemContainer'>
                  
                  {users.map((item)=>(  
                    <a href={`/profile/${item._id}`} style={{textDecoration:'none'}}>
                        <div className='followingsellerDetailContainer'>
                              <div className='subfollowingsellerDetailContainer'>
                                  <img src={`${profile}`} className="followingsellerimage" alt="" />
                                  <div style={{marginLeft:"10px" , marginTop:"-5px"}}>
                                        <p style={{color:"black" , fontSize:"14px"}}>{item?.shopname}</p>
                                  </div>
                              </div>
                              
                       </div>
                    </a> 
                   ))}
                   

                    
                    
                  
                    
          </div>
    </div>
  )
}
