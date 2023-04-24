import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../../component/Navbar';
import './ReturnOrder.css'

function InfluencerReturnOrder() {
  const [sales, setSales] = useState([]);
  const admin = useSelector((state) => state.user);
  let seller = admin;
  let accessToken = admin.currentUser.accessToken;
  console.log(accessToken);
  useEffect(() => {
    const Returnorder = async () => {
      try {
        const res = await axios.get('http://139.162.11.30:80/api/order/get/return/userOrders', {
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
      {/* <h1 className='allorder'>Return Items</h1> */}
      {/* {sales?.map((item) => ( */}
        <div className='mainDiv1'>
          <div>
            <div className='subOrderItme'>
              <img src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80" className='imageforitem' alt="" />
              <div>
                <p style={{ margin: 0 }}> <span>Product Title</span>  : Discover the innovative world of Apple and shop everything iPhone</p>
                <p style={{ marginTop: -15 }}> <span>OrderId</span> : 61b1ca31cdf12da </p>
                <p style={{ marginTop: -15 }}> <span>Price</span> : Price : NRP 584 </p>
                <p style={{ marginTop: -15 }}><span>Color</span> : red </p>
                <p style={{ marginTop: -15 }}><span>Order Status</span> : Processing </p>
              </div>
            </div>
          </div>

          <div className='address'>
            <h2>Address</h2>
            <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
              <p><span>City</span> : Kathmandu</p>
              <p style={{ marginTop: -10, marginLeft: -'10px' }}> <span>Address</span> : Mahankal </p>
            </div>
          </div>
          <div className='time'>
            <h2>Time</h2>
            <div>
              <p>3:am</p>
            </div>
          </div>
        </div>

      {/* ))} */}

    </div>
  )
}

export default InfluencerReturnOrder;