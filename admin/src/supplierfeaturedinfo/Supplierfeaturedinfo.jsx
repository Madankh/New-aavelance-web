import React from 'react'
import "./supplierfeaturedinfo.css"
import {ArrowDownward , ArrowUpward} from "@material-ui/icons"
import { Link } from 'react-router-dom'

export default function Supplierfeaturedinfo() {
    return (
        <div>
        <div className='featured'>
                <div className="featuredItem">
            <Link to={"/seller/sales/:id"}>
                    <span className='featuredTitle'>Net Revenue</span>
                    <div className="featuredMoneyContainer">
                        <span className='featuredMoney'>NPR 2,415</span>
                    </div>
            </Link>
                </div>
           
           

                <div className="featuredItem">
            <Link to={"/seller/productlist/:id"}>
                    <span className='featuredTitle'>Total Products</span>
                    <div className="featuredMoneyContainer">
                        <span className='featuredMoney'>415</span>
                    </div>
            </Link>
                </div>
                <div className="featuredItem">
            <Link to={"/seller/pendingorder/:id"}>
                    <span className='featuredTitle'>Pending Orders</span>
                    <div className="featuredMoneyContainer">
                        <span className='featuredMoney'>45</span>
                    </div>
            </Link>
                </div>

        </div>
        <div className='featured'>
        <div className="featuredItem">
                <span className='featuredTitle'>Previous week income</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>NPR 2,415</span>
                </div>
                <button style={{border:'none'}}>Status : pending</button>
            </div>
            <div className="featuredItem">
            <Link to={"/supplier/return/pendingorder/:id"}>
                <span className='featuredTitle'>Pending Return orders</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>15</span>
                </div>
            </Link>
            </div>
            <div className="featuredItem">
                <span className='featuredTitle'>Complete Return orders</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>5</span>
                </div>
            </div>
        </div>

        <div className="featuredItemmm">
                <span className='featuredTitle'>Marketplace Cost</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>NPR 2,415</span>
                </div>
            </div>


        <div>
            <div style={{ backgroundColor: "white", flex: 1.6, marginLeft: 150, marginRight: 50, height: '70vh', width: '40%', borderRadius: 20 }}>
                <h2 style={{ marginLeft: -120 }}>Bank Details</h2>
                <div style={{ alignItems: "center", cursor: 'pointer' }}>

                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                        {/* <AccountBalanceOutlined /> */}
                        <p>Bank Account Number</p>
                    </div>
                    <p style={{ marginTop: -5, marginLeft: -120 }}>986467473654646</p>
                </div>
                <div style={{ alignItems: "center", cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                        {/* <DriveFileRenameOutline /> */}
                        <p>Bank Account Name</p>
                    </div>
                    <p style={{ marginTop: -13, marginLeft: -120 }}>Suman khadka</p>

                </div>

                <div style={{ alignItems: "center", cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                        {/* <BadgeOutlined /> */}
                        {/* <BadgeOutlined/> */}
                        {/*  */}

                        <p>Bank Account Phone Number</p>
                    </div>
                    <p style={{ marginTop: -13, marginLeft: -120 }}>Laxmi bank</p>
                </div>

                <div style={{ alignItems: "center", cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                        {/* <BadgeOutlined /> */}
                        {/* <BadgeOutlined/> */}
                        {/*  */}

                        <p>Bank Name</p>
                    </div>
                    <p style={{ marginTop: -13, marginLeft: -120 }}>Laxmi bank</p>
                </div>


                <div style={{ alignItems: "center", cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: -120 }}>
                        {/* <LocationCityOutlined /> */}
                        <p>Bank Branch Address</p>
                    </div>
                    <p style={{ marginTop: -13, marginLeft: -120 }}>Mahankal</p>
                    <p></p>
                </div>
                {/* <Link to={"/seller/update/bank/account"}>
                    <button style={{ cursor: 'pointer', width: '100%', paddingLeft: 35, paddingRight: 35, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white" }}>Edit</button>
                </Link> */}
            </div>
        </div>
    </div>
    )
}
