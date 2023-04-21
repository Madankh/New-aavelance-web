// import React,{useState} from 'react'
// // import styled from 'styled-components'
// // import Navbar from '../component/Navbar'
// // import Announcement from '../component/Announcement'
// // import { Footer } from "../component/Footer"
// import { Add, Remove } from '@material-ui/icons'
// import { mobile } from '../responsive'
// // import { useSelector } from 'react-redux';
// // import StripeCheckout from 'react-stripe-checkout'

// // const KEY = process.env.REACT_APP

// const Container = styled.div``;
// const Wrapper = styled.div`

// `;
// const Title = styled.h1`
//     font-weight:300;
//     text-align:center;
// `;
// const Top = styled.div`
//    display:flex;
//    align-items:center;
//    justify-content:space-between;
//    margin:20px;

// `;

// const TopButton = styled.button`
//    padding: 10px;
//    font-weight: 600;
//    cursor: pointer;
// //    border:${props => props.type === 'filled' && 'none'};
// //    background-color: ${(props) => props.type === 'filled' ? 'black' : 'transparent'};
// //    color: ${(props) => props.type === 'filled' && 'white'};
// `;
// const TopTexts = styled.div`
//     ${mobile({ display: "none" })}
//  `;

// const TopText = styled.span`
//    text-decoration: underline;
//    cursor:pointer;
//    margin: 0px 10px;
// `;

// const Bottom = styled.div`
//    display: flex;
//    justify-content: space-between;
//    margin:20px;
//    ${mobile({ flexDirection: "column" })}
// `;

// const Info = styled.div`
//    flex:3;
// `;
// const Summary = styled.div`
//    flex:1;
//    border:0.5px solid lightgray;
//    border-radius:10px;
//    padding: 20px;
//    height: 50vh
// `;
// const Hr = styled.hr`
//    background-color: #eee;
//    border:none;
//    height:2px
// `;

// const Product = styled.div`
//    margin:30px 0px;
//    display:flex;
//    justify-content:space-between;
//    ${mobile({ flexDirection: "column" })}
// `;
// const ProductDetail = styled.div`
//    flex:2;
//    display:flex;
// `;
// // const Image = styled.img`
// //     width:200px;
// //  `;
// const Details = styled.div`
//    padding:20px;
//    display: flex;
//    flex-direction : column;
//    justify-content: space-around;
//    ${mobile({ flexDirection: "column" })}
// `;
// const ProductName = styled.span`
//   margin:5px 0px;
// `;
// const ProductId = styled.span`

// `;
// const ProductColor = styled.div`
//    width:20px;
//    height:20px;
//    border-radius: 50%;
//    background-color:${props => props.color};
//    margin:5px;

// `;
// const ProductSize = styled.span`

// `;
// const PriceDetail = styled.span`
//     flex:1;
//     display:flex;
//     flex-direction:column;
//     align-items:center;
//     justify-content: center;
// `;

// const ProductAmountContainer = styled.div`
//    display:flex;
//    align-items:center;
//    margin-bottom:20px;
// `;
// const ProductAmount = styled.div`
//   font-size:24px;
//   margin:5px;
//   ${mobile({ margin: "5px 15px" })}
// `;
// const ProductPrice = styled.div`
//    font-size : 30px;
//    font-weight:200;
//    ${mobile({ marginBottom: "3px" })}
// `;

// const SummaryTitle = styled.h1`
//    font-weight:200;
// `;

// const SummaryItem = styled.div`
//    margin: 10px 0px;
//    display:flex;
//    justify-content: space-between;
//    font-weight: ${props => props.type === "total" && "500"};
//    font-size: ${props => props.type === "total" && "24px"};
// `;

// const SummaryItemText = styled.span``;

// const SummaryItemPrice = styled.span``

// // const Button = styled.button`
// //   width:100%;
// //   padding: 10px;
// //   background-color: black;
// //   color: white;
// //   font-weight: 200
// // `;


// const orders = () => {
//     // const cart = useSelector(state => state.cart);
//     // const [stripeToken , setStripeToken] = useState(null)

//     // const ontoken = (token)=> {
//     //     setStripeToken(token)
//     // }
//     return (
//         <Container>
//             {/* <Navbar />
//             <Announcement /> */}
//             <Wrapper>
//                 <Title>Your Bag</Title>
//                 <Top>
//                     <TopButton>Continue Shopping</TopButton>
//                     <TopTexts>
//                         <TopText>Shopping Bag(2)</TopText>
//                         <TopText>Your Wishlist(0)</TopText>
//                     </TopTexts>
//                     <TopButton type='filled'>CheckOut Now</TopButton>
//                 </Top>
//                 <Bottom>
//                     <Info>
//                         {/* {cart.products.map((product) => ( */}

//                             <Product>
//                                 <ProductDetail>
//                                     {/* <Image src={product.img} /> */}
//                                     <Details>
//                                         <ProductName><b>Product:</b>This is product Title</ProductName>
//                                         <ProductId><b>ID:</b>22222222654878</ProductId>
//                                         <ProductColor color='white' />
//                                         <ProductSize>
//                                             <b>Size:</b>875</ProductSize>
//                                     </Details>
//                                 </ProductDetail>
//                                 <PriceDetail>
//                                     <ProductAmountContainer>
//                                         <Add />
//                                         <ProductAmount>14</ProductAmount>
//                                         <Remove />
//                                     </ProductAmountContainer>
//                                     <ProductPrice>
//                                         547
//                                     </ProductPrice>
//                                 </PriceDetail>
//                             </Product>

//                         ))
//                         {/* } */}
//                         <Hr />
//                     </Info>
//                     <Summary>
//                         <SummaryTitle>ORDER SUMMARY</SummaryTitle>
//                         <SummaryItem>
//                             <SummaryItemText>Sub Total</SummaryItemText>
//                             <SummaryItemPrice>$787</SummaryItemPrice>
//                         </SummaryItem>
//                         <SummaryItem>
//                             <SummaryItemText>Estimated Shipping</SummaryItemText>
//                             <SummaryItemPrice>$ 5.01</SummaryItemPrice>
//                         </SummaryItem>
//                         <SummaryItem>
//                             <SummaryItemText>Shipping Discount</SummaryItemText>
//                             <SummaryItemPrice>$ - 4.90</SummaryItemPrice>
//                         </SummaryItem>
//                         <SummaryItem type="total">
//                             <SummaryItemText >Total</SummaryItemText>
//                             <SummaryItemPrice>$777</SummaryItemPrice>
//                         </SummaryItem>
                        

//                     </Summary>
//                 </Bottom>
//             </Wrapper>
//             {/* <Footer /> */}
//         </Container>
//     )
// }

// export default orders
