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
            <p className='liveannoContaienrText'>Livestream</p>
          </div>
          <a href={"/"} style={{textDecoration:"none"}}>
          <div style={{display:"flex" , cursor:"pointer"}} >
            <p className='liveannoContaienrText' >Product</p>
          </div>
          </a>
          <a href={"/your/feed"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p className='liveannoContaienrText' >Feed</p>
          </div>
          </a>

          <a href={"/Discover"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p className='liveannoContaienrText'>Discover</p>
          </div>
          </a>
        
          <a href={"/makeup/user/content"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p className='liveannoContaienrText' >Makeup</p>
          </div>
          </a>

          <a href={"/fashion/user/content"} style={{textDecoration:"none"}} >
          <div style={{display:"flex" , cursor:"pointer"}}>
            <p className='liveannoContaienrText'>Fashion</p>
          </div>
          </a>

        </div>

      
    </div>
  )
}

export default LiveAnnouncement
