import React from 'react'
import styled from 'styled-components'
import Navbar from '../component/Navbar'
import Announcement from '../component/Announcement'
import { Footer } from "../component/Footer"
import { useSelector , useDispatch } from 'react-redux';

import { Link } from 'react-router-dom'
import { removeProduct } from './redux/cartRedux'
import "./cart.css"
const KEY = process.env.REACT_APP

const Container = styled.div``;
const Wrapper = styled.div`

`;


const ProductColor = styled.div`
   width:20px;
   height:20px;
   border-radius: 50%;
   background-color:${props => props.color};
   margin:5px 10px 10px;

`;



const Cart = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    let user = useSelector(state => state.user);

    const handleRemove = (id)=>{
        console.log(id);
        dispatch(removeProduct(id));
    }

    return (
        <Container>
            <Navbar />
            <Announcement />
            <Wrapper>
                <h1 className='cartTitle'>Your Bag</h1>
                <div className='cartTop'>
                    <button className='cartTopButton'>Continue Shopping</button>
                </div>
                <div className='cartBottom'>
                    <div className='cartInfo'>
                        
                        {cart.products.map((product) => (

                            <div className='cartProduct'>
                                <div className='cartProductDetail'>
                                    {product?.img?.slice(0,1).map((item)=>(
                                        <img className='cartImage' src={item} />
                                    ))}
                                    <div className='cartDetails'>
                                        <span className='cartProductName'><p className='cartproductTitle'><b>Product : </b>{product.title.slice(0 , 80)}</p></span>
                                        <span className='cartProductId'><p className='cartproductTitle'><b>ID : </b>{product._id}</p></span>
                                        <span className='cartProductId'><p className='cartproductTitle'><b>Price : </b>{product.price}</p></span>
                                        <span className='cartProductId'><p className='cartproductTitle'><b>Ratings : </b>{product.ratings}</p></span>
                                        <div style={{display:"flex" , alignItems:"center" , marginTop:"-15px"}}>
                                            <p>Color</p>
                                            <ProductColor color={product.color ? product.color :'' } />
                                        </div>
                                        {/* {product.color?.map((item)=>(
                                        ))} */}
                                        <span className='cartProductSize'><p className='cartproductTitle'><b>Size : </b>{product.size ? product.size:'' }</p></span>
                                        <span className='cartProductId'><p className='cartproductTitle'><b>Quantity : </b>{product?.quantity}</p></span>
                                        <span className='cartProductId'><p className='cartproductTitle'><b>Total cost : </b>{product.price * product.quantity}</p></span>
                                    </div>
                                </div>
                                <span className='cartPriceDetail'>
                                   
                                </span>
                            </div>

                        ))
                        }
                        <hr className='cartHr' />
                    </div>
                    <div className='cartSummary'>
                        <h1 className='cartSummaryTitle'>ORDER SUMMARY</h1>
                        <div className='cartSummaryItem'>
                            <span className='cartSummaryItemText'>Sub Total</span>
                            <span className='cartSummaryItemPrice'>NPR {cart.total}</span>
                        </div>
                        <div className='cartSummaryItem'>
                            <span className='cartSummaryItemText'>Estimated Shipping</span>
                            <span className='cartSummaryItemText'>NPR 60</span>
                        </div>
                        <div className='cartSummaryItem' type="total">
                            <span className='cartSummaryItemText' >Total</span>
                            <span className='cartSummaryItemText'>NPR {cart.total + 60}</span>
                        </div>
                       
                        {user.currentUser !== null ? 
                        <Link to='/shippingInfo'>
                            <button className='cartButtoncart'>CHECKOUT NOW</button>
                        </Link>: <Link to='/login'>
                            <button className='cartButtoncart'>CHECKOUT NOW</button>
                        </Link>
                        
                    }

                    </div>
                </div>
            </Wrapper>
            <Footer />
        </Container>
    )
}

export default Cart
