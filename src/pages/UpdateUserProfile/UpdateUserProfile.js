import { EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons'
import { AddLocationAltOutlined } from '@mui/icons-material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../../component/Navbar'
import "./updateuserProfile.css"
export default function UpdateUserProfile() {

  let Users = useSelector(state => state.user);
  const accessToken = Users?.currentUser?.accessToken;

  
  const [email, setEmail] = useState(Users?.currentUser?.other?.email);
  const [phoneNumber, setphoneNumber] = useState(Users?.currentUser?.other?.phoneNumber);
  const [username, setUsername] = useState(Users?.currentUser?.other?.username);
  console.log(Users?.currentUser?.other?.phoneNumber);

  const handleClick = async () => {
    fetch(`https://api.aavelance.com/api/user/${Users?.currentUser?.other?._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: accessToken },
      body: JSON.stringify({
        email: `${email}`, phoneNumber: `${phoneNumber}`, username: `${username}`
      })
    }).then(response => {
      response.json()
        .then(data => {
          alert(data)
        });
    }).catch((err)=>{
      console.log(err.response.message)
    })
  };

  return (
    <div>
      <Navbar />
          <div className='updateuserProfile'>
            <h2 className='yourprofiltext'>Your Profile Setting</h2>
            <div>
              <div className='itemContainerprofile'>
                <EmailOutlined />
                <p>Email</p>
              </div>
              <input className='updateProfileContainer'  type="text" placeholder='Khadkasuman0000@gmail.com' onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <div className='itemContainerprofile'>
                <LocalPhoneOutlined  />
                <p>Phone number</p>
              </div>
              <input className='updateProfileContainer' type="number" placeholder="9803173422" onChange={(e) => setphoneNumber(e.target.value)} />
            </div>

            <div>
              <div className='itemContainerprofile'>
                <AddLocationAltOutlined />
                <p>Username</p>
              </div>
              {/* <p style={{marginTop:-13 , marginLeft:-36}}>Mahankal</p> */}
              <input className='updateProfileContainer' type="text" placeholder="suman" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <button className='btnprofileUpdate' onClick={handleClick}>Update</button>
          </div>
      </div>
  )
}
