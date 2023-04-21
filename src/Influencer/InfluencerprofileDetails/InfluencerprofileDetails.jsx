import { AccountBalanceOutlined, EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons'
import { AddLocationAltOutlined, ApartmentOutlined, BadgeOutlined, DomainAddOutlined, DriveFileRenameOutline, LocationCityOutlined, PasswordOutlined, People, Reorder } from '@mui/icons-material'
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import InfluencerNavbar from '../component/InfluencerNavbar';

export default function InfluencerprofileDetails() {
  const influencer = useSelector((state) => state.influencer);
  const id = influencer?.currentInfluencer?.others?._id;
  console.log(id)
  const accessToken = influencer.currentInfluencer.accessToken;
  const [userDetails , setuserDetails] = useState('');
  const [BankAccountDetails , setBankAccountDetails] = useState([]);
  useEffect(() => {
        const getTransaction = async()=>{
          try {
            const res = await axios.get(`http://localhost:5000/api/influencer/bank/account`, {
              headers:{
                token: accessToken
              }
            })
            setBankAccountDetails(res.data);
          } catch (error) {
            
          }
        }
        getTransaction();
      }, [0])


      useEffect(() => {
        const getUser = async()=>{
          try {
            const res = await axios.get(`http://localhost:5000/api/influencer/myself/${id}`, {
              headers:{
                token: accessToken
              }
            })
            setuserDetails(res.data);
          } catch (error) {
            
          }
        }
        getUser();
      }, [0])

console.log(userDetails)


      
      {BankAccountDetails.map((item)=>{
        console.log(item)
      })}
  return (
    <div>
      <InfluencerNavbar />
      <div style={{ width: "100%", height: '108vh', backgroundColor: "black", display: 'flex', paddingTop: 20 }}>
      {BankAccountDetails != ''?  
      BankAccountDetails.map((item)=>(

        <div style={{ backgroundColor: "white", flex: 1.6, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
          <h2 style={{ marginLeft: 20 }}>Bank Details</h2>
          <div style={{ alignItems: "center", cursor: 'pointer' }}>
            <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
              <AccountBalanceOutlined/>
              <p>Bank Acc Number</p>
            </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item.accountNumber}</p>
          </div>
          <div style={{alignItems: "center", cursor: 'pointer' }}>
            <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
              <DriveFileRenameOutline/>
            <p>Bank Acc Name</p>
            </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item.accountName}</p>

          </div>
          <div style={{alignItems: "center", cursor: 'pointer' }}>
          <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
            <BadgeOutlined/>
            <p>Bank Name</p>
          </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item.BankName}</p>
          </div>

          <div style={{ alignItems: "center", cursor: 'pointer' }}>
            <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
              <LocationCityOutlined/>
              <p>Bank Branch Address</p>
            </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item.BankAddress}</p>
          </div>

          <Link to={"/update/Influencer/bank"}>
              <button style={{ cursor:'pointer' , width:'100%',  paddingLeft:35 , paddingRight:35 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}}>Edit</button>
          </Link>

        </div>   )) : <div style={{ backgroundColor: "white", flex: 1.6, marginLeft: 150, marginRight: 50, height: '40vh', width: '40%', borderRadius: 20 }}>
    
          <h2 style={{ marginLeft: 20 }}>Bank Details</h2>
            <p style={{fontSize:20 , color:'green' , marginTop:30 , marginLeft:10}}>You don't have a bank account details</p>
            <p style={{marginTop:-19 , marginLeft:10}}>Add bank account details</p>
          <div style={{ alignItems: "center", cursor: 'pointer' }}>
          <Link to={"/add/influencer/bank/account"}>
              <button style={{marginLeft:60,marginTop:50, cursor:'pointer' , width:'60%',  paddingLeft:35 , paddingRight:35 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}}>Add bank account</button>
          </Link>
        </div>
        </div>}
        

        <div style={{ backgroundColor: "white", flex: 3, marginLeft: 50, marginRight: 150, height: '100vh', width: '40%', borderRadius: 20 }}>
          <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
            <h2 style={{ marginLeft: -90 }}>Your Profile Setting</h2>
            <div>
              {/* <p style={{marginLeft:'187%' , cursor:'pointer'}}>Edit</p> */}
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <EmailOutlined style={{ marginLeft: -60, }} />
                <p style={{ marginTop: -0  }}>Email</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:-36}}>{userDetails?.email}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Username</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:-36}}>{userDetails?.username}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Phone Number</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:-36}}>{userDetails?.phoneNumber}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Pan_Number</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:-36}}>{userDetails?.PAN}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Followers</p>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>State</p>
              </div>
              <p style={{marginTop:-17 , marginLeft:-36}}>{userDetails?.State}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>City</p>
              </div>
              <p style={{marginTop:-17 , marginLeft:-36}}>{userDetails?.City}</p>
            </div>
            <Link to={"/update/influencer/personal/data"}>
                <button style={{width:'170%' , cursor:'pointer'   , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white" , marginTop:0}}>Edit</button>
            </Link>
          </div>

        <div style={{ marginLeft: '0%', marginTop: 135, backgroundColor: "black" }}>
            <Link to={"/update/influencer/password"}>
              <button style={{ marginLeft: '75%', cursor: 'pointer', paddingLeft: 30, paddingRight: 30, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white", position: 'relative', marginTop: 19 }}>Edit</button>
            </Link>
            {/* <p style={{marginLeft:'17%' , cursor:'pointer'}}>Edit</p> */}
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer', marginLeft: '9%' }}>
              <PasswordOutlined style={{ marginLeft: 0, color: "white" }} />
              <p style={{ marginTop: -0, color: "white" }}>Chanage your password</p>
            </div>
            <p style={{ marginTop: -13, marginLeft: '9%', color: "#8e8e8e" }}>It's a good idea to use a strong password that you're not using elsewhere</p>
          </div>

        </div>

      </div>
    </div>
  )
}
