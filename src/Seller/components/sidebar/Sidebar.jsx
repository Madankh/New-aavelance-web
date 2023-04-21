import React from 'react'
import './sidebar.css'
import { TrendingUp, AttachMoney, ForumOutlined, Category, AddCircleOutline, WifiTethering , Reorder, Home } from "@material-ui/icons"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function Sidebar() {
    const admin = useSelector((state) => state.seller);

  
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Dashboard</h3>
                    <ul className='sidebarList'>
                        <Link to="/admin" className='link'>
                            <li className='sidebarListItem'>
                                <Home className='sidebarIcon' />
                                 Home
                            </li>
                        </Link>
                        <Link to="/sales" className='link'>
                            <li className='sidebarListItem'>
                                <TrendingUp className='sidebarIcon' />
                                 Sales
                            </li>
                        </Link>
                    </ul>
                </div>

                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Quick menu</h3>
                    <ul className='sidebarList'>

                        <Link to="/ProductListAdmin" className="link">
                            <li className='sidebarListItem'>
                                 <Category className='sidebarIcon' />
                                 Products
                            </li>

                        </Link>
                        <Link to="/newProductAdmin" className="link">
                            <li className='sidebarListItem'>
                                 <AddCircleOutline className='sidebarIcon' />
                                 Create Product
                            </li>
                        </Link>
                        <Link to={"/transaction"} className='link'>
                            <li className='sidebarListItem'>
                                 <AttachMoney className='sidebarIcon' />
                                 Transactions
                            </li>
                        </Link>

                        <Link to={"/Complected/transaction"} className='link'>
                            <li className='sidebarListItem'>
                                 <AttachMoney className='sidebarIcon' />
                                 Completed Transactions
                            </li>
                        </Link>
                    </ul>
                </div>

                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Notification</h3>
                    <ul className='sidebarList'>
                        <Link to={"/seller/penddingorder"} className="link">
                            <li className='sidebarListItem' >
                                <ForumOutlined className='sidebarIcon' />
                                Pending orders
                            </li>
                        </Link>

                        {/* <Link to={"/sellerOrder"} className="link">
                            <li className='sidebarListItem' >
                                <WifiTethering className='sidebarIcon' />
                                 Go live
                            </li>
                        </Link> */}

                        <Link to={"/Returnorder"} className="link">
                            <li className='sidebarListItem' >
                                <div style={{display:'flex'}}>
                                  <Reorder className='sidebarIcon' />
                                  {/* <span className='topIconBadgee'>4</span> */}
                                </div>
                                 Return orders
                            </li>
                        </Link>

                    </ul>
                </div>

            </div>
        </div>
    )
}
