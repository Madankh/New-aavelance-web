import React from 'react'
import './sidebar.css'
import { LineStyle, Person, Category } from "@material-ui/icons"
import { Link } from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Dashboard</h3>
                    <ul className='sidebarList'>
                        <Link to="/" className='link'>
                        <li className='sidebarListItem'>
                            <LineStyle className='sidebarIcon'/>
                             Home
                        </li>
                        </Link>
                      
                        {/* <li className='sidebarListItem'>
                            <TrendingUp className='sidebarIcon'/>
                            Sales
                        </li> */}
                    </ul>
                </div>
                <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Quick menu</h3>
                    <ul className='sidebarList'>
                        <Link to="/users" className="link">
                          <li className='sidebarListItem'>
                              <Person className='sidebarIcon'/>
                               Users
                          </li>
                        </Link>
                        
                        <Link to="/SellerList" className="link">
                            <li className='sidebarListItem'>
                                <Person className='sidebarIcon' />
                                Seller
                            </li>
                        </Link>

                        {/* <Link to="/InfluencerList" className="link">
                            <li className='sidebarListItem'>
                                <Person className='sidebarIcon' />
                                influence 
                            </li>
                        </Link> */}

                        <Link to="/SellerPaymentPendingList" className="link">
                            <li className='sidebarListItem'>
                                <Category className='sidebarIcon' />
                                Pending Seller Payments 
                            </li>
                        </Link>

                        <Link to="/InfluencerPaymentPendingList" className="link">
                            <li className='sidebarListItem'>
                                <Category className='sidebarIcon' />
                                Pending User Payments 
                            </li>
                        </Link>




                        <Link to="/com/SellerPaymentPendingList" className="link">
                            <li className='sidebarListItem'>
                                <Category className='sidebarIcon' />
                                Completed Seller Payments 
                            </li>
                        </Link>

                        <Link to="/com/UserPaymentPendingList" className="link">
                            <li className='sidebarListItem'>
                                <Category className='sidebarIcon' />
                                Completed User Payments 
                            </li>
                        </Link>





                        <Link to="/pending/order" className="link">
                            <li className='sidebarListItem'>
                                {/* <PendingActionsIcon className='sidebarIcon' /> */}
                                Pending orders 
                            </li>
                        </Link>
                        <Link to="/return/pending/order" className="link">
                            <li className='sidebarListItem'>
                                {/* <PendingIcon className='sidebarIcon' /> */}
                                Pending return orders 
                            </li>
                        </Link>
                       
                    </ul>
                </div>

                {/* <div className="sidebarmenu">
                    <h3 className='sidebarTitle'>Notification</h3>
                    <ul className='sidebarList'>
                        
                        <li className='sidebarListItem'>
                            <ForumOutlined className='sidebarIcon'/>
                            Orders
                        </li>
                        <li className='sidebarListItem'>
                            <ChatBubbleOutlineOutlined className='sidebarIcon'/>
                            Messages
                        </li>
                    </ul>
                </div> */}
                
            </div>
        </div>
    )
}
