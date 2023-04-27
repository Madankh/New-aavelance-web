import React, { useEffect, useState } from 'react'
import Sidebar from '../../Seller/components/sidebar/Sidebar';
import Topbar from '../../Seller/components/topbar/Topbar';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ReturnProduct() {
  const [sales, setSales] = useState([]);
  const admin = useSelector((state) => state.seller);
  let accessToken = admin.currentSeller.accessToken;

  useEffect(() => {
    const TotSales = async () => {
      try {
        const res = await axios.get('http://api.aavelance.com/api/order/get/return/userOrder', {
          headers: {
            token: accessToken
          }
        })
        setSales(res.data);
      } catch (error) {

      }
    }
    TotSales();
  }, [0])

  return (
    <div>
      <Topbar />
      <div className='MainContainer'>
        <div className='sidebarr'>
          <Sidebar />
        </div>

        <div className='unkonw'>
          <div className='OrderContainer'>
            <h3 className='allorder'>This month Return orders</h3>

            {sales.itemss?.map((item) => ( 
              <div className='mainDiv1'>
              <div>
                {item?.orderItems?.map((product)=>(
                <div className='subOrderItme'>
                  {product?.imgKey?.slice(0,1).map((img)=>(
                    <img src={img} className='imageforitem' alt="" />

                  ))}
                  <div>
                    <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {product?.title} </p>
                    <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {product?.price} </p>
                    <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {product?.color} </p>
                    <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {product?.size} </p>
                    <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {product?.quantity} </p>
                    <div style={{ display: 'flex', marginTop: -25 , marginLeft: 0, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                      <p style={{ fontFamily: 'Source Sans Pro'}}>{item?.orderStatus}</p>
                    </div>
                  </div>
                </div>
                 ))}
              </div>
              <div className='address' style={{marginLeft:-8}}>
                <h2 style={{ fontFamily: 'Source Sans Pro' , marginLeft: '10px'}}>ShippingInfo</h2>
                <div style={{ marginTop: '-20px', marginLeft: '10px' }}>
                  <p style={{ fontFamily: 'Source Sans Pro' , marginLeft: '10px'}}><span>City</span> : {item.shippingInfo.city}</p>
                  <p style={{ marginTop: -10, marginLeft: '10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  <p style={{ marginTop: -10, marginLeft: '10px' , fontFamily: 'Source Sans Pro' }}> <span>Address_2</span> : {item.shippingInfo.address_2} </p>
                </div>
              </div>
            </div>
            ))}
            
          </div>

          {/* <div className='OrderContainer'>
            <hr />
            <h3 className='allorder'>Last Month Total Sales</h3>
            <div className='mainDiv1'>
              <div>
                <div className='subOrderItme'>
                  <img src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80" className='imageforitem' alt="" />
                  <div>
                    <p> <span>Product Title</span>  : Discover the innovative world of Apple and shop everything</p>
                    <p style={{ marginTop: -15 }}> <span>Price</span> : NRP 584 </p>
                    <p style={{ marginTop: -15 }}><span>Color</span> : red </p>
                    <p style={{ marginTop: -15 }}><span>Size</span> : 12 </p>
                    <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                      <span>Order status</span>
                      <p>Deliverd</p>
                    </div>
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
                <div style={{ display: 'flex' }}>
                  <h2>Time</h2>
                  <p>3:am</p>
                </div>
              </div>
            </div>

           
          </div> */}
          
          <hr />
        </div>


      </div>


    </div>
  )
}

