import React, { useEffect, useState } from 'react'
import './Sales.css'
import Sidebar from '../../Seller/components/sidebar/Sidebar'
import Topbar from '../../Seller/components/topbar/Topbar'
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [PreviousWeekSales , SetpreviousWeekSales] = useState([]);
  const [PrevioustwoWeekSales , SetPrevioustwoWeekSales] = useState([]);
  const [PreviousthreeWeekSales , SetPreviousthreeWeekSales] = useState([]);
  const [PreviousfourWeekSales , SetPreviousfourWeekSales] = useState([]);
  const [month , Setmonth] = useState([]);

  const admin = useSelector((state) => state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;
  
  useEffect(() => {
    const TotSales = async () => {
      try {
        const res = await axios.get('http://172.232.73.46:80/api/order/get/userOrder', {
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

  // console.log(sales?.items?.map((item)=>(console.log(item))))
  useEffect(() => {
    const PreviousTotSales = async () => {
      try {
        const res = await axios.get('http://172.232.73.46:80/api/order/get/previos/one/week/userOrder', {
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
        const res = await axios.get('http://172.232.73.46:80/api/order/get/two/weeks/userOrder', {
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
        const res = await axios.get('http://172.232.73.46:80/api/order/get/previous/three/weeks/userOrder', {
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
        const res = await axios.get('http://172.232.73.46:80/api/order/get/previous/four/weeks/userOrder', {
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

  console.log([PreviousWeekSales, "this"]);


  useEffect(() => {
    const OnemonthTotSales = async () => {
      try {
        const res = await axios.get('http://172.232.73.46:80/api/order/get/one/month/userOrder', {
          headers: {
            token: accessToken
          }
        })
        console.log(res.data);
        Setmonth(res.data);
      } catch (error) {

      }
    }
    OnemonthTotSales();
  }, [0])

console.log([month, "14 to 28"])
  
  return (
    <div className='salesMainContainer'>
      <Topbar />
      <div className='MainContainer'>
        <div className='sidebarr'>
          <Sidebar />
        </div>

        <div className='unkonw'>
          <div className='OrderContainer'>
            <h3 className='allorder'>7 days Total sales (Current Week)</h3>

            {sales?.items?.map((item) => (
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((product)=>(
                  <div className='subOrderItme'>
                    <img src={`${product.imgKey[0]}`} className='imageforitem' alt="" />
                    <div>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {product.title} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {product.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {product.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {product.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {product.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -25, marginLeft: 0, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status </span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}> {item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro'}}>ShippingInfo</h2>
                  <div style={{ marginTop: '-20px', marginLeft: '18px' }}>
                    <p style={{ fontFamily: 'Source Sans Pro'}}><span>City</span> : {item.shippingInfo.city}</p>
                    <p style={{ marginTop: -10,  fontFamily: 'Source Sans Pro' }}> <span>Address</span> : {item.shippingInfo.address} </p>
                    <p style={{ marginTop: -10 , fontFamily: 'Source Sans Pro' }}> <span>Address_2</span> : {item.shippingInfo.address_2} </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:'flex'}}>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Net Revanue</h5>
                <p style={{marginTop: -6 ,marginLeft:0}}>NPR {sales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {sales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {sales.marketplace}</p>
              </div>
            </div>
          </div>

          <div className='OrderContainer'>
            <h3 className='allorder'>1 Week Ago Total Sales</h3>

            {PreviousWeekSales.items?.map((item) => (
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.imgKey}`} className='imageforitem' alt="" />
                    <div>
                      <p style={{ fontFamily: 'Source Sans Pro'}}> <span>Product Title</span>  : {itemm.title}</p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}> <span>Price</span> : NRP {itemm.price} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Color</span> : {itemm.color} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Size</span> : {itemm.size} </p>
                      <p style={{ marginTop: -15 , fontFamily: 'Source Sans Pro' }}><span>Quantity</span> : {itemm.quantity} </p>
                      <div style={{ display: 'flex', marginTop: -25, marginLeft: 0, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Source Sans Pro'}}>Order status</span>
                        <p style={{ fontFamily: 'Source Sans Pro'}}>{item.orderStatus}</p>
                      </div>
                    </div>
                  </div>
                   ))}
                </div>
                <div className='address'>
                  <h2 style={{ fontFamily: 'Source Sans Pro' , marginLeft:-0}}>Address</h2>
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
                <p style={{marginTop: -6 ,marginLeft:-0}}>NPR {PreviousWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -6 , marginLeft:-0}}>NPR {PreviousWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -6 , marginLeft:-0}}>NPR {PreviousWeekSales.marketplace}</p>
              </div>
            </div>
          </div>

          <div className='OrderContainer'>
            <h3 className='allorder'>2 Week Ago Total Sales</h3>

            {PrevioustwoWeekSales.items?.map((item) => (
              <div className='mainDiv1'>
                <div>
                  {item.orderItems.map((itemm)=>(
                  <div className='subOrderItme'>
                    <img src={`${itemm.imgKey}`} className='imageforitem' alt="" />
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
                <p style={{marginTop: -6 ,marginLeft:0}}>NPR {PrevioustwoWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {PrevioustwoWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {PrevioustwoWeekSales.marketplace}</p>
              </div>
            </div>
          </div>



          <div className='OrderContainer'>
            <h3 className='allorder'>3 Week Ago Total Sales</h3>

            {PreviousthreeWeekSales.items?.map((item) => (
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
                <p style={{marginTop: -6 ,marginLeft:0}}>NPR {PreviousthreeWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {PreviousthreeWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {PreviousthreeWeekSales.marketplace}</p>
              </div>
            </div>
          </div>



          <div className='OrderContainer'>
            <h3 className='allorder'>4 Week Ago Total Sales</h3>

            {PreviousfourWeekSales.items?.map((item) => (
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
                <p style={{marginTop: -6 ,marginLeft:0}}>NPR {PreviousfourWeekSales.amount}</p>
              </div>
              <div className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Total Sales</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {PreviousfourWeekSales.Sales}</p>
              </div>
              <div  className='Revanue'>
                <h5 style={{ fontFamily: 'Source Sans Pro'}}>Marketplace fee</h5>
                <p style={{marginTop: -6 , marginLeft:0}}>NPR {PreviousfourWeekSales.marketplace}</p>
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
    </div>
  )
}
