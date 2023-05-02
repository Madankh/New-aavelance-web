import axios from 'axios';
import React, { useState } from 'react'
import "./updatesellerpaymentstatus.css"
export default function UpdateSellerPaymentStatus(item) {
  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4'
  const [Status , setStatus] = useState('');
    const handleStatus = (e)=>{
      setStatus(e);
    }

    // const handleChange = ()=>{
    //   console.log("HandleClick has been press")
    // }

    const handleChange = async()=> {
      const res = await axios({
        method:'PUT',
        url:`https://api.aavelance.com/api/main/pending/payment/${item?.item?._id}`, headers:{token:accessToken},
        data:{
          status:`${Status}`
        }
      }).then((item)=>{
        alert(item?.data);
        console.log(item?.data)
      })
  
    }

  return (
    <div className='UpdateSellerPaymentStatus'>
          <div className='part'>
                    <p>Seller</p>
                    <p>Suman</p>
          </div>
          <div className='part'>
                    <p>Execute Date</p>
                    <p>{new Date(item?.item?.executeDate).toLocaleString()}</p>
          </div>
          <div className='part'>
                    <p>Status</p>
                    <p>{item?.item?.status}</p>
          </div>
          <div className='part'>
                    <p>Amount</p>
                    <p>{item?.item?.amount}</p>
          </div>
          <div className='part'>
                    <p>Updated Status</p>
                    <select name="" id="" style={{ marginLeft: 10 }} onClick={(event) => handleStatus(event.target.value)} >
                              <option value="Complected">Complected</option>
                    </select>
          </div>
          <div className='part'>
             <button style={{paddingLeft:"20px" , paddingRight:"20px" , paddingTop:"5px" , paddingBottom:"5px" , borderRadius:"10px" , marginTop:"30px"}} onClick={handleChange}>Change</button>
          </div>
    </div>
  )
}
