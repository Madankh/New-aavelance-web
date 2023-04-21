import React, { useEffect, useState } from 'react'
import "./featuredInfo.css"
import axios from 'axios';
import { useSelector } from 'react-redux';
import Chart from '../components/chart/Chart';

export default function FeaturedInfo() {
  const admin = useSelector((state) => state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;
  const [status , setStatus] = useState('pending')
  const [revanue , setrevanue] = useState([]);
  const [transaction , setTransaction] = useState([]);
  console.log(seller);  
  
    useEffect(() => {
      const income = async () => {
        try {
          const res = await axios.get('http://192.168.18.4:5000/api/order/get/userOrder', {
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
    const amount = revanue?.amount;
    console.log(amount);

    // useEffect(() => {
    //   const PostRevenue = async()=>{
    //     try {
    //       {amount === undefined && amount === null ? console.log("wait for a secound") :
    //       fetch(
    //        'http://192.168.100.27:5000/api/transfer/money', {method: 'POST',
    //         headers: { 'Content-Type': 'application/json' , token : accessToken },
    //         body: JSON.stringify({
    //          amount:revanue?.amount,
    //          status:status,
    //        })})
    //        .then(response => {
    //          response.json()
    //            .then(data => {
    //              if(data.success == true){
    //                console.log("suman")
    //              }else{
    //               console.log("Time doesn't match")
    //              }
    //            });
    //        })
    //       }
    //    }
    //    catch (error) {
    //      console.error(error);
    //    }
    //   }
    //   PostRevenue();
    // }, [amount])

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
