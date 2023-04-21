import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './sellersales.css'




export default function SellerSales() {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4'
  const [sales, setSales] = useState([]);
  const [PreviousWeekSales , SetpreviousWeekSales] = useState([]);
  const [PrevioustwoWeekSales , SetPrevioustwoWeekSales] = useState([]);
  const [PreviousthreeWeekSales , SetPreviousthreeWeekSales] = useState([]);
  const [PreviousfourWeekSales , SetPreviousfourWeekSales] = useState([]);
  const [month , Setmonth] = useState([]);
  console.log(id , "this is user id")
  useEffect(() => {
    const TotSales = async () => {
      try {
        const res = await axios.get(`http://192.168.100.27:5000/api/main/get/userOrder/${id}`, {
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
  

  useEffect(() => {
    const PreviousTotSales = async () => {
      try {
        const res = await axios.get(`http://192.168.100.27:5000/api/main/get/previos/one/week/userOrder/${id}`, {
          headers: {
            token: accessToken
          }
        })
        console.log(res.data);
        SetpreviousWeekSales(res.data);
      } catch (error) {
  
      }
    }
    PreviousTotSales();
  }, [0])
  
  useEffect(() => {
    const PreviousTwotSales = async () => {
      try {
        const res = await axios.get(`http://192.168.100.27:5000/api/main/get/two/weeks/userOrder/${id}`, {
          headers: {
            token: accessToken
          }
        })
        console.log(res.data);
        SetPrevioustwoWeekSales(res.data);
      } catch (error) {
  
      }
    }
    PreviousTwotSales();
  }, [0])
  
  useEffect(() => {
    const PreviousThreetSales = async () => {
      try {
        const res = await axios.get(`http://192.168.100.27:5000/api/main/get/previous/three/weeks/userOrder/${id}`, {
          headers: {
            token: accessToken
          }
        })
        console.log(res.data);
        SetPreviousthreeWeekSales(res.data);
      } catch (error) {
  
      }
    }
    PreviousThreetSales();
  }, [0])
  
  useEffect(() => {
    const PreviousFourtSales = async () => {
      try {
        const res = await axios.get(`http://192.168.100.27:5000/api/main/get/previous/four/weeks/userOrder/${id}`, {
          headers: {
            token: accessToken
          }
        })
        console.log(res.data);
        SetPreviousfourWeekSales(res.data);
      } catch (error) {
  
      }
    }
    PreviousFourtSales();
  }, [0])
  
  return(
    <div className='MainsalesMainContainer'>
      {/* <Topbar /> */}

        <div className='mainunkonw'>
          <div className='mainOrderContainer'>
            <h3 className='mainallorder'>7 days Total sales (Current Week)</h3>

            {sales?.items?.map((item) => (
              <div className='mainDiv11'>
                <div style={{width:"100%"}}>
                  {item.orderItems.map((product)=>(
                  <div className='submainOrderItme'>
                    <img src={`${product.img[0]}`} className='mainimageforitem' alt="" />
                    <div style={{width:"90%"}}>
                      <p style={{width:"50%"}}> <span>Product Title</span>  : {product?.title} </p>
                      <p style={{ marginTop: -15 }}> <span>Price</span> : NRP {product?.price} </p>
                      <p style={{ marginTop: -15 }}><span>Color</span> : {product?.color} </p>
                      <p style={{ marginTop: -15  }}><span>Size</span> : {product?.size} </p>
                      <p style={{ marginTop: -15 }}><span>Quantity</span> : {product?.quantity} </p>
                      <p style={{ marginTop: -15 }}><span>Total Price with Delivery Charge</span> : {item?.Total_amount} </p>
                      <div style={{ display: 'flex', marginTop: -10,  alignItems: 'center' }}>
                        <span >Order status : </span>
                        <p > {item?.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='mainaddress'>
                  <h2 >ShippingInfo</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address_2</span> : {item.shippingInfo.address_2} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='MainRevanue'>
                <h5>Net Revanue</h5>
                <p style={{marginTop: -16 }}>NPR {sales.amount}</p>
              </div>
              <div className='MainRevanue'>
                <h5 >Total Sales</h5>
                <p style={{marginTop: -16 }}>NPR {sales.Sales}</p>
              </div>
              <div  className='MainRevanue'>
                <h5 >Marketplace fee</h5>
                <p style={{marginTop: -16 }}>NPR {sales.marketplace}</p>
              </div>
            </div>
          </div>

          <div className='mainOrderContainer'>
            <h3 className='mainallorder'>1 Week Ago Total Sales</h3>

            {PreviousWeekSales.items?.map((item) => (
              <div className='mainDiv11'>
                <div style={{width:"100%"}}>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div style={{width:"90%"}}>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro'}}>Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 >Net Revanue</h5>
                <p style={{marginTop: -16}}>NPR {PreviousWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 >Total Sales</h5>
                <p style={{marginTop: -16}}>NPR {PreviousWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 >Marketplace fee</h5>
                <p style={{marginTop: -16}}>NPR {PreviousWeekSales.marketplace}</p>
              </div>
            </div>
          </div>

          <div className='mainOrderContainer'>
            <h3 className='mainallorder'>2 Week Ago Total Sales</h3>

            {PrevioustwoWeekSales.items?.map((item) => (
              <div className='mainDiv11'>
                <div style={{width:"100%"}}>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div style={{width:"100%"}}>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro'}}>Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 >Net Revanue</h5>
                <p style={{marginTop: -16}}>NPR {PrevioustwoWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5>Total Sales</h5>
                <p style={{marginTop: -16}}>NPR {PrevioustwoWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 >Marketplace fee</h5>
                <p style={{marginTop: -16}}>NPR {PrevioustwoWeekSales.marketplace}</p>
              </div>
            </div>
          </div>



          <div className='mainOrderContainer'>
            <h3 className='mainallorder'>3 Week Ago Total Sales</h3>

            {PreviousthreeWeekSales.items?.map((item) => (
              <div className='mainDiv11'>
                <div style={{width:"100%"}}>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div style={{width:"100%"}}>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 >Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 >Net Revanue</h5>
                <p style={{marginTop: -16}}>NPR {PreviousthreeWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5>Total Sales</h5>
                <p style={{marginTop: -16}}>NPR {PreviousthreeWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5>Marketplace fee</h5>
                <p style={{marginTop: -16 }}>NPR {PreviousthreeWeekSales.marketplace}</p>
              </div>
            </div>
          </div>



          <div className='mainOrderContainer'>
            <h3 className='mainallorder'>4 Week Ago Total Sales</h3>

            {PreviousfourWeekSales.items?.map((item) => (
              <div className='mainDiv11'>
                <div style={{width:"100%"}}> 
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div style={{width:"100%"}}>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <p>Order status</p>
                        <p>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 >Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p ><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' ,  }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 >Net Revanue</h5>
                <p style={{marginTop: -16}}>NPR {PreviousfourWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 >Total Sales</h5>
                <p style={{marginTop: -16}}>NPR {PreviousfourWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 >Marketplace fee</h5>
                <p style={{marginTop: -16}}>NPR {PreviousfourWeekSales.marketplace}</p>
              </div>
            </div>
          </div>


          {/* <div className='OrderContainer'>
            <h3 className='allorder'> 1 month Total Sales</h3>

            {month.items?.map((item) => (
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro'}}>Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Net Revanue</h5>
                <p style={{marginTop: -26 ,marginLeft:-10}}>NPR {month.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -26 , marginLeft:-10}}>NPR {month.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -26 , marginLeft:-10}}>NPR {month.marketplace}</p>
              </div>
            </div>
          </div>




          <div className='OrderContainer'>
            <h3 className='allorder'> 2 month Total Sales</h3>

            {month.items?.map((item) => (
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro'}}>Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Net Revanue</h5>
                <p style={{marginTop: -26 ,marginLeft:-10}}>NPR {month.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -26 , marginLeft:-10}}>NPR {month.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -26 , marginLeft:-10}}>NPR {month.marketplace}</p>
              </div>
            </div>
          </div>



          <div className='OrderContainer'>
            <h3 className='allorder'> 3 month Total Sales</h3>

            {month.items?.map((item) => (
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.img}`} className='imageforitem' alt="" />
                    <div>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -10, marginLeft: 10, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro'}}>Address</h2>
                  <div style={{ marginTop: '-20px', marginLeft: -'10px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10, marginLeft: -'10px' , fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Net Revanue</h5>
                <p style={{marginTop: -26 ,marginLeft:-10}}>NPR {month.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -26 , marginLeft:-10}}>NPR {month.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -26 , marginLeft:-10}}>NPR {month.marketplace}</p>
              </div>
            </div>
          </div> */}



      </div>
    </div>
  )
}
