import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {  Notifications, SearchOutlined, ShoppingCartOutlined } from '@material-ui/icons';
import { Badge } from '@material-ui/core';
// import { mobile } from '../responsive';
import { useSelector } from "react-redux";
import { Link, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { logoutInfluencer } from '../../pages/redux/influencerRedux';
// import { logout } from '../pages/redux/userRedux'
import { createBrowserHistory } from "history";
import "./influencernavbar.css";

const InfluencerNavbar = ({socket}) => {
  const quantity = useSelector(state => state.cart.quantity);
  const influencer = useSelector(state => state.influencer)
  const dispatch =useDispatch();

  const handleLogout = (e) => {
      e.preventDefault();
      dispatch(logoutInfluencer());
    };

  const [searchValue , setSearchValue] = useState('');
  const history = createBrowserHistory();
  const handelSearch = (e)=>{
    if(e.key == "Enter"){
      e.preventDefault();
      history.push(`/influencer/result/search_query/${searchValue}`)
       window.location.reload(e);
   }
 }  
  return (
    <div className='navContainer'>
      <div className='navWrapper'>
        <div className='navLeft'>
          <Link to={"/"} style={{ textDecoration: 'none' }}>
            <h1 className='CompanyLogo'>Aavelance</h1>
          </Link>
        </div>
        <div className='navCenter'>
          <SearchOutlined className='searchItems'/>
          <input className='navInput' type="search" placeholder='Search Products.....' onKeyDown={handelSearch} onChange={(e) => setSearchValue(e.target.value)} />
          
          <Link to={`/influencer/result/search_query/${searchValue}`}>
            <button className='searchBtn'>Search</button>
          </Link>
         </div>
        <div className='navRight'>
          {/* <Link to={"/seller/login"}>
             <div className='navMenuItem'>Become a Seller </div>
          </Link> */}
          {influencer.currentInfluencer ? <div className='navMenuItem' onClick={handleLogout}>Logout</div> : [<Link to={"/register"}><div className='navMenuItem'>Register</div></Link> , <Link to="/login"><div className='navMenuItem'>Login</div></Link> ]}
          <Link to={"/cart"} >
            <div className='navMenuItem'>
              <Badge badgeContent={quantity} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </div>
          </Link>
          <Link to={"/cart"} >
          </Link>
          {influencer ? 
          <Link to={"/influencer/profile"}>
            <div className='navMenuItem'>Profile</div>
          </Link> : ''
          }
        </div>
      </div>
    </div>

  )
}

export default InfluencerNavbar
