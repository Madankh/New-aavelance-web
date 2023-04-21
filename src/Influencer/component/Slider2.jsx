import styled from "styled-components"
// import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons"
import { sliderItems1 } from "./data"
import React, { useState } from "react";
import { mobile } from "../../responsive";
import Slide1 from "../../Assest/Electronic.png";
import { Link } from "react-router-dom";

const Container = styled.div`
width: 96%;
height: 46vh;
background-color: white;
color:black;
border-radius:20px;
margin:auto;
position:relative;
overflow:hidden;
   ${mobile({ display: "none" })};
`;


const Wrapper = styled.div`
 margin:120px 90px 0px; 
 height:100vh;
 transition: all 1.5s ease;
 display:flex;
`;

const Slide = styled.div`
  
  
`;


const InfoContainer = styled.div`
   marginButtom:10px
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

const Slider2 = () => {
    const [slideIndex, setslideIndex] = useState(0)

    return (
        <div style={{ display: 'flex' }}>
            <Container style={{
                backgroundImage: `url(${Slide1})`,
                backgroundSize: "100%", backgroundRepeat: "no-repeat", objectFit:'contain' 
            }}>
                <Wrapper slideIndex={slideIndex}>
                    {sliderItems1.map(item => (
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

export default Slider2
