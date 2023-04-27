import { AccountBalanceOutlined, AttachMoney, EmailOutlined, LocalPhoneOutlined, LocationCityOutlined } from '@material-ui/icons';
import { AddLocationAltOutlined, ApartmentOutlined, BadgeOutlined, DomainAddOutlined, DriveFileRenameOutline, PasswordOutlined, People, Reorder } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../component/Navbar';
import "./userprofile.css"
export default function Userprofile() {
  let Users = useSelector(state => state.user);
  let accessToken = Users?.currentUser?.accessToken;

  const [order , setOrder] = useState([]);
  useEffect(() => {
    const getOrder = async ()=>{
        try {
            const res = await axios.get(`http://172.232.73.46:80/api/order/myOrder` , {
              headers:{
                token : accessToken
              }
            })
            setOrder(res.data);
          } catch (error) {

          }
      }
      getOrder();
    }, [])
    

  const [Bank , setBank] = useState([]);

  useEffect(() => {
    const getBank = async ()=>{
        try {
            const res = await axios.get(`http://172.232.73.46:80/api/influencer/bank/user/account` , {
              headers: {
                token: accessToken
              }})
            setBank(res.data);
          } catch (error) {
              
          }
      }
      getBank();

  }, [])


 
  return (
    <div className='ma'>
      <Navbar />
      <div className='mainUserProfile'>
      {Bank !== ''?  
          Bank?.map((item)=>(
      <div style={{ backgroundColor: "white",  marginRight: 10,  borderRadius: 20,  marginBottom:"20px" , width:"90%"  }}>
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

          <Link to={"/update/user/bank"}>
              <button style={{ cursor:'pointer' , width:'100%',  paddingLeft:35 , paddingRight:35 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}}>Edit</button>
          </Link>

        </div> )) : 
        <div style={{ backgroundColor: "white", marginRight: 10,borderRadius: 20  , width:"90%" , marginBottom:10 }}>
          <h2 style={{ marginLeft: 20 }}>Bank Details</h2>
            <p style={{fontSize:20 , color:'green' , marginTop:30 , marginLeft:10}}>You don't have a bank account details</p>
            <p style={{marginTop:-19 , marginLeft:10}}>Add bank account details</p>
          <div style={{ alignItems: "center", cursor: 'pointer' }}>
          <Link to={"/add/user/bank/account"}>
              <button style={{marginLeft:60,marginTop:50, cursor:'pointer' , width:'60%',  paddingLeft:35 , paddingRight:35 , border:'none' , paddingTop:7 , paddingBottom:7 , borderRadius:10 , backgroundColor:'green' , color:"white"}}>Add bank account</button>
          </Link>
        </div>
        </div>}


        <div className='yourbagContainer'>
          <h2 className='headertext'>Your bag</h2>

          <Link to="/order" style={{ textDecoration: 'none' }}>
            <div className='yourOrder'>
              <Reorder className='iconsforuser3' />
              <p className='text' style={{ marginTop: -0 }}>{order?.orders?.length} Your Orders</p>
            </div>
          </Link>

          <Link to="/following/seller" style={{ textDecoration: 'none' }}>
            <div className='yourOrder' >
              <People className='iconsforuser4'   />
              <p className='text' style={{ marginTop: -0 }}>{Users?.currentUser?.others?.following?.length} Your Following Seller</p>
            </div>
          </Link>

          <Link to={"/creator/transaction"} style={{ textDecoration: 'none' }}>
            <li className='yourOrder'>
                 <AttachMoney className='iconsforuser' />
                 <p>Pending Transactions</p>
            </li>
          </Link>



          <Link to={"/completed/creator/transaction"} style={{ textDecoration: 'none' }}>
            <li className='yourOrder'>
                 <AttachMoney className='iconsforuser' />
                <p>Completed Transactions</p>
            </li>
          </Link>



        </div>
        <div style={{width:"89%" , backgroundColor:"white" , margin:"10px" , display:"flex"}}>
          <Link to={"/user/earning"} style={{ textDecoration: 'none' }}>
            <p className='white'>Go in Admin Panel</p>
          </Link>
        </div>
        <div className='SubContainer' >
          <div className='submainpartContainer'>
            <h2 className='headertext1'>Your Profile Setting</h2>
            <div>
              
              <div className='yourdetail'  >
                <EmailOutlined className='iconsforuser1' />
                <p >Email</p>
              </div>
              <p className='text1'>{Users?.currentUser.others?.email}</p>
            </div>
            <div>
              <div className='yourdetail' >
                <LocalPhoneOutlined className='iconsforuser1' />
                <p>Phone number</p>
              </div>
              <p className='text1'>{Users?.currentUser?.others?.phoneNumber}</p>
            </div>

            <div>
              <div className='yourdetail'>
                <AddLocationAltOutlined className='iconsforuser1' />
                <p >Address</p>
              </div>
              <p className='text1' >Null</p>
            </div>

            <div>
              <div className='yourdetail' >
                <ApartmentOutlined className='iconsforuser1' />
                <p >City</p>
              </div>
              <p className='text1' >null</p>
            </div>

            <div>
              <div className='yourdetail'>
                <DomainAddOutlined className='iconsforuser1' />
                <p >State</p>
              </div>
              <p className='text1'>null</p>
            </div>
            <Link to={"/update/my/profile"}>
                <button className='editbtn'>Edit</button>
              </Link>
          </div>
          <div className='yourpa' >
              {/* <button className='editbtn1'></button> */}
            
             <Link to={"/update/my/password"}>
             <div className='yourPContainer'>
              <PasswordOutlined className='iconP'  />
              <p className='text2'>Change your password</p>
            </div>
            <p className='text4'>It's a good idea to use a strong password that you're not using elsewhere</p>
            </Link>
          </div>
          
        </div>

      </div>
    </div>
  )
}
