import React, { useEffect, useState } from 'react'
import './sidebar.css'
import {AttachMoney, WifiTethering , Reorder, Home, Settings , AdminPanelSettings } from "@material-ui/icons"
import { Link } from 'react-router-dom'
import { AdminPanelSettingsOutlined, Pending } from '@mui/icons-material';

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">

                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Dashboard</h3>
                    <ul className='sidebarList'>
                        <Link to="/influencer" className='link'>
                            <li className='sidebarListItem'>
                                <Home className='sidebarIcon' />
                                <p className='ptage'>Home</p>
                            </li>
                        </Link>
                        <Link to="/influencer/profile" className='link'>
                            <li className='sidebarListItem'>
                                <AdminPanelSettingsOutlined className='sidebarIcon' />
                                <p className='ptage'>Admin</p>
                            </li>
                        </Link>
                        <Link to="/Influencer/pending/orders" className='link'>
                            <li className='sidebarListItem'>
                                <Pending className='sidebarIcon' />
                                <p className='ptage'>Pending orders</p>
                            </li>
                        </Link>
                        <Link to={"/Influencer/Returnorder"} className="link">
                            <li className='sidebarListItem' >
                                <div style={{display:'flex'}}>
                                  <Reorder className='sidebarIcon' />
                                </div>
                                <p className='ptage'>Return orders</p>
                            </li>
                        </Link>

                    </ul>
                </div>

                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Payment</h3>
                    <ul className='sidebarList'>
                        <Link to={"/influencer/transaction"} className='link'>
                            <li className='sidebarListItem'>
                                 <AttachMoney className='sidebarIcon' />
                                <p className='ptage'>Transactions</p> 
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Setting</h3>
                    <ul className='sidebarList'>
                        <Link to={"/influencer/go/live"} className="link">
                            <li className='sidebarListItem' >
                                <WifiTethering className='sidebarIcon' />
                                <p className='ptage'>Go live</p> 
                            </li>
                        </Link>
                        <Link to={"/influencer/Personal/data"} className="link">
                            <li className='sidebarListItem' >
                                <Settings className='sidebarIcon' />
                                <p className='ptage'>Personal data</p>
                            </li>
                        </Link>
                    </ul>
                </div>

            </div>
        </div>
    )
}
