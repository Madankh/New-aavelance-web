import {mobile} from "../responsive"
import styled from "styled-components"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "./redux/apiCalls";
import { createBrowserHistory } from "history";
import { useNavigate } from 'react-router';
import Navbar from "../component/Navbar";
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
   width:40%;
   padding:20px;
   background-color:rgb(95 131 115 / 48%);
   ${mobile({width:"75%"})}
`;

const Title = styled.h1`
   font-size:34px;
   font-weight:300;
   color:white
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
   color:white
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
   
   const [username , setUsername] = useState("");
   const [phoneNumber , setPhonenumber] = useState("");
   const [email , setEmail] = useState("");
   const [password , setPassword] = useState("");
   let navigate = useNavigate();
   const dispatch = useDispatch();

   const {isFetching , error} = useSelector((state) => state.user);
   const user = useSelector((state) => state.user);
   if(user?.currentUser?.status === 'Pending'){
      navigate(`/verify/email`);

   }
   const handleClick = (e)=>{
      e.preventDefault();
      register(dispatch , { username , phoneNumber, email , password });
      
   }
   const users = useSelector(state => state.user);
    return (
      <>
      <Navbar/>
        <Container>
            <Wrapper>
                <Title>Create an Account</Title>
                <Form>
                    <Input placeholder="Username" onChange={(e)=> setUsername((e.target.value))}/>
                    <Input placeholder="PhoneNumber" type="text" onChange={(e)=> setPhonenumber((e.target.value))}/>
                    <Input placeholder="Email" type="email"  onChange={(e)=> setEmail((e.target.value))}/>
                    <Input placeholder="password" type="password" onChange={(e)=> setPassword((e.target.value))} />
                    <div style={{padding:"10px" , marginLeft:"-10px"}}>
                    {error?.errors?.map((item)=>(
                       <li style={{color:"red" , marginTop:"0px" , fontSize:"13px"}}>{item.msg}</li>
                       ))}
                       </div>

                     {error?.errors ? '':
                    <p style={{color:"red" , marginTop:"-30px"}}>{users?.error}</p>
                    
                   }

                    <Agreement>By creating an account, I consent to the process of my personal data in accordance with the <b>PRIVACY POLICY</b></Agreement><br />
                    <Button onClick={handleClick} >Create</Button>
                </Form>
            </Wrapper>
        </Container>
        </>
    )
}

export default Register
