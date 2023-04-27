import { EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons'
import { AddLocationAltOutlined, ApartmentOutlined, AssignmentReturned, DomainAddOutlined, PasswordOutlined, People, Reorder } from '@mui/icons-material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../../component/Navbar'

export default function UpdateInfluencerProfile() {

  let Users = useSelector(state => state.user);
  console.log(Users.currentUser.other);
  const accessToken = Users.currentUser.accessToken;
  console.log(Users.currentUser.other);

  const [email, setEmail] = useState(Users.currentUser.other.email);
  const [phoneNumber, setphoneNumber] = useState(Users.currentUser.other.phoneNumber);
  const [username, setUsername] = useState(Users.currentUser.other.username);
  console.log(Users.currentUser.other.phoneNumber)

  const handleClick = async () => {
    fetch(`http://api.aavelance.com/api/user/${Users.currentUser.other._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: accessToken },
      body: JSON.stringify({
        email: `${email}`,
        phoneNumber: `${phoneNumber}`, username: `${username}`
      })
    }).then(response => {
      response.json()
        .then(data => {
          (console.log(data));
        });
    })
  };

  console.log(email, phoneNumber, username)



  return (
    <div>
      <Navbar />
      <div style={{ width: "100%", height: '100vh', backgroundColor: "black", display: 'flex', paddingTop: 20 }}>
        <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
          <h2 style={{ marginLeft: 20 }}>Your bag</h2>
          <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
            <Reorder style={{ marginLeft: 30, }} />
            <p style={{ marginTop: -0 }}>{0} Your orders</p>
          </div>
          <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
            <People style={{ marginLeft: 30, }} />
            <p style={{ marginTop: -0 }}>{0} Your following</p>
          </div>
          <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
            <AssignmentReturned style={{ marginLeft: 30, }} />
            <p style={{ marginTop: -0 }}>{0} Return orders</p>
          </div>
        </div>

        <div style={{ backgroundColor: "white", flex: 3, marginLeft: 50, marginRight: 150, height: '70vh', width: '40%', borderRadius: 20 }}>
          <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
            <h2 style={{ marginLeft: -90 }}>Your Profile Setting</h2>
            <div>
              <button style={{ marginLeft: '150%', cursor: 'pointer', paddingLeft: 20, paddingRight: 20, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white" }} onClick={handleClick}>Update</button>
              {/* <p style={{marginLeft:'187%' , cursor:'pointer'}}>Edit</p> */}
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <EmailOutlined style={{ marginLeft: -60, }} />
                <p style={{ marginTop: -0 }}>Email</p>
              </div>
              <input style={{ marginTop: -13, marginLeft: -25, padding: 8, width: '80%' }} type="text" placeholder='Khadkasuman0000@gmail.com' onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Phone number</p>
              </div>
              <input style={{ marginTop: -13, marginLeft: -25, padding: 8, width: '80%' }} type="number" placeholder="9803173422" onChange={(e) => setphoneNumber(e.target.value)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Username</p>
              </div>
              {/* <p style={{marginTop:-13 , marginLeft:-36}}>Mahankal</p> */}
              <input style={{ marginTop: -13, marginLeft: -25, padding: 8, width: '80%' }} type="text" placeholder="suman" onChange={(e) => setUsername(e.target.value)} />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
