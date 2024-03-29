import {mobile} from "../responsive"
import styled from "styled-components"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sellerlogins } from "./redux/apiCalls";
import { Link } from "react-router-dom";

const Container = styled.div`
   width:100vw;
   height:100vh;
   background: linear-gradient(
      rgba(255,255,255,0.5),
      rgba(255,255,255,0.5)),
      url("https://htmlcolorcodes.com/assets/images/colors/black-color-solid-background-1920x1080.png") center;
      display:flex;
      align-items:center;
      justify-content:center;
   
`;

const Wrapper = styled.div`
   width:30%;
   height:45vh;
   padding:20px;
   background-color:#edf1fe;
   align-item:center;
   margin:auto;
   margin-top:120px;
   border-radius: 10px;
   ${mobile({width:"75%"})}
   
`;

const Title = styled.h1`
   font-size:34px;
   font-weight:300;
   margin-left:30px;
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

const Button = styled.button`
   width:40%;
   border:none;
   padding:15px 20px;
   margin:20px 0px;
   background-color:teal;
   color:white;

`;

const Sellerlogin = () => {
   const [email , setEmail] = useState("");
   const [password , setPassword] = useState("");
   const dispatch = useDispatch();
   const {isFetching , error} = useSelector((state) => state.seller);
   
   const handleClick = (e)=>{
      e.preventDefault();
      Sellerlogins(dispatch , {email , password});
   }
   console.log()
    return (
        <Container>
            <Wrapper>
                <Title>Seller login</Title>
                <Form>
                   <div style={{display:'flex' , flexDirection:'column'}}>
                     <Input placeholder="Email" type="email"  onChange={(e)=> setEmail((e.target.value))}/>
                     <Input placeholder="password" type="password" onChange={(e)=> setPassword((e.target.value))} /> 
                   </div>
                    <Button onClick={handleClick} disabled={isFetching}>Login</Button>
                    <Link to={"/Seller/register"}>
                        <p>Create Seller account</p>
                    </Link>
                    <Link to={"/Forgot/password"}>
                        <p>Forgot password</p>
                    </Link>
                </Form>
            </Wrapper>
        </Container>
    )
}

export default Sellerlogin
