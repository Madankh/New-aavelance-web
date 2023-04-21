import { EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons';
import { AddLocationAltOutlined, ApartmentOutlined, DomainAddOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import InfluencerNavbar from '../component/InfluencerNavbar';

export default function UpdateInfluencerProfileDetail() {
  const influencer = useSelector((state) => state.influencer);
  const accessToken = influencer.currentInfluencer.accessToken;
  
  const [email , setEmail] = useState(`${influencer.currentInfluencer.others.email}`);
  const [username , setusername] = useState(`${influencer.currentInfluencer.others.username}`);
  const [phoneNumber , setPhoneNumber] = useState(`${influencer.currentInfluencer.others.phoneNumber}`);
  const [PAN , setPAN] = useState(`${influencer.currentInfluencer.others.PAN}`);
  const [State , setState] = useState(`${influencer.currentInfluencer.others.State}`);
  const [City , setCity] = useState(`${influencer.currentInfluencer.others.City}`)

  const clickUpdate = async()=>{
    fetch(`http://localhost:5000/api/influencer/change/details/${influencer.currentInfluencer.others._id}` , { method: 'PUT',
         headers: { 'Content-Type': 'application/json' , token : accessToken },
         body: JSON.stringify({
          email: `${email}`, PAN: `${PAN}`,
          State: `${State}`, City: `${City}`, phoneNumber: `${phoneNumber}`, username : `${username}`
         })}).then(response => {
             response.json()
               .then(data => {
                  alert(data)
                 
               });
           })
         };

  return (
    <div>
      <InfluencerNavbar />
      <div style={{ width: "100%", height: '100vh', backgroundColor: "black", display: 'flex', paddingTop: 20 }}>
        <div style={{ backgroundColor: "white", flex: 3, marginLeft: 50, marginRight: 150, height: '100vh', width: '100%', borderRadius: 20 }}>
          <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
            <h2 style={{ marginLeft: -90 }}>Your Profile Setting</h2>
            <div>
            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Username</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-23 ,  padding:8 , width:'80%'}} type="text" placeholder='@suman' onChange={(e)=> setusername((e.target.value))} />
            </div>
              
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <EmailOutlined style={{ marginLeft: -60, }} />
                <p style={{ marginTop: -0  }}>Email</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-23 ,  padding:8 , width:'80%'}} type="text" placeholder='Khadkasuman0000@gmail.com' onChange={(e)=> setEmail((e.target.value))} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Phone number</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-23 ,  padding:8 , width:'80%'}} type="text" placeholder='+9779888888888' onChange={(e)=> setPhoneNumber((e.target.value))} />
            </div>


            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Pan_Number</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-23 ,  padding:8 , width:'80%'}} type="text" placeholder='9876161' onChange={(e)=> setPAN((e.target.value))} />
            </div>
                        
            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <ApartmentOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>City</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-23 ,  padding:8 , width:'80%'}} type="text" placeholder='Kathmandu' onChange={(e)=> setCity((e.target.value))} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>State</p>
              </div>
              <input style={{marginTop:-13 , marginLeft:-23 ,  padding:8 , width:'80%'}} type="text" placeholder='Kathmandu' onChange={(e)=> setState((e.target.value))} />
            </div>
            
          </div>
            {/* <Link to={"/seller/update/my/profile"}> */}
                <button onClick={clickUpdate} style={{marginLeft:'0%', width:"100%" , cursor:'pointer' , paddingLeft:0 , paddingRight:0 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white" , marginTop:100}}>Update</button>
            {/* </Link> */}
        </div>

      </div>
    </div>
  )
}
