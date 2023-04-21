import { SearchOutlined } from '@material-ui/icons';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./announcement.css"
import { createBrowserHistory } from "history";
import { useState } from 'react';
const Announcement = () => {
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

  return (
    <div className='annoContainer'>
        <div className='annonavCenter'>
          <SearchOutlined className='annosearchItems'/>
          <input className='annonavInput' type="search" placeholder='Search Products.....' onKeyDown={handelSearch} onChange={(e) => setSearchValue(e.target.value)} />
          
          <a href={`/result/search_query/${searchValue}`}>
            <button className='annosearchBtn'>Search</button>
          </a>
        </div>

        <div className='contentType' >
        <a href="/livestreming">
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Live stream</p>
          </div>
        </a>

          <a href={"/your/feed"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Your Feed</p>
          </div>
          </a>

          <a href={"/"}>
          <div style={{display:"flex" , cursor:"pointer"}} >
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Product</p>
          </div>
          </a>



          <a href={"/Discover"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Discover</p>
          </div>
          </a>
        
          <a href={"/makeup/user/content"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p style={{color:"black" , fontSize:'13px' , backgroundColor:`${value}` , height:"10px" , marginTop:"3.7px" , display:"flex" , marginRight:"30px"}}>Makeup</p>
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

export default Announcement
