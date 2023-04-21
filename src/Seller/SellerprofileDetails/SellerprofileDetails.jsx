import { AccountBalanceOutlined, EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons'
import { AddLocationAltOutlined, ApartmentOutlined, BadgeOutlined, DomainAddOutlined, DriveFileRenameOutline, LocationCityOutlined, PasswordOutlined, People, Reorder } from '@mui/icons-material'
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import Topbar from '../components/topbar/Topbar'

export default function SellerprofileDetails() {
  const admin = useSelector((state) => state.seller);
  let accessToken = admin.currentSeller.accessToken;
  let followingLength = admin.currentSeller.followers.length;
  const [Bank , setBank] = useState([]);

  useEffect(() => {
    const getBank = async ()=>{
        try {
            const res = await axios.get(`http://localhost:5000/api/bankaccout/accountdetail` , {
              headers: {
                token: accessToken
              }})
            setBank(res.data);
          } catch (error) {
              
          }
      }
      getBank();

  }, [])

  // console.log(Bank)

  return (
    <div>
      <Topbar />
      <div style={{ width: "100%",  backgroundColor: "black",  paddingTop: 20 }}>
      {Bank != ''?  
          Bank?.map((item)=>(

         
      <div style={{ backgroundColor: "white",  marginRight: 10,  borderRadius: 20, marginLeft:"10px"  }}>
          <h2 style={{ marginLeft: 20 }}>Bank Details</h2>
          <div style={{ alignItems: "center", cursor: 'pointer' }}>
            <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
              <AccountBalanceOutlined/>
              <p>Bank Acc Number</p>
            </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item?.accountNumber}</p>
          </div>
          <div style={{alignItems: "center", cursor: 'pointer' }}>
            <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
              <DriveFileRenameOutline/>
            <p>Bank Acc Name</p>
            </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item?.accountName}</p>

          </div>
          <div style={{alignItems: "center", cursor: 'pointer' }}>
          <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
            <BadgeOutlined/>
            <p>Bank Name</p>
          </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item?.BankName}</p>
          </div>

          <div style={{ alignItems: "center", cursor: 'pointer' }}>
            <div style={{display:'flex' , alignItems:'center' , marginLeft:10}}>
              <LocationCityOutlined/>
              <p>Bank Branch Address</p>
            </div>
            <p style={{marginTop:-13 , marginLeft:36}}>{item?.BankAddress}</p>
          </div>

          <Link to={"/seller/update/bank/account"}>
              <button style={{ cursor:'pointer' , width:'100%',  paddingLeft:35 , paddingRight:35 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}}>Edit</button>
          </Link>

        </div> )) : <div style={{ backgroundColor: "white", marginRight: 10,borderRadius: 20 }}>
          <h2 style={{ marginLeft: 20 }}>Bank Details</h2>
            <p style={{fontSize:20 , color:'green' , marginTop:30 , marginLeft:10}}>You don't have a bank account details</p>
            <p style={{marginTop:-19 , marginLeft:10}}>Add bank account details</p>
          <div style={{ alignItems: "center", cursor: 'pointer' }}>
          <Link to={"/seller/add/bank/account"}>
              <button style={{marginLeft:60,marginTop:50, cursor:'pointer' , width:'60%',  paddingLeft:35 , paddingRight:35 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}}>Add bank account</button>
          </Link>
        </div>
        </div>}
        

        <div style={{ backgroundColor: "white",  marginRight: 10, borderRadius: 20 , marginLeft:"10px" }}>
          <div style={{ backgroundColor: "white", marginRight: 10,  borderRadius: 20 , marginLeft:"15px" }}>
            <h2>Your Profile Setting</h2>
            <div>
              {/* <p style={{marginLeft:'187%' , cursor:'pointer'}}>Edit</p> */}
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <EmailOutlined style={{ marginLeft: -0, }} />
                <p style={{ marginTop: 10  }}>Email</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:-0 , marginLeft:10}}>{admin.currentSeller.email}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined />
                <p style={{ marginTop: 10 }}>Phone number</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:10}}>{admin.currentSeller.phoneNumber}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined  />
                <p style={{ marginTop: 10 }}>Shopname</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:10 }}>{admin.currentSeller.shopname}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined />
                <p style={{ marginTop: 10 }}>shopAddress</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:10}}>{admin.currentSeller.shopAddress}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined />
                <p style={{ marginTop: 10 }}>Pan_Number</p>
              </div>
              <p style={{marginTop:-13 , marginLeft:10 }}>{admin.currentSeller.Pan_Number}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined />
                <p style={{ marginTop: 10 }}>Followers</p>
              </div>
              <p style={{marginTop:-10 , marginLeft:10}}>{admin.currentSeller.followers.length}</p>
            </div>

            

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <ApartmentOutlined />
                <p style={{ marginTop: 10 }}>National_id</p>
              </div>
              <p style={{marginTop:-10 , marginLeft:10 }}>{admin.currentSeller.National_id}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined  />
                <p style={{ marginTop: 10 }}>State</p>
              </div>
              <p style={{marginTop:-10 , marginLeft:10}}>{admin.currentSeller.state}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined />
                <p style={{ marginTop: 10 }}>City</p>
              </div>
              <p style={{marginTop:-10 , marginLeft:10}}>Bagmati</p>
            </div>
            <Link to={"/seller/update/my/profile"}>
                <button style={{width:'100%' , cursor:'pointer'   , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white" , marginTop:-30 , position:"relative" }}>Edit</button>
            </Link>
          </div>

        <a href="/update/seller/password">
         <div style={{ marginLeft: '0%', marginTop: 25, paddingTop:20,paddingBottom:20, backgroundColor: "black" }}>
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer', marginLeft: '9%' }}>
              <PasswordOutlined style={{ marginLeft: 0, color: "white" }} />
              <p style={{ marginTop: 10, color: "white" }}>Chanage your password</p>
            </div>
            <p style={{ marginTop: -10, marginLeft: '9%', color: "#8e8e8e" }}>It's a good idea to use a strong password that you're not using elsewhere</p>
          </div>
          </a> 

        </div>

      </div>
    </div>
  )
}
