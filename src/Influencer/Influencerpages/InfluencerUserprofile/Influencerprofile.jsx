import { EmailOutlined, LocalPhoneOutlined } from '@material-ui/icons';
import { AddLocationAltOutlined, ApartmentOutlined, AssignmentReturned, DomainAddOutlined, PasswordOutlined, People, Reorder } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../component/Navbar';

export default function Influencerprofile() {
  let Users = useSelector(state => state.user);
  console.log(Users.currentUser.other);
  console.log(Users.currentUser.accessToken)
  let accessToken = Users.currentUser.accessToken;

  const [order , setOrder] = useState([]);
  useEffect(() => {
    const getOrder = async ()=>{
        try {
            const res = await axios.get(`http://localhost:5000/api/order/myOrder` , {
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
    console.log(order?.orders?.length);
 
  return (
    <div>
      <Navbar />
      <div style={{ width: "100%", height: '100vh', backgroundColor: "black", display: 'flex', paddingTop: 20 }}>
        <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
          <h2 style={{ marginLeft: 20 }}>Your bag</h2>

          <Link to="/order" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
              <Reorder style={{ marginLeft: 30, }} />
              <p style={{ marginTop: -0 }}>{order?.orders?.length} Your orders</p>
            </div>
          </Link>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
              <People style={{ marginLeft: 30, }} />
              <p style={{ marginTop: -0 }}>{Users?.currentUser?.other?.following?.length} Your following</p>
            </div>
          </Link>

          <Link to="/my/return/order" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
              <AssignmentReturned style={{ marginLeft: 30, }} />
              <p style={{ marginTop: -0 }}>{0} Return orders</p>
            </div>
          </Link>
        </div>

        <div style={{ backgroundColor: "white", flex: 3, marginLeft: 50, marginRight: 150, height: '70vh', width: '40%', borderRadius: 20 }}>
          <div style={{ backgroundColor: "white", flex: 1, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
            <h2 style={{ marginLeft: -90 }}>Your Profile Setting</h2>
            <div>
              <Link to={"/update/my/profile"}>
                <button style={{ marginLeft: '152%', cursor: 'pointer', paddingLeft: 30, paddingRight: 30, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white" , position:'relative' }}>Edit</button>
              </Link>
              {/* <p style={{marginLeft:'187%' , cursor:'pointer'}}>Edit</p> */}
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <EmailOutlined style={{ marginLeft: -60, }} />
                <p style={{ marginTop: -0 }}>Email</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -36 }}>{Users?.currentUser.other?.email}</p>
            </div>

            {/* <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <PasswordOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Password</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -36 }}>**************</p>
            </div> */}

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <LocalPhoneOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Phone number</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -36 }}>{Users?.currentUser?.other?.phoneNumber}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <AddLocationAltOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>Address</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -36 }}>null</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <ApartmentOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>City</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -36 }}>null</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                <DomainAddOutlined style={{ marginLeft: -60 }} />
                <p style={{ marginTop: -0 }}>State</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -36 }}>null</p>
            </div>

          </div>
          <div style={{ marginLeft: '0%', marginTop: -130, backgroundColor: "black" }}>
            <Link to={"/update/my/password"}>
              <button style={{ marginLeft: '75%', cursor: 'pointer', paddingLeft: 30, paddingRight: 30, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white", position: 'relative', marginTop: 19 }}>Edit</button>
            </Link>
            {/* <p style={{marginLeft:'187%' , cursor:'pointer'}}>Edit</p> */}
            <div style={{ display: 'flex', alignItems: "center", cursor: 'pointer', marginLeft: '9%' }}>
              <PasswordOutlined style={{ marginLeft: 0, color: "white" }} />
              <p style={{ marginTop: -0, color: "white" }}>Chnage your password</p>
            </div>
            <p style={{ marginTop: -13, marginLeft: '9%', color: "#8e8e8e" }}>It's a good idea to use a strong password that you're not using elsewhere</p>
          </div>
        </div>

      </div>
    </div>
  )
}
