import React from 'react';
import "./updatependingorder.css";
import image from "../Images/download (1).jpg"
export default function UpdatePendingOrder() {
  return (
          <div className='UpdatePendingOrder'>
          
          <div className='MainContainer'>
            <div className='sidebarr'>
            </div>
            <div className='OrderContainer'>
              <h1 className='allorder'>Order Items</h1>
              <div style={{display:'flex'}}>
                <div style={{flex:5}}>
                {/* {order?.orderItems?.map((item)=>( */}
                  <img className='pendingorderImage' src={`${image}`} alt="" />
                 {/* ))} */}
                </div>
                <div style={{flex:3.4}}>
                  {/* {order?.orderItems?.map((item)=>( */}
                    <p className='updateOrderstatus'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam ex magni iusto velit, laboriosam sit mollitia nihil recusandae dolores! Sint voluptatum alias odit error ex, placeat aliquid recusandae laudantium dolorum.</p>
          {/* //        ))}  */}
    
                 {/* {order?.orderItems?.map((item)=>( */}
                   <p className='updateOrderstatus'><span>Price</span> : NPR </p>
          {/* //        ))}  */}
                  <p className='updateOrderstatus'><span>Color</span> : red</p>
                  <p className='updateOrderstatus'><span>Size</span> : M</p>
                  {/* {order?.orderItems?.map((item)=>( */}
                    <p className='updateOrderstatus'><span>Quantity</span> : </p>
                    <p className='updateOrderstatus'><span>Price</span> : NPR </p>
                 {/* ))} */}
                 {/* {order?.orderItems?.map((item)=>( */}
                   <p className='updateOrderstatus'><span>Categories</span> : </p>
                  {/* //  <p className='updateOrderstatus'><span>Price</span> : NPR {item.price}</p> */}
          {/* //        ))} */}
    
                  {/* {order?.orderItems?.map((item)=>( */}
                    <p className='updateOrderstatus'><span>Subcategories</span> : </p>
                    <p className='updateOrderstatus'><span>Categories</span> : </p>
                    <p className='updateOrderstatus'><span>Price</span> : NPR </p>
                 {/* ))} */}
                 
                 
                  <p className='updateOrderstatus'><span>City</span> : </p>
                  <p className='updateOrderstatus'><span>Address</span> : </p>
                  <p className='updateOrderstatus'><span>Address 2</span> : </p>
                  <p className='updateOrderstatus'><span>Username</span> : </p>
                  <p className='updateOrderstatus'><span>Phone number</span> : </p>
                  <div style={{display:'flex', marginLeft:10}}>
                    <div>
                     <span >Orderstatus</span>
                     
                      <select
                    //    onChange={event => handleChange(event.target.value)} 
                       name="" id="" style={{marginLeft:10}}>
                        <option value="Proccessing">Proccessing</option>
                        <option value="Pick up">Pick up</option>
                        <option value="Out for delivery">Out for delivery</option>
                    </select>
                    </div>
                    <div style={{marginLeft:50 }}>
                      <button style={{backgroundColor:'green' , paddingLeft:30, paddingRight:30 , paddingTop:6,paddingBottom:6 , border:'none' , borderRadius:5 , color:"white" , fontWeight:'700' , fontFamily: 'Roboto Condensed'}}>Done</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
  )
}
