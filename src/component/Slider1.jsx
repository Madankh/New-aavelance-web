// import styled from "styled-components"
// // import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons"
// import { sliderItems2 } from "./data"
// import React, { useState } from "react";
// import { mobile } from "../responsive";
// import Slide1 from "../Assest/sliderFashion.png";
// import {Link} from 'react-router-dom';

// const Container = styled.div`
//    width: 93%;
//    height: 41vh;
//    background-color: white;
//    color:black;
//    border-radius:20px;
//    margin:auto;
//    position:relative;
//    overflow:hidden;
//    ${mobile({ display: "none" })};
// `;


// const Wrapper = styled.div`
// //  width:50%;
//  margin:110px -6px 0px; 
//  height:100vh;
//  transition: all 1.5s ease;
//  display:flex;
//  transform:translateX(${props => props.slideIndex * -220}vh)
// `;

// const Slide = styled.div`
  
  
// `;


// const InfoContainer = styled.div`
//    flex:1;
//    margin-left:530px;
// `;
// const Title = styled.h1`
//     font-size:30px;
//     margin:0px 0px;
// `;
// const Desc = styled.p`
//    font-size:14px;
//    font-weight:300;
//    margin-left:-10px
// `
// const Button = styled.button`
//    font-size:15px;
//    background-color: black;
//    border-radius:10px;
//    color:white;
//    padding:5px 20px;
//    border:none;
//    cursor: pointer;
//    margin-left:100px
// `;

// const Slider1 = () => {
//     const [slideIndex, setslideIndex] = useState(0)

//     return (
        
//             <Container style={{
//                 backgroundImage: `url(${Slide1})`,
//                 backgroundSize: "106%", backgroundColor: 'white', backgroundRepeat: "no-repeat", backgroundPosition: '0px -190px', objectFit: 'contain' , 
//             }}>

//                 <Wrapper slideIndex={slideIndex}>
//                     {sliderItems2.map((item) => (
//                     <Link to="/Products/fashion">
//                         <Slide bg={item.bg} key={item.id}>
//                             <InfoContainer>
//                                 <Title>{item.title}</Title>
//                                 <Desc>{item.desc}</Desc>
//                                 <Button>Shop now</Button>
//                             </InfoContainer>
                            
//                         </Slide >
//                      </Link>
//                     ))}

//                 </Wrapper>

//             </Container>
        
//     )
// }

// export default Slider1
