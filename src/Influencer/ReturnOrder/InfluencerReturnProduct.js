import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import Topbar from '../components/topbar/Topbar'
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function InfluencerReturnProduct() {
  const [sales, setSales] = useState([]);

  const influencer = useSelector((state) => state.influencer);
  // let seller = admin;
  let accessToken = influencer.currentInfluencer.accessToken;
  console.log(accessToken);

  useEffect(() => {
    const TotSales = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/order/get/affid/return/userOrder', {
          headers: {
            token: accessToken
          }
        })
        console.log(res.data);
        setSales(res.data);
      } catch (error) {

      }
    }
    TotSales();
  }, [0])
// console.log(sales?.items?.map((item)=> console.log(item)))

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

            {sales.items?.map((item) => ( 
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((detail)=>(
                    
                    <div className='subOrderItme'>
                    <img src={`${detail?.img[0]}`} className='imageforitem' alt="" />
                    <div>
                      <p> <span>Product Title</span>  : {detail.title}</p>
                      <p style={{ marginTop: -15 }}> <span>Price</span> : NRP {detail.price} </p>
                      {detail?.color?.map((item)=>(
                        <p style={{ marginTop: -15 }}><span>Color</span> : {item} </p>
                      ))}
                      <p style={{ marginTop: -15 }}><span>Size</span> : {detail.size} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span>Order status</span>
                        <p>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                     ))} 
                </div>
                
              </div>
             ))}
            
          </div>
        </div>


      </div>


    </div>
  )
}

