import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Pendingorders(item) {
          const [sellerDetails , setsellerDetails] = useState('');
          const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
          let id = '';
          {item?.item?.orderItems.map((itemss)=>{
                    id = itemss.seller
          })}
          console.log(id)

          useEffect(() => {
           const sellerdetail = async () => {
             try {
               const res = await axios.get(`https://api.aavelance.com/api/main/address/seller/${id}`, {
                 headers: {
                   token: accessToken
                 }
               })
               setsellerDetails(res.data);
             } catch (error) {
 
             }
           }
           sellerdetail();
           }, [id]);

           const [Orderstatus , setOrderstatus] = useState('');
           const handleStatus = (e)=>{
                    setOrderstatus(e);
                    console.log(e);
           }

           const handleOrderStatusChangeClick = async()=> {
                    const res = await axios({
                      method:'PUT',
                      url:`https://api.aavelance.com/api/main/update/status/${item?.item?._id}`, headers:{token:accessToken},
                      data:{
                        status:`${Orderstatus}`
                      }
                    }).then((item)=>{
                      alert(item?.data?.msg);
                      console.log(item?.data?.msg)
                    })
                
                  }

           console.log(sellerDetails , "This is information about seller");
          return (
                    <div>
                              <div style={{ display: "flex", backgroundColor: "black", padding: 20 }}>
                                        {item?.item?.orderItems.map((item) => (
                                          // {item.imgKey}
                                                  <img src={`${item?.imgKey[0]}`} className="productimage" alt="" />

                                        ))}
                                        <div style={{ marginTop: -16, marginLeft: 20 }}>
                                                  {item.item?.orderItems.map((itemss) => (
                                                            <p style={{ width: "70%", color: "white" }}>{itemss.title}</p>
                                                  ))}
                                                  {item.item?.orderItems.map((itemss) => (
                                                            <p style={{ marginTop: "-10px", color: "white" }}>Price : NPR {itemss?.price}</p>
                                                  ))}
                                                  {item.item?.orderItems.map((itemss) => (
                                                            // <p style={{ marginTop: "-10px", color: "white" }}>Price : NPR {itemss?.price}</p>
                                                            <p style={{ marginTop: "-10px", color: "white" }}>Color : {itemss?.color[0]}</p>
                                                  ))}
                                                  {item.item?.orderItems.map((itemss) => (
                                                            <p style={{ marginTop: "-10px", color: "white" }}>Quantity : {itemss.quantity}</p>
                                                  ))}
                                                  <p style={{ marginTop: "-10px", color: "white" }}>Seller Address : {sellerDetails?.shopAddress} </p>
                                                  <p style={{ marginTop: "-10px", color: "white" }}>Shop name : {sellerDetails?.shopname}</p>
                                                  <p style={{ marginTop: "-10px", color: "white" }}>Seller Number : {sellerDetails?.phoneNumber}</p>
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                            <p style={{ marginTop: "-10px", color: "white" }}>Order status</p>
                                                            {item?.item?.orderStatus === "Processing" ?
                                                                      <select name="" id="" style={{ marginLeft: "20px", marginTop: -25, padding: 4, paddingLeft: 25, paddingRight: 25, borderRadius: "10px", cursor: "pointer" }}  onClick={(event) => handleStatus(event.target.value)}>
                                                                                <option value="Pick up">Pick up</option>
                                                                                <option value="Out for delivery">Out For Delivery</option>
                                                                                <option value="Delivered">Delivered</option>
                                                                      </select>
                                                                      : item?.item?.orderStatus === "Pick up" ? 
                                                                      <select onClick={(event) => handleStatus(event.target.value)} name="" id="" style={{ marginLeft: "20px", marginTop: -25, padding: 4, paddingLeft: 25, paddingRight: 25, borderRadius: "10px", cursor: "pointer" }}>
                                                                                <option value="Out for delivery">Out For Delivery</option>
                                                                                <option value="Delivered">Delivered</option>
                                                                      </select> : 
                                                                      item?.item?.orderStatus === "Out for delivery" ? 
                                                                      <select onClick={(event) => handleStatus(event.target.value)} name="" id="" style={{ marginLeft: "20px", marginTop: -25, padding: 4, paddingLeft: 25, paddingRight: 25, borderRadius: "10px", cursor: "pointer" }}>
                                                                                <option value="Delivered">Delivered</option>
                                                                      </select>
                                                                       : ''}
                                                            <button style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 5, paddingBottom: 5, border: "none", borderRadius: "10px", cursor: 'pointer', marginTop: -30, marginLeft: 20 }} onClick={handleOrderStatusChangeClick}>Change</button>
                                                  </div>
                                        </div>
                                        <div >

                                                  <p style={{ color: "white" }}>User Address : {item.item?.shippingInfo?.address} </p>
                                                  <p style={{ color: "white" }}>User Address_2 : {item.item?.shippingInfo?.address_2} </p>
                                                  <p style={{ color: "white" }}>User City : {item.item?.shippingInfo?.city} </p>
                                                  <p style={{ color: "white" }}>User State : {item.item?.shippingInfo?.state} </p>
                                                  <p style={{ color: "white" }}>User Number : {item.item?.shippingInfo?.phone_Number}</p>
                                        </div>
                              </div>
                              <hr style={{ marginTop: "0.3px" }} />
                    </div>

          )
}
