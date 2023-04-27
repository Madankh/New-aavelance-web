import React,{useState} from 'react';
import "./shipping.css";
import { useSelector  } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import { LocationCityOutlined, PinDropOutlined } from '@material-ui/icons';
import { Phone, TransferWithinAStation } from '@mui/icons-material';
import Navbar from '../component/Navbar';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'


const Button = styled.button`
   width:30%;
   border:none;
   padding:13px 30px;
   margin:20px 0px;
   background-color:green;
   color:white;
   cursor:pointer;
   border-radius:20px;
   &:disabled{
      color:red;
      cursor:not-allowed
   }
`;

export default function () {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const accessToken = user.currentUser.accessToken;
  console.log(user)

  // const dispatch = useDispatch();
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
    try {
      await fetch(
        'http://api.aavelance.com/api/order', {method: 'POST',
        headers: { 'Content-Type': 'application/json' , token : accessToken },
        body: JSON.stringify({
          shippingInfo:{
            address:`${address}`,
            address_2:`${address_2}`,
            city:`${city}`,
            state:`${state}`,
            pinCode:`${pinCode}`,
            phone_Number:phoneNo,
            country:"Nepal",
          }, 
          orderItems:cart.products,
          Total_amount:`${cart.total}`,
          PaymentMethods:`${PaymentMethods}`,
          shipping_price:10,
        })})
        .then(response => {
          response.json()
            .then(data => {
              if(data.success === true){
                navigate('/success');
                console.log("suman")
              }else{

              }
            });
        })
    }
    catch (error) {
      console.error(error);
    }
  }

console.log(cart.products)

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
              <input style={{width:'30%' , height:40 , marginLeft:10}}
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{marginTop:30, display:'flex' , alignItems:"center"}}>
              <HomeIcon />
              <input style={{width:'30%' , height:40 , marginLeft:10}}
                type="text"
                placeholder="Address_2"
                required
                value={address_2}
                onChange={(e) => setAddress_2(e.target.value)}
              />
            </div>

            <div style={{marginTop:30 , display:'flex' , alignItems:"center"}}>
              <LocationCityOutlined />
              <input style={{width:'30%' , height:40 , marginLeft:10}}
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div style={{marginTop:30 , display:'flex' , alignItems:"center"}}>
              <PinDropOutlined />
              <input style={{width:'30%' , height:40 , marginLeft:10}}
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>

            <div style={{marginTop:30 , display:'flex' , alignItems:"center"}}>
              <Phone />
              <input style={{width:'30%' , height:40 , marginLeft:10}}
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            <div style={{marginTop:30, display:'flex' , alignItems:"center"}}>
              <TransferWithinAStation />
              <input style={{width:'30%' , height:40 , marginLeft:10}}
                type="text"
                placeholder="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                size="10"
              ></input>
            </div>
            <div style={{marginTop:20 , marginLeft:26}}>
             <h4>Payment methods</h4>
             <select name="" id="" onChange={event => handleChange(event.target.value)}>
               <option value="">Select method</option>
               <option value="Cash on delivery">Cash on delivery</option>
             </select>
            </div>
            {console.log(orderornot)}
           
              <Button onClick={handleCreate} disabled={address === '' || address_2 === '' || city === '' || state === '' || pinCode === '' || phoneNo ==='' || PaymentMethods === '' ? true : ''}>Order Complete</Button>
            
      </div>
    </div>
  )
}
