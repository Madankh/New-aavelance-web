import React, { useEffect, useState } from 'react'
import "./influencerfeaturedinfo.css"
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import UpdateUserPaymentStatus from './UpdateUserPaymentStatus';

export default function Influencerfeaturedinfo() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [revanue, setrevanue] = useState([]);
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4'
  const [Bankdetails, setBankdetails] = useState([]);
  useEffect(() => {
    const income = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/main/get/affid/userOrder/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setrevanue(res.data);
      } catch (error) {
      }
    }
    income();
  }, [0]);



  useEffect(() => {
    const bankDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/main/influencer/accountdetail/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setBankdetails(res.data);
      } catch (error) {
      }
    }
    bankDetails();
  }, [0]);
  
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/influencer/transaction/get/transaction/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setdata(res.data);

      } catch (error) {

      }
    }
    getOrder();
  }, [0])
  console.log(data)


  return (
    <div>
      <div className='featured'>
        <div className="featuredItem">
          <Link to={"/influencer/sales/:id"}>
            <span className='featuredTitle'>Net Revenue</span>
            <div className="featuredMoneyContainer">
              <span className='featuredMoney'>NPR {revanue.Income}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className='featured'>
        <Link to={`/influencer/transaction/done/${id}`}>
          <div className="featuredItem">
            <span className='featuredTitle'>Transaction List</span>
          </div>
        </Link>
        
      </div>
      <div>
        <div style={{ backgroundColor: "white", flex: 1.6, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
          <h2 style={{ marginLeft: -120 }}>Bank Details</h2>
          {Bankdetails?.map((item) => (
            <div>
              <div style={{ alignItems: "center", cursor: 'pointer' }}>

                <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                  {/* <AccountBalanceOutlined /> */}
                  <p>Bank Account Number</p>
                </div>
                <p style={{ marginTop: -5, marginLeft: -120 }}>{item.accountNumber}</p>
              </div>
              <div style={{ alignItems: "center", cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                  {/* <DriveFileRenameOutline /> */}
                  <p>Bank Account Name</p>
                </div>
                <p style={{ marginTop: -13, marginLeft: -120 }}>{item.accountName}</p>

              </div>


              <div style={{ alignItems: "center", cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                  {/* <BadgeOutlined /> */}
                  {/* <BadgeOutlined/> */}
                  {/*  */}

                  <p>Bank Name</p>
                </div>
                <p style={{ marginTop: -13, marginLeft: -120 }}>{item.BankName}</p>
              </div>


              <div style={{ alignItems: "center", cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                  {/* <LocationCityOutlined /> */}
                  <p>Bank Branch Address</p>
                </div>
                <p style={{ marginTop: -13, marginLeft: -120 }}>{item.BankAddress}</p>
                <p></p>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      <div style={{marginTop:"-100px" , backgroundColor:"#e1e1e1" , borderRadius:"10px"}}>
        {data?.map((item) => (
          <UpdateUserPaymentStatus item={item} />
        ))}
      </div>

    </div>
  )
}
