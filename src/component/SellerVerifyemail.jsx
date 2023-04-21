import React, { useState } from 'react'
import styled from "styled-components";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { VerifySeller, VerifyUser } from '../pages/redux/apiCalls';

const Error = styled.span`
  color:red;
`;

const Container = styled.div`
   width:100vw;
   height:100vh;
   display:flex;
   align-items:center;
   justify-content:center;
`;

const Wrapper = styled.div`
   width:25%;
   padding:20px;
   margin:auto;
   border-radius: 10px;
   background-color:black;
`;

const Title = styled.h1`
   font-size:20px;
   font-weight:300;
   color:white;
   margin-left:100px;
   font-Weight:600
`;

const Form = styled.form`
   display:flex;
   flex-direction:column;
`;

const Input = styled.input`
   flex:1;
   min-width:40%;
   margin: 10px 0px;
   padding:10px;
   border-radius:10px;
   border:1px solid pink;
`;


const Button = styled.button`
   width:40%;
   border:none;
   padding:15px 20px;
   margin:20px 0px;
   background-color:white;
   color:black;
   cursor:pointer;
   border-radius:20px;
   &:disabled{
      color:green;
      cursor:not-allowed
   }
`;
const Linkk = styled.a`
  margin:5px 0px;
  text-decoration:none;
  cursor:pointer;
  color:white
`;

export default function SellerVerifyemail() {
   let sellers = useSelector(state => state.seller);
   const dispatch = useDispatch();
   const seller = sellers?.currentSeller?.seller;
   const [OTP , setOTP] = useState('');
   console.log(OTP)
   const handleOTP = (e)=>{
      e.preventDefault();
      VerifySeller(dispatch,{seller , OTP})
   }
  return (
    <Container>
            <Wrapper>
                <Title>Aavelance Send Email</Title>
                <Form>
                    <Input type={"number"} placeholder="Enter Your OTP" onChange={(e)=> setOTP(e.target.value)}/>
                    <Button onClick={handleOTP}>Confirm OTP</Button>
                    <Link to={"/register"}>
                       <Linkk>Check your email to get a OTP</Linkk>
                    </Link>
         
                </Form>
            </Wrapper>
        </Container>
  )
}
