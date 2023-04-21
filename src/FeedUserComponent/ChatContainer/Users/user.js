import React from 'react'

export default function user({item}) {
  return (
    <div style={{display:"flex" , alignItems:"center" , cursor:"pointer"}} >
      <img src={item?.profile} style={{width:"40px" , height:"40px", marginBottom:"5px" , borderRadius:"50%"}} alt="" />
      <div style={{alignItems:"center" , marginLeft:"10px"}}>
        <p style={{marginTop:"10px"}}>{item?.username}</p>
        <p style={{marginTop:"-17px"}}>{item?.email}</p>
      </div>
   </div>
  )
}
