
import {mobile} from "../../responsive"
import styled from "styled-components"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InfluencersRegister } from "../../pages/redux/apiCalls";
import { useNavigate } from 'react-router';
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

const InfluencerRegister = () => {
   const [username , setUsername] = useState("");
   const [phoneNumber , setPhonenumber] = useState("");
   const [email , setEmail] = useState("");
   const [password , setPassword] = useState("");
   const [PAN , setPAN] = useState("");
   const [City , setCity] = useState("");
   const [State , setState] = useState("");
   let navigate = useNavigate();
   const dispatch = useDispatch();

   const {isFetching , error} = useSelector((state) => state.influencer);
   const influencer = useSelector((state) => state.influencer);
   if(influencer?.currentInfluencer?.Status === 'Pending'){
      navigate("/influencer/verify/email")

   }
   
   console.log(influencer);
   const handleClick = (e)=>{
      e.preventDefault();
      InfluencersRegister(dispatch , { username , phoneNumber, email , password , PAN , City , State });
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
                    <Input placeholder="Password" type="password" onChange={(e)=> setPassword((e.target.value))} />
                    <Input placeholder="PAN" type="number" onChange={(e)=> setPAN((e.target.value))} />
                    <Input placeholder="City" type="text" onChange={(e)=> setCity((e.target.value))} />
                    <Input placeholder="State" type="text" onChange={(e)=> setState((e.target.value))} />
                    {error?.errors?.map((item)=>(
                       <li style={{color:"red" , marginTop:"0px" , fontSize:"13px" , padding:"3px"}}>{item.msg}</li>
                       ))}
                    {/* <Input placeholder="confirm password" type="password" onChange={(e)=> setcomformPassword((e.target.value))} /><br /> */}
                    <Agreement>By creating an account, I consent to the process of my personal data in accordance with the <b>PRIVACY POLICY</b></Agreement><br />
                    <Button onClick={handleClick} disabled={isFetching}>Create</Button>
                </Form>
            </Wrapper>
        </Container>
    )
}

export default InfluencerRegister
