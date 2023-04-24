import { PasswordOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../component/Navbar'
export default function UpdateUserpassword() {

  let User = useSelector(state => state.user);
  const accessToken = User?.currentUser?.accessToken;
  const [oldpassword , setoldpassword] = useState('');
  const [newPassword , setnewPassword] = useState('');
  const [comfirmPassword , setcomfirmPassword] = useState('');
  console.log(accessToken);

  const clickUpdate = async()=>{
     fetch(`http://139.162.11.30:80/api/auth/update/password/${User?.currentUser?.others?._id}` , { method: 'PUT',
          headers: { 'Content-Type': 'application/json' , token : accessToken },
          body: JSON.stringify({
            oldpassword: `${oldpassword}`, newPassword: `${newPassword}`,
            comfirmPassword: `${comfirmPassword}`
          })}).then(response => {
              response.json()
                .then(data => {
                  alert(data.errors.msg)
            });
        })
      };              
  return (
    <div>
      <Navbar />
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
            <Link to={"/Forgot/password"}>
               <p className='forgotpassword'>Forgot Password</p>
            </Link>
           
          </div>


    </div>
  )
}
