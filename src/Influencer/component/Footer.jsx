import { Facebook, Instagram, Mail, Phone, Room, Twitter, YouTube } from '@material-ui/icons';
import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { mobile } from '../../responsive';


const Container = styled.div`
  display:flex;
  background-color:'black'
  ${mobile({flexDirection:"column"})}

`;
const Left = styled.div`
  flex:1;
  display:flex;
  flex-direction:column;
  margin:10px
`;

const Logo = styled.h1`
  color:black
`;
const Description = styled.p`
   margin:20px 0px;
   color:black
`;
const SocialContainer = styled.div`
  display:flex;  
`;
const SocialIcon = styled.div`
   width:40px;
   height:40px;
   border-radius:50%;
   color:black;
   background-color:#${props=>props.color};
   display:flex;
   align-items:center;
   justify-content:center;
   margin:3px
`;

const Center = styled.div`
  flex:1;
  padding:10px;

`;

const Title = styled.h3`
   margin-bottom:30px;
   color:black
`;

const List = styled.ul`
  margin:0;
  padding:0;
  display:flex;
  flex-wrap:wrap;
  list-style:none;
`;
const ListItem = styled.li`
  width:50%;
  margin-bottom:10px;
  color:black;
  cursor:pointer
`

const Right = styled.div`
  flex:1;
  padding:10px;
  ${mobile({backgroundColor:"#eee"})}
  
`;
const ContactItem = styled.div`
   margin-bottom:20px;
   aling-items:center;
   display:flex;
   color:black
`;

// const Payment = styled.img`
//    width:50%;
//    borderRadius:1px;
// `;


export const Footer = () => {
    return (
        <Container>
            <Left>
                <Logo>Ecom.</Logo>
                <Description>
                    There are many variation of passages of lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, ducimus sed earum non architecto numquam modi corporis sapiente, recusandae vitae nostrum illum omnis adipisci facilis. Harum dolore quisquam quae at.
                </Description>
                <SocialContainer>
                    <SocialIcon color="3B5999" >
                        <Facebook/>
                    </SocialIcon >
                    <SocialIcon color='E4405F'>
                        <Instagram/>
                    </SocialIcon>
                    <SocialIcon color='55ACEE'>
                        <Twitter/>
                    </SocialIcon>
                    <SocialIcon color='E60023'>
                        <YouTube/>
                    </SocialIcon>

                </SocialContainer>
            </Left>
            <Center>
              <Title>Userful Links</Title>
              <List>
                <ListItem>
                  <Link to={"/seller/login"}  style={{textDecoration:"none" , color:'black'}}>Become a seller</Link>
                </ListItem>
                <ListItem><Link to={"/influencer/login"} style={{textDecoration:"none" , color:'black'}}>Become a influencer</Link></ListItem>
                
                  <ListItem><Link to={"/suppliers/register"}  style={{textDecoration:"none" , color:'black'}}>Become a Supplier</Link></ListItem>
                <ListItem>Partner program</ListItem>
                <ListItem>Terms</ListItem>
                <ListItem>Cart</ListItem>
              </List>
            </Center>
            <Right>
              <Title>Contact</Title>
              <ContactItem>< Room style={{marginRight:"10px"}}/>Mahankal Nepal</ContactItem>
              <ContactItem><Phone style={{marginRight:"10px"}}/> +9779803153753</ContactItem>
              <ContactItem> <Mail style={{marginRight:"10px"}}/>Khadkasuman0000@gmail.com</ContactItem>
              {/* <Payment src="https://i.ibb.co/Qfvn4z6/payment.png"></Payment> */}
            </Right>
        </Container>
    )
}
