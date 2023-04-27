import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../component/Navbar';
import './order.css'

function Order() {
  let Users = useSelector(state => state.user);
  const [open , setOpen] = useState(false);
  let accessToken = Users?.currentUser?.accessToken;
  const [reason , setreason] = useState('');
  const [Order, setOrder] = useState("");
  const [orderid , setorderid] = useState('');
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`http://api.aavelance.com/api/order/myOrder`, {
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

  const handleReturn = async(item)=>{
    setOpen(true);
    setorderid(item);
}


  const handleReturnOrder = async(item)=>{
      await fetch(
        `http://139.162.11.30:80/api/order/return/order/update/status/${item}`, {method: 'PUT',
        headers: { 'Content-Type': 'application/json' , token : accessToken },
        body: JSON.stringify({
          return_order_reason:`${reason}`,
          status:`Return processing`,
        })})
        .then(response => {
          response.json()
            .then(data => {
              if(data.success === true){
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
   {open === true ?
      <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">
          <h4>Are You Sure You Want Return order?</h4>
        </div>
          <input type="textarea" placeholder='Why you want to return' style={{width:"100%" , height:"8vh"}} onChange={(e)=>setreason(e.target.value)}/>
        <div className="footer">
          <button
            onClick={() => {
              setOpen(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={()=>handleReturnOrder(orderid)}>Done</button>
        </div>
      </div>
    </div>:""
   }

      








      {Order?.products?.map((item) => (
        <div className='mainorderContainer' style={{backgroundColor:'black'}} key={item._id}>
          {item.orderItems.map((items) => (
            <div>
              <div className='subOrderItems'>
                {items?.imgKey?.slice(0,1).map((img)=>(
                  <img src={img} className='imagefororder' alt="" />
                ))}
                <div>
                  <p className="itemnamefororder"> <span>Product Title</span>  : {items.title.slice(0, 40)}</p>
                  <p className="itemnamefororder"> <span>OrderId</span> : {items._id} </p>
                  <p className="itemnamefororder"> <span>Price</span> : {items.price} </p>
                  <p className="itemnamefororder"> <span>Quantity</span> : {items?.quantity} </p>
                  <p className="itemnamefororder"><span>Color</span> : {items.color} </p>
                  <p className='OrderStatusDetails' ><span>Order Status</span> : {item.orderStatus} </p>
                </div>
              </div>
            </div>
          ))}

          <div className='address'>
            <h2 className="orderaddressname">Address</h2>
            <div style={{ marginTop: '-10px'}}>
              <p className="orderaddress"><span>City</span> : {item.shippingInfo.city}</p>
              <p className="orderaddress"><span>Address</span> : {item.shippingInfo.address} </p>
            </div>
          </div>
          <div className='time'>
            {/* <h2 className="orderaddressname">Time</h2>
            <div>
              <p className="createdAt">{item.createdAt}</p>
            </div> */}
          
              {item.orderStatus === "Delivered" ? <button className="btnreturn" onClick={()=>handleReturn(item._id)}>Return order</button>:
              <button className="btnreturn"  onClick={()=>handleReturn(item._id)} >Cancel order</button>}
          
          </div>
        </div>
      ))}
    </div>
  )
}

export default Order