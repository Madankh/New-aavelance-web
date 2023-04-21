import { EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons'
import { AddLocationAltOutlined, ApartmentOutlined, AssignmentReturned, DomainAddOutlined, PasswordOutlined, People, Reorder } from '@mui/icons-material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Topbar from '../components/topbar/Topbar';

export default function UpdateSellerpassword() {

  const admin = useSelector((state) => state.seller);
  let accessToken = admin.currentSeller.accessToken;

  const [oldpassword , setoldpassword] = useState('');
  const [newPassword , setnewPassword] = useState('');
  const [comfirmPassword , setcomfirmPassword] = useState('');

  const clickUpdate = async()=>{
     fetch(`http://192.168.18.4:5000/api/seller/update/password/${admin.currentSeller._id}` , { method: 'PUT',
          headers: { 'Content-Type': 'application/json' , token : accessToken },
          body: JSON.stringify({
            oldpassword: `${oldpassword}`, newPassword: `${newPassword}`,
            comfirmPassword: `${comfirmPassword}`
          })}).then(response => {
              response.json()
                .then(data => {
                  alert(data);
                  console.log(data)
                  
                });
            })
          };

          console.log(oldpassword , newPassword , comfirmPassword)
              
  
  return (
    <div>
      <Topbar/>
      <div className='updateuserProfile'>
            <h2 className='yourprofiltext'>Your Password Setting</h2>
            <div>
              <div className='itemContainerprofile'>
                <PasswordOutlined style={{  }} />
                <p >Old password</p>
              </div>
              <input className='updateProfileContainer' type="password"  onChange={(e) => setoldpassword(e.target.value)} />
              <p >New Password</p>
              <input className='updateProfileContainer' type="password"  onChange={(e) => setnewPassword(e.target.value)} />
              <p>Re-type new</p>
              <input className='updateProfileContainer' type="password"  onChange={(e) => setcomfirmPassword(e.target.value)} />
            </div>
            <button className='btnprofileUpdate' onClick={clickUpdate}>Update</button>
            <Link to={"/Seller/Forgot/password"}>
               <p className='forgotpassword'>Forgot Password</p>
            </Link>
           
          </div>
    </div>
  )
}
