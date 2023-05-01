import React, { useEffect, useState } from 'react'
import { AccountBalanceOutlined } from '@material-ui/icons'
import { BadgeOutlined, DriveFileRenameOutline, LocationCityOutlined, Numbers } from '@mui/icons-material'
import { useSelector } from 'react-redux';
import Topbar from '../../Seller/components/topbar/Topbar';
import axios from 'axios';
import styled from 'styled-components'
export default function SellerBankAccountUpdate() {



const Button = styled.button`
    margin-left: 0%;
    padding-left: 25px;
    margin-top:20px;
    width:100%;
    padding-right: 35px;
     border: none;
     padding-top: 7px; 
     padding-bottom: 7px; 
     border-radius: 10px; 
     background-color: green; 
     color: white;
   &:disabled{
      color:red;
      cursor:not-allowed
   }
`;
      const admin = useSelector((state) => state.seller);
      let accessToken = admin.currentSeller.accessToken;
      const [BankDetailts, setBankDetailts] = useState({});
      
      useEffect(() => {
            const bankAccount = async () => {
              try {
                const res = await axios.get('https://api.aavelance.com/api/bankaccout/accountdetail', {
                  headers: {
                    token: accessToken
                  }
                })
                setBankDetailts(res.data);
            } catch (error) {
                  
            }
      }
            bankAccount();
          }, [0]);
      //      console.log(BankDetailts?.BankName , BankDetailts?.accountName , BankDetailts?.accountNumber , BankDetailts?.BankAddress)
          const [BankName, setBankName] = useState('');
          const [accountName, setaccountName] = useState('');
          const [accountNumber, setaccountNumber] = useState(null);
          const [BankAddress, setBankAddress] = useState('');

      const handleUpdate = async()=>{
            try {
              await fetch(
                `https://api.aavelance.com/api/bankaccout/${admin.currentSeller._id}`, {method: 'PUT',
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
                     console.log(data)
                    });
                })
            }
            catch (error) {
              console.error(error);
            }
          }
      return (
            <div style={{ backgroundColor: 'black' , height:'100vh' , overflow:'hidden' }}>
                  <Topbar />
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
                      <Button  
                      disabled={BankName === '' || accountName === '' || accountNumber === null || BankAddress === '' ? true : ''}
                       onClick={handleUpdate}>Update</Button>
                  </div>

            </div>
      )
}
