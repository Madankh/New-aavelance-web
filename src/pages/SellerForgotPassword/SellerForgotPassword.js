
import styled from "styled-components";
import { mobile } from '../../responsive';
import { useState } from "react";

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
   width:25%;
   padding:20px;
   margin:auto;
   border-radius: 10px;
   background-color:black;
   ${mobile({width:"75%"})}
`;

const Title = styled.h1`
   font-size:24px;
   font-weight:300;
   color:white;
   margin-left:7px;
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


const SellerForgotPassword = () => {
   const [email , setEmail] = useState('');
   const [error , seterror] = useState('');
   console.log(email)
   const handleClick = async(e)=>{
      e.preventDefault();
      try {
         await fetch(
           'http://139.162.11.30:80/api/seller/forgetpassword', {method: 'POST',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify({
             email:email
           })})
           .then(response => {
             response.json()
               .then(data => {
                 alert(data)
               });
           })
       }
       catch (error) {
         console.error(error);
       }
   }
    return (
        <Container>
            <Wrapper>
                <Title>Enter your email</Title>
                <Form>
                    <Input type={"email"} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
                    {error !== '' ?
                    <li style={{color:"red" , marginTop:"-24px" , listStyle:"none" , fontSize:"13px" , marginLeft:"6px"}}>{error}</li>:""
                     }
                        <Button onClick={handleClick}>Send</Button>
                    {/* </Link> */}
         
                </Form>
            </Wrapper>
        </Container>
    )
}

export default SellerForgotPassword
