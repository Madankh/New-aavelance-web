import { Link } from "react-router-dom";
import styled from "styled-components";
import { mobile } from '../../responsive';

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


const InfluencerForgotPassword = () => {


  
   
    return (
        <Container>
            <Wrapper>
                <Title>Enter your email</Title>
                <Form>
                    <Input type={"email"} placeholder="Email" /><br/>
                    <Link to={"/ResetPassword"}>
                        <Button>Send</Button>
                    </Link>
         
                </Form>
            </Wrapper>
        </Container>
    )
}

export default InfluencerForgotPassword
