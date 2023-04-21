import React, { useState } from 'react'
import styled from "styled-components";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { VerifyUser } from '../pages/redux/apiCalls';
import { mobile } from '../responsive';

const Error = styled.span`
  color:red;
`;

const Container = styled.div`
   width:100vw;
   height:100vh;
   background: linear-gradient(
   rgba(255,255,255,0.5),
   rgba(255,255,255,0.5)),
   url("https://png.pngtree.com/background/20220716/original/pngtree-illustration-form-registration-appointment-medical-life-background-design-picture-image_1645287.jpg") center;
   display:flex;
   align-items:center;
   justify-content:center;
`;

const Wrapper = styled.div`
   width:35%;
   padding:20px;
   margin:auto;
   border-radius: 10px;
   background-color:black;
   ${mobile({width:"75%"})}
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

export default function Verifyemail() {
   let users = useSelector(state => state.user);
   const {isFetching , error} = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const user = users?.currentUser?.user;
   const [OTP , setOTP] = useState('');
   console.log(OTP)
   const handleOTP = (e)=>{
      e.preventDefault();
      VerifyUser(dispatch,{user , OTP})
   }
   console.log(error)
  return (
    <Container>
            <Wrapper>
                <Title>Aavelance Send Email</Title>
                <Form>
                    <Input type={"number"} placeholder="Enter Your OTP" onChange={(e)=> setOTP(e.target.value)}/>
                    <Button onClick={handleOTP}>Confirm OTP</Button>
                    {error !== false ?<p style={{color:"red" , marginLeft:"-12px"}}>{error}</p>:""}
                    <Link to={"/register"}>
                       <Linkk>Check your email to get a OTP</Linkk>
                    </Link>
         
                </Form>
            </Wrapper>
        </Container>
  )
}
