import React, { useEffect, useState } from 'react'
import "./sellerfeaturedinfo.css"
import { AccountBalanceOutlined } from '@material-ui/icons'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import UpdateSellerPaymentStatus from './UpdateSellerPaymentStatus';

export default function Sellerfeaturedinfo() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  console.log(id, "Userid")

  const [AllProduct, setAllProduct] = useState([]);
  const [ReturnProduct, setReturnProduct] = useState([]);
  const [pendingProduct, setpendingProduct] = useState([]);
  const [BankAccount, setBankAccount] = useState([]);
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4'
  const [revanue, setrevanue] = useState([]);

  useEffect(() => {
    const income = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/get/userOrder/${id}`, {
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
    const Products = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/seller/product/by/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setAllProduct(res.data);
      } catch (error) {

      }
    }
    Products();
  }, []);

  console.log(AllProduct, "AllProduct")

  useEffect(() => {
    const pendingProducts = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/get/pending/userOrders/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setpendingProduct(res.data);
      } catch (error) {

      }
    }
    pendingProducts();
  }, []);

  console.log(pendingProduct)


  useEffect(() => {
    const ReturnProducts = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/get/return/userOrders/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setReturnProduct(res.data);
      } catch (error) {
      }
    }
    ReturnProducts();
  }, []);

  console.log(ReturnProduct, "ReturnProduct")

  useEffect(() => {
    const BankAccount = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/accountdetail/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setBankAccount(res.data);
      } catch (error) {

      }
    }
    BankAccount();
  }, []);



  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/transfer/get/main/transaction/${id}`, {
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

  console.log(BankAccount)
  return (
    <div>
      <div className='featured'>
        <div className="featuredItem">
          <Link to={`/seller/sales/${id}`}>
            <span className='featuredTitle'>Net Revenue</span>
            <div className="featuredMoneyContainer">
              <span className='featuredMoney'>NPR {`${revanue?.amount}`}</span>
            </div>
          </Link>
        </div>

        <div className="featuredItem">
          <Link to={`/seller/productlist/${id}`}>
            <span className='featuredTitle'>Total Products</span>
            <div className="featuredMoneyContainer">
              <span className='featuredMoney'>{AllProduct?.length}</span>
            </div>
          </Link>
        </div>
        <div className="featuredItem">
          <Link to={`/seller/pendingorder/${id}`}>
            <span className='featuredTitle'>Pending Orders</span>
            <div className="featuredMoneyContainer">
              <span className='featuredMoney'>{pendingProduct?.length}</span>
            </div>
          </Link>
        </div>

      </div>
      <div className='featured'>
        <div className="featuredItem">
          <Link to={`/seller/return/pendingorder/${id}`}>
            <span className='featuredTitle'>Pending Return orders</span>
            <div className="featuredMoneyContainer">
              <span className='featuredMoney'>{ReturnProduct?.length}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="featuredItemmm">
        <span className='featuredTitle'>Marketplace Cost</span>
        <div className="featuredMoneyContainer">
          <span className='featuredMoney'>NPR {`${revanue?.marketplace}`}</span>
        </div>
      </div>


      <div style={{paddingTop:20 , paddingBottom:20}}>
        {BankAccount.map((item) => (
          <div style={{ backgroundColor: "white", flex: 1.6, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
            <h2 style={{ marginLeft: -120 }}>Bank Details</h2>
            <div style={{ alignItems: "center", cursor: 'pointer' }}>

              <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                <AccountBalanceOutlined />
                <p>Bank Account Number</p>
              </div>
              <p style={{ marginTop: -5, marginLeft: -120 }}>986467473654646</p>
            </div>
            <div style={{ alignItems: "center", cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                {/* <DriveFileRenameOutline /> */}
                <p>Bank Account Name</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -120 }}>Suman khadka</p>

            </div>

            <div style={{ alignItems: "center", cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                {/* <BadgeOutlined /> */}
                {/* <BadgeOutlined/> */}
                {/*  */}

                <p>Bank Account Phone Number</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -120 }}>Laxmi bank</p>
            </div>

            <div style={{ alignItems: "center", cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                {/* <BadgeOutlined /> */}
                {/* <BadgeOutlined/> */}
                {/*  */}

                <p>Bank Name</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -120 }}>Laxmi bank</p>
            </div>


            <div style={{ alignItems: "center", cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                {/* <LocationCityOutlined /> */}
                <p>Bank Branch Address</p>
              </div>
              <p style={{ marginTop: -13, marginLeft: -120 }}>Mahankal</p>
              <p></p>
            </div>
            {/* <Link to={"/seller/update/bank/account"}>
                        <button style={{ cursor: 'pointer', width: '100%', paddingLeft: 35, paddingRight: 35, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white" }}>Edit</button>
                    </Link> */}
          </div>
        ))}
        {BankAccount.length == 0 ? <p style={{ marginLeft: "25px" }}>Seller Don't have bank Account</p> : ""}
      </div>

      <div style={{marginTop:"0px" , backgroundColor:"#e1e1e1" , borderRadius:"10px"}}>
        {data?.map((item) => (
          <UpdateSellerPaymentStatus item={item} />
        ))}
      </div>

    </div>
  )
}
