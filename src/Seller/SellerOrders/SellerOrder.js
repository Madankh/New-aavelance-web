import React, { useEffect, useState } from 'react'
import './SellerOrder.css'
import Sidebar from '../components/sidebar/Sidebar'
import Topbar from '../components/topbar/Topbar'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export default function Order() {
  const [userOrder, setuserOrder] = useState([]);
  const [order , SetOrder] = useState("");
  const location = useLocation();
  const orderId = location.pathname.split("/")[5];
  console.log(orderId)

  const admin = useSelector((state) => state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;
  console.log(accessToken);
  const [Orderstatus , setOrderStatus] = useState('')


  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`http://172.232.73.46:80/api/order/Single/order/${orderId}`, {
          headers:{
            token: accessToken
          }
        })
        SetOrder(res.data);

      } catch (error) {
        
      }
    }
    getOrder();
  }, [0])

  
  console.log(order);


  function handleChange(value) {
    setOrderStatus(value);
  }

  const handleClick = async()=> {
    const res = await axios({
      method:'PUT',
      url:`http://172.232.73.46:80/api/order/update/status/${orderId}`,
      data:{
        status:`${Orderstatus}`
      }
    }).then((item)=>{
      alert(item?.data?.msg);
      console.log(item?.data?.msg)
    })

  }


  return (
    <div>
      <Topbar />
      <div className='MainContainer'>
        <div className='sidebarr'>
          <Sidebar />
        </div>
        <div className='OrderContainer'>
          <h1 className='allorder'>Order Items</h1>
          <div className='underallorder'>
            {/* <div style={{flex:0}}> */}
            {order?.orderItems?.map((item)=>(
              item.imgKey.slice(0,1).map((img)=>(
                <img className='pendingorderImage' src={img} alt="" />
              ))
             ))}
            {/* </div> */}
            <div style={{flex:3.4 , marginLeft:15}}>
              {order?.orderItems?.map((item)=>(
                <p className='updateOrderstatus'>{item.title}</p>
             ))} 

             {order?.orderItems?.map((item)=>(
               <p className='updateOrderstatus'><span>Price</span> : NPR {item.price}</p>
             ))} 
              <p className='updateOrderstatus'><span>Color</span> : red</p>
              <p className='updateOrderstatus'><span>Size</span> : M</p>
              {order?.orderItems?.map((item)=>(
                <p className='updateOrderstatus'><span>Quantity</span> : {item.quantity}</p>
              //  <p className='updateOrderstatus'><span>Price</span> : NPR {item.price}</p>
             ))}
             {order?.orderItems?.map((item)=>(
               <p className='updateOrderstatus'><span>Categories</span> : {item.categories}</p>
              //  <p className='updateOrderstatus'><span>Price</span> : NPR {item.price}</p>
             ))}

              {order?.orderItems?.map((item)=>(
                <p className='updateOrderstatus'><span>Subcategories</span> : {item.subcategories}</p>
              //  <p className='updateOrderstatus'><span>Categories</span> : {item.categories}</p>
              //  <p className='updateOrderstatus'><span>Price</span> : NPR {item.price}</p>
             ))}
             
             
              <p className='updateOrderstatus'><span>City</span> : {order?.shippingInfo?.city}</p>
              <p className='updateOrderstatus'><span>Address</span> : {order?.shippingInfo?.address}</p>
              <p className='updateOrderstatus'><span>Address 2</span> : {order?.shippingInfo?.address_2}</p>
              <p className='updateOrderstatus'><span>Username</span> : {order?.username}</p>
              <p className='updateOrderstatus'><span>Phone number</span> : {order?.shippingInfo?.phone_Number}</p>
              <div className='orderStatusContainer' >
                <div>
                 <span>Orderstatus</span>
                 
                  <select onChange={event => handleChange(event.target.value)} name="" id="" style={{marginLeft:10}}>
                    <option value="Proccessing">Proccessing</option>
                    <option value="Pick up">Pick up</option>
                    <option value="Out for delivery">Out for delivery</option>
                </select>
                </div>
                <div className='updateButtonContainerInpendingUser'>
                  <button className='DoneBtninPendinguserorderpage'  onClick={handleClick}>Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
  )
}
