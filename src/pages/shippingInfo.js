import React,{useState} from 'react';
import "./shipping.css";
import { useSelector  } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import { LocationCityOutlined, PinDropOutlined } from '@material-ui/icons';
import { Phone, TransferWithinAStation } from '@mui/icons-material';
import Navbar from '../component/Navbar';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'


export default function () {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const accessToken = user.currentUser.accessToken;
  
  
  const [address, setAddress] = useState('');
  const [address_2, setAddress_2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [PaymentMethods, setPaymentMethods] = useState('');

  let navigate = useNavigate();
  let orderornot='';
  let sellerId ; 

  // let me = cart?.products?.map((item)=>{
  //   sellerId = item.seller
  // })

  const handleCreate = async()=>{
    {for (let i = 0; i < cart.products.length; i++) {
      // console.log(cart.products[i])
        try {
           await fetch(
            'http://192.168.18.4:5000/api/order', {method: 'POST',
            headers: { 'Content-Type': 'application/json' , token : accessToken },
            body: JSON.stringify({
              shippingInfo:{
                address:`${address}`,
                address_2:`${address_2}`,
                city:`${city}`,
                phone_Number:phoneNo,
                country:"Nepal",
              }, 
              orderItems:cart.products[i],
              Total_amount:`${cart.total + 60}`,
              PaymentMethods:`${PaymentMethods}`,
              shipping_price:10,
            })})
            .then(response => {
              response.json()
                .then(data => {
                  alert(data);
                });
            })
        }
        catch (error) {
          console.error(error);
        }
        
    }}

  }

  function handleChangecity(value){
    setCity(value);
  };
  function handleChange(value){
    setPaymentMethods(value);
  };
  return (
    <div className='mainShippingInfo'>
      <Navbar/>
      <div className='shippingContainer'>
        <h4>Shipping Details</h4>
     
        <div style={{marginTop:30 , display:'flex' , alignItems:"center"}}>
              <HomeIcon />
              <input className='shippingInput'
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{marginTop:30, display:'flex' , alignItems:"center"}}>
              <HomeIcon />
              <input className='shippingInput'
                type="text"
                placeholder="Address_2"
                required
                value={address_2}
                onChange={(e) => setAddress_2(e.target.value)}
              />
            </div>

            <div style={{marginTop:30 , display:'flex' , alignItems:"center"}}>
              <LocationCityOutlined />
              <select style={{paddingLeft:100 , paddingRight:100 , borderRadius:10}} name="" id="" onChange={event => handleChangecity(event.target.value)}>
               <option value="">Select City</option>
               <option value="Kathmandu">Kathmandu</option>
             </select>
            </div>


            <div style={{marginTop:30 , display:'flex' , alignItems:"center"}}>
            <Phone />
            <input className='shippingInput'
              type="number"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              onBlur={(e) => {
                if (e.target.value.length !== 10) {
                  alert("Please enter a 10-digit phone number");
                  setPhoneNo("");
                }
              }}
           />
       </div>


            <div style={{marginTop:20 , marginLeft:26}}>
             <h4>Payment methods</h4>
             <select name="" id="" onChange={event => handleChange(event.target.value)}>
               <option value="">Select method</option>
               <option value="Cash on delivery">Cash on delivery</option>
             </select>
            </div>
            {console.log(orderornot)}
           
              <button className='Button' onClick={handleCreate} disabled={address === '' || address_2 === '' || city === '' || phoneNo ==='' || PaymentMethods === '' ? true : ''}>Order Complete</button>
            
      </div>
    </div>
  )
}
