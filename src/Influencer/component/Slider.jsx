import styled from "styled-components"
// import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons"
import {sliderItems} from "./data"
import React,{useState} from "react";
import { mobile } from "../responsive";
import Slide1 from "../Assest/slider1.png";
import { Link } from "react-router-dom";

const Container = styled.div`
   width: 93%;
   height: 60vh;
   background-color: white;
   color:black;
   border-radius:20px;
   margin:auto;
   position:relative;
   overflow:hidden;
   ${mobile({display:"none"})};
`;

// const Arrow = styled.div`
//    width: 50px;
//    height:50px;
//    background-color: #fff7f7;
//    border-radius: 50%;
//    display: flex;
//    align-items: center;
//    justify-content: center;
//    position:absolute;
//    top:0;
//    bottom:0;
//    left:${props => props.direction === "left" && "10px"};
//    right:${props => props.direction === "right" && "10px"};
//    cursor:pointer;
//    margin:auto;
//    opacity:0.5;
// `;

const Wrapper = styled.div`
 width:40%;
 margin:150px 50px 0px; 
 height:100vh;
 transition: all 1.5s ease;
 display:flex;
 transform:translateX(${props=>props.slideIndex *-220}vh)
`;

const Slide = styled.div`
  
  
`;


const InfoContainer = styled.div`
   flex:1;
`;
const Title = styled.h1`
    font-size:30px;
    margin:0px 0px;
`;
const Desc = styled.p`
   font-size:14px;
   font-weight:300;
`
const Button = styled.button`
   font-size:15px;
   background-color: black;
   border-radius:10px;
   color:white;
   padding:5px 20px;
   border:none;
   cursor: pointer;
`;

const Slider = () => {
    const [slideIndex, setslideIndex] = useState(0)
  
    return (
        <Link to="Products/ComputersAccessories" style={{ textDecoration: 'none' }}>
        <Container style={{backgroundImage:`url(${Slide1})` , 
        backgroundSize: "100%",   backgroundRepeat: "no-repeat",backgroundPosition: "center"}}>
           
            <Wrapper slideIndex={slideIndex}>
                {sliderItems.map(item=>(
                    <Slide bg={item.bg} key={item.id}>
                  
                    <InfoContainer>
                        <Title>{item.title}</Title>
                        <Desc>{item.desc}</Desc>
                        <Button>Shop now</Button>
                    </InfoContainer>
                </Slide >

))}
            
            </Wrapper>
          
        </Container>
</Link>
    )
}

export default Slider
