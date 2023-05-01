import React, { useEffect, useState } from 'react'
import "./featuredInfo.css"
import axios from 'axios';
import { useSelector } from 'react-redux';
import Chart from '../components/chart/Chart';

export default function FeaturedInfo() {
  const admin = useSelector((state) => state.seller);
  let accessToken = admin.currentSeller.accessToken;
  const [revanue , setrevanue] = useState([]); 
  
    useEffect(() => {
      const income = async () => {
        try {
          const res = await axios.get('https://api.aavelance.com/api/order/get/userOrder', {
            headers: {
              token: accessToken
            }
          })
          setrevanue(res.data);
        } catch (error) {
  
        }
      }
      income();
    }, [0]);


    return (
      <div>
        <div className='featuredd'>
            <div className="featuredItem">
                <span className='featuredTitle'>Net revenue</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>NPR {revanue.amount}</span>
                </div>
                <span className='featuredSub'>Current week revenue</span>
            </div>
            <div className="featuredItem">
                <span className='featuredTitle'>Sales</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>NPR {revanue.Sales}</span>
                </div>
                <span className='featuredSub'>Current week sales</span>
            </div>
            <div className="featuredItem">
                <span className='featuredTitle'>Marketplace Cost</span>
                <div className="featuredMoneyContainer">
                    <span className='featuredMoney'>NPR {revanue.marketplace}</span>
                </div>
                <span className='featuredSub'>Current week Marketplace cost </span>
            </div>

        </div>
        {/* <Chart/> */}
        </div>
       
    )
}
