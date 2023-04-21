import React, { useEffect, useState } from 'react'
import "./returnpendingorder.css";
import image from "../Images/download (1).jpg"
import axios from 'axios';
import ReturnPendingorders from './ReturnPendingorder';
export default function ReturnpendingOrders() {
  

  const [pendingproduct , setPendingproduct] = useState([])
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"

  useEffect(() => {
    const pendingorder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/main/get/return/pending/order`, {
          headers: {
            token: accessToken
          }
        })
        setPendingproduct(res.data);
      } catch (error) {

      }
    }
    pendingorder();
  }, [0]);
  console.log(pendingproduct)
  return (
    <div className='returnContainer'>
      {pendingproduct.map((item)=>(
        <ReturnPendingorders item={item}/>
      ))}

    </div>
  )
}
