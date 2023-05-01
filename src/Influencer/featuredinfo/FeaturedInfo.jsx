import React, { useEffect, useState } from 'react'
import "./featuredInfo.css"
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function FeaturedInfo() {
  let userDetails = useSelector(state => state.user)
  let id = userDetails?.currentUser?.others?._id;
  const accessToken = userDetails?.currentUser?.accessToken;
  const [revanue , setrevanue] = useState('');
  const [status, setStatus] = useState('Pending');
  console.log(accessToken);
  
  useEffect(() => {
    const income = async () => {
      try {
        const res = await axios.get('https://api.aavelance.com/api/order/get/affid/userOrder', {
          headers: {
            token: accessToken
          }
        })
        await setrevanue(res.data);
      } catch (error) {
      }
    }
    income();
  }, [0])
  
  
  console.log(revanue?.Income)
  const amount = revanue?.Income;
  console.log(revanue?.Income)

  const [Sales , setSales] = useState([]);
  

     useEffect(() => {
      const TotSales = async () => {
        try {
          const res = await axios.get('https://api.aavelance.com/api/order/get/affid/return/userOrder', {
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

console.log(Sales?.items?.length == 0)

  return (
    <div>

    <div className='featured'>
      <div className="featuredItem">
        <span className='featuredTitle'>Your Income</span>
        <div className="featuredMoneyContainer">
          <span className='featuredMoney'>NPR {revanue.Income}</span>
        </div>
        <span className='featuredSub'>Current month revenue</span>
      </div>
      <div className="featuredItem">
        <span className='featuredTitle'>Sales</span>
        <div className="featuredMoneyContainer">
          <span className='featuredMoney'>NPR {revanue.Sales}</span>
        </div>
        <span className='featuredSub'>Current month sales</span>
      </div>
    </div>

    <div style={{width:"96%",margin:"auto" , height:"64.2vh" , overFlow:"hidden"}}>
      <div className='unkonw'>
          <div className='OrderContainer'>
            <h3 className='allorder'>This month Return orders</h3>

          {Sales?.items?.length !== 0 ?
            <div>
            {Sales.items?.map((item) => ( 
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
            : <div style={{height:"10vh"}}>
              <p style={{marginLeft:'10px'}}>You don't have any user return orders</p>
            </div>
            }
          </div>
        </div>
    </div>
    

    </div>
  )
}
