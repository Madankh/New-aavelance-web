import React, { useEffect } from 'react';
import Announcement from '../component/Announcement';
import Navbar from '../component/Navbar';
import Slider from "../component/Slider";
import Products from '../component/Products';
import { Newsletter } from '../component/Newsletter';
import { Footer } from '../component/Footer';
import "../pages/home.css"
import MainCategories from '../component/MainCategories';
import Product from '../component/Product';
import Slidercategory from './Slidercategory';
import Slidercategory2 from './Slidercategory2';
import Slidercategory3 from './Slidercategory3';
import Slidercategory4 from './Slidercategory4';
import axios from 'axios';
import Slider1 from '../component/Slider1';
import { Link } from 'react-router-dom';
import Slider2 from '../component/Slider2';
import Slider3 from '../component/Slider3'
import Followingseller from './InfluencerFollowingseller';
import { useSelector } from 'react-redux';

const Home = ({socket}) => {
    let users = useSelector(state => state.user)
    let user = users.currentUser;

    let isTrue = users?.currentUser?.other?.following == '';

    useEffect(() => [
        productsfetch()
    ], [])

    const productsfetch = async () => {
        const response = await axios.get('http://172.232.73.46:80/api/products/getallProduct');
    }
    return (
        <div className='mainHome'>
            <Navbar socket={socket}/>
            <Announcement />
            <div style={{ backgroundColor: 'black' }}>
                <Slider />
                <MainCategories />
            </div>
                {isTrue == true || user == null ? ''
                :<div>
                <Followingseller />
            </div>
            }
            <div>
                <Slidercategory />
            </div>
            <div>
                <div style={{   paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'black' }}>
                    <Link to="/Products/fashion" style={{ textDecoration: 'none' }}>
                        <Slider2 />
                    </Link>
                </div>
                <div style={{ backgroundColor: "white"  , paddingTop:'40px' , margin:'30px'  }}>
                    <Slidercategory2 />
                </div>
            </div>
          <div>
               <div style={{ backgroundColor: 'white' , marginTop:'20px' , margin:'30px' }}>
                <Slidercategory3 />
               </div>
          </div> 
          <div>
               <div style={{   paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'white' }}>
                    <Link to="/Products/fashion" style={{ textDecoration: 'none' }}>
                        <Slider3 />
                    </Link>
                </div>
               <div style={{ backgroundColor: 'white' , marginTop:'15px' }}>
                <Slidercategory4 />
               </div>
          </div>
          
            <div style={{ backgroundColor: 'white' }}>
                <Newsletter />
                <Footer />
            </div>
        </div>
    )
}

export default Home
