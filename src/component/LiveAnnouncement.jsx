import { SearchOutlined } from '@material-ui/icons';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./announcement.css"
import { createBrowserHistory } from "history";
import { useState } from 'react';
const LiveAnnouncement = () => {
  const navigate = useNavigate();

  const [searchValue , setSearchValue] = useState('');
  const history = createBrowserHistory();
  const handelSearch = (e)=>{
    if(e.key == "Enter"){
      e.preventDefault();
      history.push(`/result/search_query/${searchValue}`)
       window.location.reload(e);
   }
 } 

  function handleChange(event) {
    navigate(`/Products/${event}`);
  }

  const [value , setvalue] = useState('white');
  const [valueTxt , setvalueTxt] = useState("Product");
  // const handlevalue=()=>{
  //   if(value == "white"){
  //     setvalue("black")
  //   }else{
  //     setvalue("white")
  //   }
  // }
  return (
    <div className='liveannoContainer'>
        
        <div className='livecontentType' >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Livestream</p>
          </div>
          <a href={"/"} style={{textDecoration:"none"}}>
          <div style={{display:"flex" , cursor:"pointer"}} >
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Product</p>
          </div>
          </a>
          <a href={"/your/feed"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px" }}>Your Feed</p>
          </div>
          </a>

          <a href={"/makeup/user/content"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Markup</p>
          </div>
          </a>

          <a href={"/fashion/user/content"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Fashion</p>
          </div>
          </a>
        </div>

      
    </div>
  )
}

export default LiveAnnouncement
