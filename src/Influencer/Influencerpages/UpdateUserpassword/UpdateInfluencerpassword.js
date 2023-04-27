import { EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons'
import { AddLocationAltOutlined, ApartmentOutlined, AssignmentReturned, DomainAddOutlined, PasswordOutlined, People, Reorder } from '@mui/icons-material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../component/Navbar'

export default function UpdateInfluencerpassword() {

  let User = useSelector(state => state.user);
  console.log(User);
  const accessToken = User.currentUser.other.accessToken;
  // console.log(accessToken);
  const [oldpassword , setoldpassword] = useState('');
  const [newPassword , setnewPassword] = useState('');
  const [comfirmPassword , setcomfirmPassword] = useState('');

  const clickUpdate = async()=>{
     fetch(`http://api.aavelance.com/api/seller/update/password/${User.currentUser.other._id}` , { method: 'PUT',
          headers: { 'Content-Type': 'application/json' , token : accessToken },
          body: JSON.stringify({
            oldpassword: `${oldpassword}`, newPassword: `${newPassword}`,
            comfirmPassword: `${comfirmPassword}`
          })}).then(response => {
              response.json()
                .then(data => {
                  (console.log(data));
                  
                });
            })
          };

          console.log(oldpassword , newPassword , comfirmPassword)
              
  
  return (
    <div>
      <Navbar />
      <div style={{ width: "100%", height: '100vh', backgroundColor: "black", display: 'flex', paddingTop: 20 }}>

        <div style={{ backgroundColor: "white", flex: 3, marginLeft: 50, marginRight: 150, height: '70vh', width: '40%', borderRadius: 20 }}>
          <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
            <h2 style={{ marginLeft: -90 }}>Your Password Setting</h2>
            <div>
              <button style={{marginLeft:'150%' , cursor:'pointer' , paddingLeft:20 , paddingRight:20 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}} onClick={clickUpdate}>Update</button>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <PasswordOutlined style={{ marginLeft: -60, }} />
                <p style={{ marginTop: -0  }}>Current</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-25 ,  padding:8 , width:'50%'}} type="text"  onChange={(e) => setoldpassword(e.target.value)} />
              <p style={{marginLeft:-33}}>New Password</p>
              <input style={{marginTop:-13 , marginLeft:-25 ,  padding:8 , width:'50%'}} type="text"  onChange={(e) => setnewPassword(e.target.value)} />
              {/* <p style={{marginTop:-13 , marginLeft:-36}}>Khadkasuman0000@gmail.com</p> */}
              <p style={{marginLeft:-33}}>Re-type new</p>
              <input style={{marginTop:-13 , marginLeft:-25 ,  padding:8 , width:'50%'}} type="text"  onChange={(e) => setcomfirmPassword(e.target.value)} />
            </div>
            <Link to={"/Forgot/password"}>
               <p  style={{marginLeft:-33}}>Forgot Password</p>
            </Link>
           
          </div>
        </div>

      </div>
    </div>
  )
}
