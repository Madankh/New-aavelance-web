import {EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons';
import { AddLocationAltOutlined, ApartmentOutlined, DomainAddOutlined, PasswordOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Topbar from '../components/topbar/Topbar';

export default function UpdateSellerProfileDetail() {
  const Seller = useSelector((state) => state.seller);
  const [email, setEmail] = useState(Seller?.currentSeller?.email);
  const [phoneNumber, setphoneNumber] = useState(Seller?.currentSeller?.phoneNumber);
  const [shopname, setshopname] = useState(Seller?.currentSeller?.shopname);
  const [shopAddress, setshopAddress] = useState(Seller?.currentSeller?.shopAddress);
  const [Pan_Number, setPan_Number] = useState(Seller?.currentSeller?.Pan_Number);
  const [Post_Number, setPost_Number] = useState(Seller?.currentSeller?.Post_Number);
  const [National_id, setNational_id] = useState(Seller?.currentSeller?.National_id);
  const [username, setusername] = useState(Seller?.currentSeller?.username);
  const accessToken = Seller?.currentSeller?.accessToken;
  
  const handleClick = async () => {
    fetch(`http://localhost:5000/api/seller/${Seller?.currentSeller?._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: accessToken },
      body: JSON.stringify({
        email: `${email}`, phoneNumber: `${phoneNumber}`, username: `${username}` , shopname:`${shopname}` , Pan_Number:`${Pan_Number}` , Post_Number:`${Post_Number}`, National_id:`${National_id}` , shopAddress:`${shopAddress}`
      })
    }).then(response => {
      response.json()
        .then(data => {
          alert(data)
        });
    })
  };

  // console.log(email , phoneNumber , shopname ,shopAddress , Pan_Number , Post_Number , National_id , username )
  return (
    <div>
      <Topbar />
      <div style={{ width: "100%", backgroundColor: "black", display: 'flex', paddingTop: 20 }}>
        <div style={{   width: '100%', backgroundColor:"white" , marginLeft:"10px" , padding:"4px" }}>
          {/* <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}> */}
            <h2>Your Profile Setting</h2>
            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <EmailOutlined  />
                <p style={{ marginTop: -0  }}>Email</p>
              </div>
              <input style={{marginTop:-13  ,  padding:8 , width:'80%'}} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Khadkasuman0000@gmail.com' />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined />
                <p style={{ marginTop: -0 }}>Phone number</p>
              </div>
              <input style={{marginTop:-13 ,  padding:8 , width:'80%'}} type="text" placeholder='9800000000' onChange={(e) => setphoneNumber(e.target.value)} />
            </div>

            <div>
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
              <PasswordOutlined  />
              <p style={{ marginTop: -0 }}>Shopname</p>
            </div>
            <input style={{marginTop:-13 ,  padding:8 , width:'80%'}} type="text" placeholder="shop Name" onChange={(e) => setshopname(e.target.value)} />
          {/* </div> */}

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined  />
                <p style={{ marginTop: -0 }}>shopAddress</p>
              </div>
              <input style={{marginTop:-13 , padding:8 , width:'80%'}} type="text" placeholder='Shop Address' onChange={(e) => setshopAddress(e.target.value)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined  />
                <p style={{ marginTop: -0 }}>Pan_Number</p>
              </div>
              <input style={{marginTop:-13 , padding:8 , width:'80%'}} type="text" placeholder='010101' onChange={(e) => setPan_Number(e.target.value)} />
            </div>
           
            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined />
                <p style={{ marginTop: -0 }}>National_id</p>
              </div>
              <input style={{marginTop:-13 ,padding:8 , width:'80%'}} type="text" placeholder='4444444' onChange={(e) => setNational_id(e.target.value)} />
            </div>

           
            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <ApartmentOutlined  />
                <p style={{ marginTop: -0 }}>City</p>
              </div>
              <input style={{marginTop:-13 ,  padding:8 , width:'80%'}} type="text" placeholder='City' onChange={(e) => setphoneNumber(e.target.value)} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <ApartmentOutlined  />
                <p style={{ marginTop: -0 }}>Post_Number</p>
              </div>
              <input style={{marginTop:-13  ,  padding:8 , width:'80%'}} type="text" placeholder='Post_Number' onChange={(e) => setPost_Number(e.target.value)} />
            </div>
            

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined />
                <p style={{ marginTop: -0 }}>State</p>
              </div>
              <input style={{marginTop:-13 ,  padding:8 , width:'80%'}} type="text" placeholder='Bagmati' onChange={(e) => setusername(e.target.value)} />
            </div>
            

          </div>
            <Link to={"/seller/update/my/profile"}>
                <button style={{marginLeft:'0%', width:"100%" , cursor:'pointer' , paddingLeft:0 , paddingRight:0 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white" , marginTop:150}} onClick={handleClick}>Update</button>
            </Link>
        </div>
      </div>
    </div>
  )
}
