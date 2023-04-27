 import { useState} from "react";
import styled from "styled-components";
import { mobile } from '../../responsive';
import { useLocation } from 'react-router-dom';

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

const Title = styled.p`
   font-size:9px;
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
const Link = styled.a`
  margin:5px 0px;
  text-decoration:none;
  cursor:pointer;
  color:white
`;

const ResetPassword = () => {
   const location = useLocation();
   const code = location.search.split("?")[1];
   const [password , setPassword] = useState('');
   const handlechange = async(e)=>{
      e.preventDefault();
      try {
         await fetch(
           `http://api.aavelance.com/api/auth/reset/password?${code}`, {method: 'PUT',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify({
             password:password
           })})
           .then(response => {
             response.json()
               .then(data => {
                  console.log(data)
               //   if(data.success === true){
                  alert("Password Reset successfuly")
               //   }else{
   
               //   }
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
                <Form>
                    <p style={{color:"white"}}>New password</p>
                    <Input type={"password"} onChange={(e)=>setPassword(e.target.value)} placeholder="New Password" /><br/>
                    <Button onClick={handlechange}>Send</Button>
         
                </Form>
            </Wrapper>
        </Container>
    )
}

export default ResetPassword
