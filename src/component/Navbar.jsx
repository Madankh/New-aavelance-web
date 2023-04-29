import React, { useEffect, useState } from 'react';
import { SearchOutlined, ShoppingCartOutlined } from '@material-ui/icons';
import { Badge } from '@material-ui/core';
import { mobile } from '../responsive';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { logout } from '../pages/redux/userRedux'
import { createBrowserHistory } from "history";
import "./navbar.css";

const Navbar = () => {
  const quantity = useSelector(state => state.cart.quantity);
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  let id = user?.currentUser?.others?._id;
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const [searchValue, setSearchValue] = useState('');
  const history = createBrowserHistory();
  const handelSearch = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      history.push(`/result/search_query/${searchValue}`)
      window.location.reload(e);
    }
  }
  return (
    <div className='navContainer'>
      <div className='navWrapper'>
        <div className='navLeft'>
          <a href={"/"} style={{ textDecoration: 'none' }}>
            <h1 className='CompanyLogo'>Aavelance</h1>
            <p className='CompanyLogoPtage' >Your innovative partner</p>
          </a>
        </div>
        <div className='navCenter'>
          <SearchOutlined className='searchItems' />
          <input className='navInput' type="search" placeholder='Search Products.....' onKeyDown={handelSearch} onChange={(e) => setSearchValue(e.target.value)} />

          <a href={`/result/search_query/${searchValue}`}>
            <button className='searchBtn'>Search</button>
          </a>
        </div>
        <div className='navRight'>
          <a href={"/chat"} style={{ textDecoration: "none" }}>
            <div className='discussAbout' >
              <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg" style={{marginTop:"-2px"}}>
                <path fill="#FFFFFF" d="M5.5 20H18.5C19.328 20 20 19.328 20 18.5V7.5C20 6.672 19.328 6 18.5 6H5.5C4.672 6 4 6.672 4 7.5V18.5C4 19.328 4.672 20 5.5 20ZM6 8H18V18H6V8ZM8 10H16V12H8V10ZM8 14H14V16H8V14Z" />
              </svg>
              <p className='Discuss'>Discuss</p>
            </div>
          </a>
          {user.currentUser ? <div className='navMenuItem' onClick={handleLogout}>Logout</div> : [<a href={"/register"}><div className='navMenuItem'>Register</div></a>, <a href="/login"><div className='navMenuItem'>Login</div></a>]}
          <a href={"/cart"} >
            <div className='navMenuItem'>
              <Badge badgeContent={quantity} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </div>
          </a>
          <a href={"/cart"} >
          </a>
          {user.currentUser ?
            <a href={`/user/profile/${id}`}>
              <div className='navMenuItem'>Profile</div>
            </a> : ''
          }
        </div>
      </div>
    </div>

  )
}

export default Navbar
