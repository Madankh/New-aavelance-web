import { useSelector } from 'react-redux'; 
import { useState} from "react";
import styled from "styled-components";
import {mobile} from "../responsive";
import { login } from "./redux/apiCalls";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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
   ${mobile({width:"75%"})}
`;

const Title = styled.h1`
   font-size:34px;
   font-weight:300;
   color:white;
   margin-left:170px;
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

const Login = () => {
   const [email , setUsername] = useState("");
   const [password , setPassword] = useState("");
   const dispatch = useDispatch();
   const {isFetching , error} = useSelector((state) => state.user);

   const handleClick = (e)=>{
      e.preventDefault();
      login(dispatch , {email , password});
   }
   
    return (
        <Container>
            <Wrapper>
                <Title>Login</Title>
                <Form>
                    <Input type={"email"} placeholder="Email" onChange={(e) => setUsername(e.target.value)}/>
                    <Input type={"password"} placeholder="password" onChange={(e)=> setPassword(e.target.value)} /><br/>
                    <Button onClick={handleClick} disabled={isFetching}>Login</Button>
                    {/* {error && <Error>Something went wrong</Error>} */}
                    <Link to={'/Forgot/password'}>
                       <Linkk>Forgot password</Linkk>
                    </Link>
                    <Link to={"/register"}>
                       <Linkk>Create a new account</Linkk>
                    </Link>
         
                </Form>
            </Wrapper>
        </Container>
    )
}

export default Login
