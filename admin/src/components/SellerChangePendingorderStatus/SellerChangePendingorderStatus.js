import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './SellerChangePendingorderStatus.css'
// import Sidebar from '../components/sidebar/Sidebar'
// import Topbar from '../components/topbar/Topbar'
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';

export default function SellerChangePendingorderStatus() {
//   const [userOrder, setuserOrder] = useState([]);
  const [order , SetOrder] = useState("");
//   const location = useLocation();
  // const orderId = location.pathname.split("/")[5];
  // console.log(orderId)

//   const admin = useSelector((state) => state.seller);
//   let seller = admin;
//   let accessToken = admin.currentSeller.accessToken;
//   console.log(accessToken);
  const [Orderstatus , setOrderStatus] = useState('')


  // useEffect(() => {
  //   const getOrder = async()=>{
  //     try {
  //       const res = await axios.get(`https://api.aavelance.com/api/main/update/status/${orderId}`, {
  //         headers:{
  //           token: accessToken
  //         }
  //       })
  //       SetOrder(res.data);

  //     } catch (error) {
        
  //     }
  //   }
  //   getOrder();
  // }, [0])


//   function handleChange(value) {
//     setOrderStatus(value);
//   }

//   const handleClick = async()=> {
//     const res = await axios({
//       method:'PUT',
//       url:`https://api.aavelance.com/api/order/update/status/${orderId}`,
//       data:{
//         status:`${Orderstatus}`
//       }
//     })

//   }


  return (
    <div>
      <div className='MainContainer'>
        <div className='OrderContainer'>
          <h1 className='allorder'>Order Items</h1>
          <div style={{display:'flex'}}>
            <div style={{flex:5}}>
              <img className='pendingorderImage' src="" alt="" />
            </div>
            <div style={{flex:3.4}}>
                <p className='updateOrderstatus'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati dolorem totam delectus omnis dicta saepe aliquid! Fuga ipsa culpa eius, facilis incidunt quidem odit doloribus obcaecati qui beatae doloremque necessitatibus!</p>

               <p className='updateOrderstatus'><span>Price</span> : NPR 4332</p>
              <p className='updateOrderstatus'><span>Color</span> : red</p>
              <p className='updateOrderstatus'><span>Size</span> : M</p>
              <p className='updateOrderstatus'><span>Quantity</span> : 32</p>
               <p className='updateOrderstatus'><span>Categories</span> : knowman</p>
                <p className='updateOrderstatus'><span>Subcategories</span> : suman</p>
             
             
              <p className='updateOrderstatus'><span>City</span> : kathmandu</p>
              <p className='updateOrderstatus'><span>Address</span> : Nepal</p>
              <p className='updateOrderstatus'><span>Address 2</span> : Nepal tar</p>
              <p className='updateOrderstatus'><span>Username</span> : suman</p>
              <p className='updateOrderstatus'><span>Phone number</span> : 9802143872</p>
              <div style={{display:'flex'  , marginLeft:10}}>
              <div>
                 <span>Orderstatus</span>
                 
                  <select name="" id="" style={{marginLeft:10}}>
                    <option value="Proccessing">Proccessing</option>
                    <option value="Pick up">Pick up</option>
                    <option value="Out for delivery">Out for delivery</option>
                </select>
                </div>
                <div style={{marginLeft:50 }}>
                  <button style={{backgroundColor:'green' , paddingLeft:30, paddingRight:30 , paddingTop:6,paddingBottom:6 , border:'none' , borderRadius:5 , color:"white" , fontWeight:'700' , fontFamily: 'Roboto Condensed'}} >Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
  )
}
