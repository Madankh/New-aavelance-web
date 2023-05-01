import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../component/Navbar';
import './order.css'

function Order() {
  let Users = useSelector(state => state.user);
  // console.log(Users.currentUser.other);
  // console.log(Users.currentUser.accessToken)
  let accessToken = Users.currentUser.accessToken;

  const [Order, setOrder] = useState("");
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/order/myOrder`, {
          headers: {
            token: accessToken
          }
        })
        setOrder(res.data);
      } catch (error) {

      }
    }
    getOrder();
  }, []);


  // console.log(Order.orders.map((item)=>(
  //   console.log(item)
  // )))

  // let me = Order?.orders?.map((item) => (
  //  console.log(item)
  // ))

  const handleReturnOrder = async(item)=>{
      await fetch(
        `https://api.aavelance.com/api/order/return/order/update/status/${item}`, {method: 'PUT',
        headers: { 'Content-Type': 'application/json' , token : accessToken },
        body: JSON.stringify({
          status:`Return processing`,
        })})
        .then(response => {
          response.json()
            .then(data => {
              if(data.success == true){
                alert("Your request is processing");
                window.location.reload();
               
              }else{
                // navigate('/success');

              }
            });
        })
    
  }
  return (
    <div>
      <Navbar/>
      <h1 className='allorder'>Order Items</h1>
      {Order?.orders?.map((item) => (
        <div className='mainDiv1' style={{backgroundColor:'black'}} key={item._id}>
          {item.orderItems.map((items) => (
            <div>
              <div className='subOrderItme'>
                <img src={items.img} className='imageforitem' alt="" />

                <div>
                  <p style={{ margin: 0 , color:"white" }}> <span>Product Title</span>  : {items.title.slice(0, 40)}</p>
                  <p style={{ marginTop: -15 ,color:"white"  }}> <span>OrderId</span> : {items._id} </p>
                  <p style={{ marginTop: -15 , color:"white" }}> <span>Price</span> :{items.price} </p>
                  <p style={{ marginTop: -15 , color:"white" }}><span>Color</span> : {items.color} </p>
                  
                  <p style={{ marginTop: -15 , color:"red" }}><span>Order Status</span> : {item.orderStatus} </p>
                </div>
              </div>
            </div>
          ))}

          <div className='address'>
            <h2 style={{color:"white"}}>Address</h2>
            <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
              <p style={{color:"white"}}><span>City</span> : {item.shippingInfo.city}</p>
              <p style={{ marginTop: -10, marginLeft: -'10px' , color:"white" }}><span>Address</span> : {item.shippingInfo.address} </p>
            </div>
          </div>
          <div className='time'>
            <h2 style={{color:"white"}}>Time</h2>
            <div>
              <p style={{color:"white"}}>{item.createdAt}</p>
            </div>
          
              {item.orderItems !== "Delivered" ? <button onClick={()=>handleReturnOrder(item._id)} style={{marginLeft:10 , paddingTop:4 , paddingBottom:4 , border:'none' , borderRadius:2 , cursor:"pointer" , backgroundColor:'crimson' , color:"white"}}>Return order</button>:
              <button onClick={()=>handleReturnOrder(item._id)} style={{marginLeft:10 , paddingTop:4 , paddingBottom:4 , border:'none' , borderRadius:2 , cursor:"pointer" , backgroundColor:'crimson' , color:"white"}}>Cancel</button>}
          
          </div>
        </div>
      ))}
    </div>
  )
}

export default Order