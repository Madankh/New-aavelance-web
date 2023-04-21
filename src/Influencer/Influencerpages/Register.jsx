import {mobile} from "../responsive"
import styled from "styled-components"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "./redux/apiCalls";
import { createBrowserHistory } from "history";
import { Navigate } from "react-router-dom";
const Container = styled.div`
   width:100vw;
   height:100vh;
   background: linear-gradient(
       rgba(255,255,255,0.5),
       rgba(255,255,255,0.5)),
       url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940") center;
       display:flex;
       align-items:center;
       justify-content:center;
   
`;

const Wrapper = styled.div`
   width:40%;
   padding:20px;
   background-color:white;
   ${mobile({width:"75%"})}
`;

const Title = styled.h1`
   font-size:34px;
   font-weight:300;
`;

const Form = styled.form`
   align-items:center;
   margin:20px;
   justify-content:center;
`;

const Input = styled.input`
   flex:1;
   min-width:40%;
   margin:20px 10px 0px 0px;
   padding:10px;
   border-radius:10px;
   border:1px solid pink;
`;

const Agreement = styled.span`
   font-size:12px;
   margin:20px 0px;
`;
const Button = styled.button`
   width:40%;
   border:none;
   padding:15px 20px;
   margin:20px 0px;
   background-color:teal;
   color:white;

`;

const Register = () => {
   
   // const [name , setName] = useState("");
   // const [lastname , SetLastname] = useState("");
   const [username , setUsername] = useState("");
   const [phoneNumber , setPhonenumber] = useState("");
   const [email , setEmail] = useState("");
   const [password , setPassword] = useState("");
   const history = createBrowserHistory();
   const dispatch = useDispatch();

   const {isFetching , error} = useSelector((state) => state.user);
   
   const handleClick = (e)=>{
      e.preventDefault();
      register(dispatch , { username , phoneNumber, email , password });
      Navigate("/")
   }
    return (
        <Container>
            <Wrapper>
                <Title>Create an Account</Title>
                <Form>
                    {/* <Input placeholder="name" onChange={(e)=> setName(e.target.value)}/>
                    <Input placeholder="last name" onChange={(e)=> SetLastname(e.target.value)}/> */}
                    <Input placeholder="Username" onChange={(e)=> setUsername((e.target.value))}/>
                    <Input placeholder="PhoneNumber" type="text" onChange={(e)=> setPhonenumber((e.target.value))}/>
                    <Input placeholder="Email" type="email"  onChange={(e)=> setEmail((e.target.value))}/>
                    <Input placeholder="password" type="password" onChange={(e)=> setPassword((e.target.value))} />
                    {/* <Input placeholder="confirm password" type="password" onChange={(e)=> setcomformPassword((e.target.value))} /><br /> */}
                    <Agreement>By creating an account, I consent to the process of my personal data in accordance with the <b>PRIVACY POLICY</b></Agreement><br />
                    <Button onClick={handleClick} disabled={isFetching}>Create</Button>
                </Form>
            </Wrapper>
        </Container>
    )
}

export default Register
