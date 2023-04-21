import React, { useEffect, useState } from 'react'
import "./topbar.css"
import { Notifications } from "@material-ui/icons"
import { Sellerlogout } from '../../../pages/redux/RegisteruserRedux';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function Topbar() {
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(Sellerlogout());
    console.log("Something was happened");
  }
  const [Products, setProducts] = useState([]);
  const influencer = useSelector((state) => state.influencer);
  // let seller = admin.currentSeller.paymentDateAt;
  console.log(influencer.currentInfluencer.accessToken);
  let accessToken = influencer?.currentInfluencer?.accessToken;

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/order/get/affid/proccessing/userOrders', {
          headers: {
            token: accessToken
          }
        })
        setProducts(res.data);

      } catch (error) {
        console.log("Some error occured")
      }
    }
    getProduct();
  }, [0])
  // let id = admin.currentSeller._id;
  console.log(Products)
  // const [amount , setamount] = useState('0');
  // const [status , setStatus] = useState('Pending')
  let meKnow = new Date().toISOString();

  // useEffect(() => {
  //   const PostRevenue = async()=>{
  //     try {
  //       fetch(
  //        'http://localhost:5000/api/transfer/money', {method: 'POST',
  //         headers: { 'Content-Type': 'application/json' , token : accessToken },
  //         body: JSON.stringify({
  //          amount:amount,
  //          status:status,
  //        })})
  //        .then(response => {
  //          response.json()
  //            .then(data => {
  //              if(data.success == true){
  //                console.log("suman")
  //              }else{

  //              }
  //            });
  //        })
  //    }
  //    catch (error) {
  //      console.error(error);
  //    }
  //   }
  //   PostRevenue();
  // }, [0])


  return (
    <div className='topbar'>
      <div className="topbarwrapper">
        <div className="topleft">
          <span className='logo'>Admin</span>
        </div>
        <div className="topright">
          <p onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</p>
          <Link to={"/Influencer/pending/orders"}>
            <div className="topbarIconContainer">
              {Products.length == 0 ? <Notifications /> : <div>
                <Notifications />
                <span className='topIconBadge'>{Products.length}</span>
              </div>}
            </div>
          </Link>
          <div className="topbarIconContainer">
          </div>
        </div>
      </div>
    </div>
  )
}
