import React, { useEffect, useState } from 'react'
import "../widgetLg/widgetLg.css"
import Sidebar from '../sidebar/Sidebar'
import Topbar from '../topbar/Topbar'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Navbar from '../../../component/Navbar'
export default function UserTransactions() {
    let userDetails = useSelector(state => state.user)
    const accessToken = userDetails?.currentUser?.accessToken;

    const [transaction , setTransaction] = useState([]);

    useEffect(() => {
        const getTransaction = async ()=>{
            try {
                const res = await axios.get(`https://api.aavelance.com/api/influencer/transaction/get/transaction`,
               { headers:{
                  token: accessToken
                }})
                setTransaction(res.data);
              } catch (error) {
                  
              }
          }
          getTransaction();
      }, [])
    console.log(transaction)

    return (
        <>
            <Navbar/>
            <div style={{ display: "flex" }}>
                  <div className='widgetLgg'>
                    <h3 className='widgetLgTitle'>Latest Transactions</h3>
                    <table className='widgetLgTable'>
                        <tr className='widgetLgTr'>
                            <th className="widgetLgth">Your transactions</th>
                            <th className="widgetLgthDate">Date</th>
                            <th className="widgetLgth">Amount</th>
                            <th className="widgetLgth">Status</th>
                        </tr>
                        {transaction?.map((item)=>(
                          <tr className='widgetLgTr'>
                            <td className='widgetLgUser'>
                                <span className='widgetLgName'>Aavelance</span>
                            </td>
                            <td className='widgetLgthDatee'>{item?.createdAt}</td>
                            <td className='widgetLgAmount'>NPR {item?.amount}</td>
                            <td className='widgetLgStatus'>
                              <button className={"widgetLgButton"}>{item?.status}</button>
                            </td>
                        </tr>   
                            ))} 
                        
                    </table>
                </div>
            </div>
        </>
    )
}
