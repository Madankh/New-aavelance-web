import React, { useState } from 'react'
import { AccountBalanceOutlined } from '@material-ui/icons'
import {LocationCityOutlined, Numbers } from '@mui/icons-material'
import { useSelector } from 'react-redux';
import Navbar from '../../component/Navbar';
export default function AddinfluenerBankAccount() {

      const user = useSelector((state) => state.user);
      let accessToken = user?.currentUser?.accessToken;
      const [BankName, setBankName] = useState('');
      const [accountName, setaccountName] = useState('');
      const [accountNumber, setaccountNumber] = useState('');
      const [BankAddress, setBankAddress] = useState('');

      const handleCreate = async()=>{
            try {
              await fetch(
                'http://api.aavelance.com/api/influencer/bank/create/bank/account', {method: 'POST',
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
                                    <p>Bank Account Name </p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='suman'  onChange={(e) => setaccountName(e.target.value)}  />
                        </div>

                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <Numbers />
                                    <p>Account Number</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="Number" placeholder='986467473654646'  onChange={(e) => setaccountNumber(e.target.value)} />
                        </div>

                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <AccountBalanceOutlined />
                                    <p>Bank Name</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='Laxmi bank'  onChange={(e) => setBankName(e.target.value)} />
                        </div>

                        <div style={{ alignItems: "center", cursor: 'pointer' }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                    <LocationCityOutlined />
                                    <p>Bank Branch Address</p>
                              </div>
                              <input style={{ marginTop: -13, marginLeft: 36, padding: 8, width: '50%' }} type="text" placeholder='Mahankal'  onChange={(e) => setBankAddress(e.target.value)} />
                        </div>

                      <button style={{ cursor: 'pointer', paddingLeft: 25,marginTop:20,width:'99%',  border: 'none', paddingTop: 7, paddingBottom: 7, borderRadius: 10, backgroundColor: 'green', color: "white" }} onClick={handleCreate}>Add</button>
                  </div>

            </div>
      )
}
