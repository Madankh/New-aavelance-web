import React, { useEffect, useState } from 'react'
import './InfluencerSales.css'
// import Sidebar from '../components/sidebar/Sidebar'
// import Sidebar from '../../src/components/sidebar/Sidebar'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
// import { useSelector } from 'react-redux';
// import axios from 'axios';

export default function InfluencerSales() {
  const [sales, setSales] = useState([]);
  const [PreviousWeekSales , SetpreviousWeekSales] = useState([]);
  const [month , Setmonth] = useState([]);

  
  return (
    <div style={{ flex: 5  , backgroundColor:'black'}}>
    <div>
      {/* <img src="https://pbs.twimg.com/media/FVUtOTJWAAA0_oM?format=jpg&name=large" style={{width:40 , borderRadius:0}} alt="" /> */}
      <div style={{ display: 'flex' , backgroundColor:'white'}}>
        <div>
          <div style={{ display: 'flex' }}>
            <img src={`https://i.ytimg.com/vi/UVS0iJK9WxY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBZTpm2_dsQCjG-eRMYWdLPICacFg`} style={{ width: 220, height: 220, borderRadius: 0 }} alt="" />
            <div style={{ width: 500, marginLeft: 10, marginRight: 100 }}>
              <p style={{}}> <span>Product Title</span>  : Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nihil consectetur distinctio, adipisci saepe non ullam obcaecati ab laboriosam magni exercitationem id odio sed </p>
              <p style={{ marginTop: 15 }}> <span>Price</span> : NRP 4434 </p>
              <p style={{ marginTop: 15 }}><span>Color</span> : white </p>
              <p style={{ marginTop: 15 }}><span>Size</span> : 43 </p>
              <p style={{ marginTop: 15 }}><span>Quantity</span> : 43 </p>
              <div style={{ display: 'flex', marginTop: -10, marginLeft: -0, alignItems: 'center' }}>
                <span style={{}}>Order status</span>
                <p style={{}}>Successfuly</p>
              </div>
            </div>
          </div>

        </div>
        <div style={{ flex: '2' }}>
          <h2 style={{ fontFamily: 'Source Sans Pro' }}>ShippingInfo</h2>
          <div style={{ marginTop: 20, marginLeft: 10 }}>
            <p style={{}}><span>City</span> : Kathmandu</p>
            <p style={{ marginTop: 10, marginLeft: 10 }}> <span>Address</span> : mahankal </p>
            <p style={{ marginTop: 10, marginLeft: 10 }}> <span>Address_2</span> : mahankal </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' , backgroundColor:'white' , marginTop:10}}>
        <div>
          <div style={{ display: 'flex' }}>
            <img src={`https://i.ytimg.com/vi/UVS0iJK9WxY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBZTpm2_dsQCjG-eRMYWdLPICacFg`} style={{ width: 220, height: 220, borderRadius: 0 }} alt="" />
            <div style={{ width: 500, marginLeft: 10, marginRight: 100 }}>
              <p style={{}}> <span>Product Title</span>  : Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nihil consectetur distinctio, adipisci saepe non ullam obcaecati ab laboriosam magni exercitationem id odio sed </p>
              <p style={{ marginTop: 15 }}> <span>Price</span> : NRP 4434 </p>
              <p style={{ marginTop: 15 }}><span>Color</span> : white </p>
              <p style={{ marginTop: 15 }}><span>Size</span> : 43 </p>
              <p style={{ marginTop: 15 }}><span>Quantity</span> : 43 </p>
              <div style={{ display: 'flex', marginTop: -10, marginLeft: -0, alignItems: 'center' }}>
                <span style={{}}>Order status</span>
                <p style={{}}>Successfuly</p>
              </div>
            </div>
          </div>

        </div>
        <div style={{ flex: '2' }}>
          <h2 style={{  }}>ShippingInfo</h2>
          <div style={{ marginTop: 20, marginLeft: 10 }}>
            <p style={{}}><span>City</span> : Kathmandu</p>
            <p style={{ marginTop: 10, marginLeft: 10 }}> <span>Address</span> : mahankal </p>
            <p style={{ marginTop: 10, marginLeft: 10 }}> <span>Address_2</span> : mahankal </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' , backgroundColor:'white' , marginTop:10}}>
        <div>
          <div style={{ display: 'flex' }}>
            <img src={`https://i.ytimg.com/vi/UVS0iJK9WxY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBZTpm2_dsQCjG-eRMYWdLPICacFg`} style={{ width: 220, height: 220, borderRadius: 0 }} alt="" />
            <div style={{ width: 500, marginLeft: 10, marginRight: 100 }}>
              <p style={{}}> <span>Product Title</span>  : Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nihil consectetur distinctio, adipisci saepe non ullam obcaecati ab laboriosam magni exercitationem id odio sed </p>
              <p style={{ marginTop: 15 }}> <span>Price</span> : NRP 4434 </p>
              <p style={{ marginTop: 15 }}><span>Color</span> : white </p>
              <p style={{ marginTop: 15 }}><span>Size</span> : 43 </p>
              <p style={{ marginTop: 15 }}><span>Quantity</span> : 43 </p>
              <div style={{ display: 'flex', marginTop: -10, marginLeft: -0, alignItems: 'center' }}>
                <span style={{}}>Order status</span>
                <p style={{}}>Successfuly</p>
              </div>
            </div>
          </div>

        </div>
        <div style={{}}>
          <h2 style={{  }}>ShippingInfo</h2>
          <div style={{ marginTop: 20, marginLeft: 10 }}>
            <p style={{}}><span>City</span> : Kathmandu</p>
            <p style={{ marginTop: 10, marginLeft: 10 }}> <span>Address</span> : mahankal </p>
            <p style={{ marginTop: 10, marginLeft: 10 }}> <span>Address_2</span> : mahankal </p>
          </div>
        </div>
      </div>


      
      <div style={{ display: 'flex' , backgroundColor:"white" }}>
        <div className='Revanue'>
          <h5 style={{}}>Net Revanue</h5>
          <p style={{ marginTop: -26, marginLeft: -0 }}>NPR 212</p>
        </div>
        <div className='Revanue'>
          <h5 style={{}}>Total Sales</h5>
          <p style={{ marginTop: -26, marginLeft: -0 }}>NPR 33333333</p>
        </div>
        <div className='Revanue'>
          <h5 style={{}}>Marketplace fee</h5>
          <p style={{ marginTop: -26, marginLeft: -0 }}>NPR 43423</p>
        </div>
      </div>
    </div>
  </div>
  )
}
