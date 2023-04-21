import React from 'react'
import { useState } from 'react';
import Modal from 'react-modal';
export default function ContentModal({istrue}) {
    const [modalIsOpen, setModalIsOpen] = useState(istrue);
  return (
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    contentLabel="Create New Group"
    style={{
     content: {
     width: "45%",
     height: "70%",
     margin: "auto",
     display: "flex",
     flexDirection: "column",
     borderRadius: "10px",
     padding: "20px",
     border: "none",
     backgroundColor: "#fff",
     boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      },
      overlay: {
        backgroundColor: "rgb(255 255 255 / 93%)",
      },
      }}>
       <div style={{display:"flex"}}>
       <div style={{flex:2}}>
         <img src={`https://news.artnet.com/app/news-upload/2022/12/prisma-labs-lensa-ai.jpg`} style={{width:"100%"}} className=""  alt="" />
       </div>
       <div style={{flex:2}}>
         <div style={{display:"flex" , justifyContent:"space-between"}}>
           <div style={{display:"flex" , alignItems:"center" , marginLeft:"20px"}}>
             <img src={`https://news.artnet.com/app/news-upload/2022/12/prisma-labs-lensa-ai.jpg`} style={{width:"30px" , height:"30px", borderRadius:"50%"}} className=""  alt="" />
             <p style={{marginLeft:"10px"}}>Suman</p>
           </div>
           <div style={{marginTop:"10px"}}>
             <button style={{paddingLeft:"25px" ,color:"white" ,borderRadius:"10px", paddingRight:"25px" , paddingTop:"4px" , paddingBottom:"4px" , backgroundColor:"black"}}>Follow</button>
           </div>
         </div>
         <p style={{marginLeft:"30px"}}>Xiaokai—Yunxiang Clothes Flower Xiangrong, Spring Breeze Revlon</p>
       </div>
       </div>
 </Modal>
  )
}
