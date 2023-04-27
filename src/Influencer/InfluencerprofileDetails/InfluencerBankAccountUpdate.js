import React, { useEffect, useState } from 'react'
import { AccountBalanceOutlined } from '@material-ui/icons'
import { BadgeOutlined, DriveFileRenameOutline, LocationCityOutlined } from '@mui/icons-material'
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navbar from '../../component/Navbar';
export default function InfluencerBankAccountUpdate() {
      const user = useSelector((state) => state.user);
      let accessToken = user?.currentUser?.accessToken;

      const [BankAccountDetails , setBankAccountDetails] = useState([]);
      useEffect(() => {
        const getTransaction = async()=>{
          try {
            const res = await axios.get(`http://api.aavelance.com/api/influencer/bank/account`, {
              headers:{
                token: accessToken
              }
            })
            setBankAccountDetails(res.data);
          } catch (error) {
            
          }
        }
        getTransaction();
      }, [0])


      const id = user?.currentUser?.others?._id;
      const [BankName, setBankName] = useState('');
      const [accountName, setaccountName] = useState('');
      const [accountNumber, setaccountNumber] = useState('');
      const [BankAddress, setBankAddress] = useState('');



      const handleUpdate = async()=>{
            try {
              await fetch(
                `http://api.aavelance.com/api/influencer/bank/${id}`, {method: 'PUT',
                headers: { 'Content-Type': 'application/json' , token : accessToken },
                body: JSON.stringify({
                  BankName:`${BankName}`,
                  accountName:`${accountName}`,
                  accountNumber:`${accountNumber}`,
                  BankAddress:`${BankAddress}`,
                })})
                .then(response => {
                  response.json()
                    .then(data => {
                     alert(data)
                    });
                })
            }
            catch (error) {
              console.error(error);
            }
          }
      return (
            <div style={{ backgroundColor: 'black' , height:'100vh' , overflow:'hidden' }}>
                  <Navbar />
                  <div style={{ backgroundColor: "white",  marginLeft: 150,  height: '70vh', width: '100%', borderRadius: 20 , marginLeft:10 , marginTop:40  }}>
                        <h2 style={{ marginLeft: 20 }}>Bank Details</h2>
                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <AccountBalanceOutlined />
                                    <p>Bank Acc Number</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='986467473654646' onChange={(e) => setaccountNumber(e.target.value)} />
                        </div>

                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <DriveFileRenameOutline />
                                    <p>Bank Acc Name</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='Suman khadka' onChange={(e) => setaccountName(e.target.value)} />
                        </div>

                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <BadgeOutlined />
                                    <p>Bank Name</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='Laxmi bank' onChange={(e) => setBankName(e.target.value)} />
                        </div>

                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <LocationCityOutlined />
                                    <p>Bank Branch Address</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='Mahankal' onChange={(e) => setBankAddress(e.target.value)} />
                        </div>
                      <button style={{ cursor: 'pointer', marginLeft: '0%', paddingLeft: 25,marginTop:20,width:'100%', paddingRight: 35, border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white" }} onClick={handleUpdate}>Update</button>
                  </div>

            </div>
      )
}
