import styled from "styled-components"
// import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons"
import { sliderItems3 } from "./data"
import React, { useState } from "react";
import { mobile } from "../../responsive";
import Slide1 from "../../Assest/beautyproduct.png";
import { Link } from "react-router-dom";

const Container = styled.div`
width: 100%;
height: 46vh;
background-color: white;
color:black;
margin:auto;
position:relative;
overflow:hidden;
   ${mobile({ display: "none" })};
`;


const Wrapper = styled.div`
 height:100vh;
 margin:135px 6px 0px; 
 transition: all 1.5s ease;
 
`;

const Slide = styled.div`
  
  
`;


const InfoContainer = styled.div`
  margin:100px
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

const Slider3 = () => {
    const [slideIndex, setslideIndex] = useState(0)
    return (
        <div style={{ display: 'flex' }}>
            <Container style={{
                backgroundImage: `url(${Slide1})`,
                backgroundSize: "100%", backgroundRepeat: "no-repeat", objectFit:'contain' 
            }}>
                <Wrapper slideIndex={slideIndex}>
                    {sliderItems3.map(item => (
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
           
        </div>
    )
}

export default Slider3
