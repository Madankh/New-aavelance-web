import React, { useEffect, useState } from 'react'
import "../widgetLg/widgetLg.css"
import Sidebar from '../sidebar/Sidebar'
import Topbar from '../topbar/Topbar'
import axios from 'axios'
import { useSelector } from 'react-redux'
export default function Transaction() {
    
  const admin = useSelector((state) => state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;
  const [transaction , setTransaction] = useState([]);
  useEffect(() => {
        const getTransaction = async()=>{
          try {
            const res = await axios.get(`http://192.168.18.4:5000/api/transfer/get/transaction`, {
              headers:{
                token: accessToken
              }
            })
            setTransaction(res.data);
          } catch (error) {
            
          }
        }
        getTransaction();
      }, [0])

      console.log(transaction)

    return (
        <>
            <Topbar />
            <div style={{ display: "flex" }}>
                    <Sidebar />
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
                                {/* <img src="https://image.shutterstock.com/image-illustration/beautiful-aurora-universe-milky-way-260nw-1787056478.jpg" className='companyImage' alt="" /> */}
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
