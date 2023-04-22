import { Facebook, Instagram, Mail, Phone, Room, Twitter, YouTube } from '@material-ui/icons';
import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { mobile } from '../responsive';
import "./footer.css"

const Container = styled.div`
  display:flex;

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






// const Payment = styled.img`
//    width:50%;
//    borderRadius:1px;
// `;


export const Footer = () => {
    return (
        <div className='footerContainer'>
            <div className='Left'>
                <h1 className='logo'>Aavelance.</h1>
                <div className='Description'>
                Aavelance enables users to "Buy with community" as it allows people to buy products directly from other users, who are members of the Aavelance community. This creates a sense of community around the platform, where people can discover new products and connect with others who share their interests. By enabling people to buy products from within the community, Aavelance makes shopping a more social experience, and helps to build a stronger sense of engagement and loyalty among its users
                </div>
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
            </div>
            <div className='Center'>
              <h3 className='title'>Userful Links</h3>
              <ul className='list'>
                <li className='listItem'>
                  <a href={"/seller/login"}  style={{textDecoration:"none" , color:'black'}}>Seller Program</a>
                </li>
                <li className='listItem'><a href={"/login"} style={{textDecoration:"none" , color:'black'}}>Login</a></li>
                
                {/* <li className='listItem' ><Link to={"/suppliers/register"}  style={{textDecoration:"none" , color:'black'}}>Become a Supplier</Link></li> */}
                <li className='listItem' >Terms</li>
              </ul>
            </div>
            <div className='right'>
              <h3 className='title'>Contact</h3>
              <div className='ContactItem'>< Room style={{marginRight:"10px"}}/>Mahankal Nepal</div>
              <div className='ContactItem'><Phone style={{marginRight:"10px"}}/> 9861239422</div>
              <div className='ContactItem'> <Mail style={{marginRight:"10px"}}/>Contact@aavelance.com</div>
              {/* <Payment src="https://i.ibb.co/Qfvn4z6/payment.png"></Payment> */}
            </div>
        </div>
    )
}
