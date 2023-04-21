import React, { useEffect, useState } from 'react'
import "./featuredInfo.css"
import {ArrowDownward , ArrowUpward} from "@material-ui/icons"
import axios from 'axios';

export default function FeaturedInfo() {
    const [data, setdata] = useState([]);
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  useEffect(() => {
    const getProduct = async()=>{
      try {
        const res = await axios.get('http://localhost:5000/api/main/user', {
          headers:{
            token: accessToken
          }
        })
        setdata(res.data);

      } catch (error) {
        
      }
    }
    getProduct();
  }, [0])


  const [sellerdata, setsellerdata] = useState([]);
  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`http://localhost:5000/api/main/seller`, {
          headers:{
            token: accessToken
          }
        })
        setsellerdata(res.data);
      } catch (error) { 
      }
    }
    getOrder();
  }, [])
    return (
        <div className='featured'>
            <div className="featuredItem">
                <span className='featuredTitle'>Total Seller</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>{sellerdata?.length} shops</span>
                </div>
            </div>

            <div className="featuredItem">
                <span className='featuredTitle'>Total User</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>{data?.length} Users</span>
                </div>
            </div>
            
        </div>
    )
}
