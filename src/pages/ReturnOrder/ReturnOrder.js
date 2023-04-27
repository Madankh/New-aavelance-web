import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../../component/Navbar';
import './ReturnOrder.css'

function ReturnOrder() {
  const [sales, setSales] = useState([]);
  const admin = useSelector((state) => state.user);
  let seller = admin;
  let accessToken = admin.currentUser.accessToken;
  console.log(accessToken);
  useEffect(() => {
    const Returnorder = async () => {
      try {
        const res = await axios.get('http://172.232.73.46:80/api/order/get/return/userOrders', {
          headers: {
            token: accessToken
          }
        })
        setSales(res.data);
      } catch (error) {

      }
    }
    Returnorder();
  }, [0])
  console.log(sales)

  return (
    <div>
      <Navbar />
      {/* <h1 className='allorder'>Order Items</h1>
      {Order?.orders?.map((item) => (
        <div className='mainorderContainer' style={{backgroundColor:'black'}} key={item._id}>
          {item.orderItems.map((items) => (
            <div>
              <div className='subOrderItems'>
                <img src={items.img} className='imagefororder' alt="" />
                <div>
                  <p className="itemnamefororder"> <span>Product Title</span>  : {items.title.slice(0, 40)}</p>
                  <p className="itemnamefororder"> <span>OrderId</span> : {items._id} </p>
                  <p className="itemnamefororder"> <span>Price</span> : {items.price} </p>
                  <p className="itemnamefororder"> <span>Quantity</span> : {items?.quantity} </p>
                  <p className="itemnamefororder"><span>Color</span> : {items.color} </p>
                  <p style={{ marginTop: -15 , color:"red" }}><span>Order Status</span> : {item.orderStatus} </p>
                </div>
              </div>
            </div>
          ))}

          <div className='address'>
            <h2 className="orderaddressname">Address</h2>
            <div style={{ marginTop: '-20px'}}>
              <p className="orderaddress"><span>City</span> : {item.shippingInfo.city}</p>
              <p className="orderaddress"><span>Address</span> : {item.shippingInfo.address} </p>
            </div>
          </div>
          <div className='time'>
            <h2 className="orderaddressname">Time</h2>
            <div>
              <p className="orderaddress">{item.createdAt}</p>
            </div>
          
              {item.orderStatus !== "Delivered" ? <button className="btnreturn" onClick={()=>handleReturnOrder(item._id)}>Return order</button>:
              <button className="btnreturn"  onClick={()=>handleReturnOrder(item._id)} >Cancel</button>}
          
          </div>
        </div>
      ))}
    </div> */}
    </div>
  )
}

export default ReturnOrder;