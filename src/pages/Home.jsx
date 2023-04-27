import React, { useEffect } from 'react';
import Announcement from '../component/Announcement';
import Navbar from '../component/Navbar';
import Slider from "../component/Slider";
import { Newsletter } from '../component/Newsletter';
import { Footer } from '../component/Footer';
import "../pages/home.css"
import MainCategories from '../component/MainCategories';
import Slidercategory from './Slidercategory';
import Slidercategory2 from './Slidercategory2';
import Slidercategory3 from './Slidercategory3';
import Slidercategory4 from './Slidercategory4';
import axios from 'axios';
import Slider2 from '../component/Slider2';
import Slider3 from '../component/Slider3'
import Followingseller from './Followingseller';
import { useSelector } from 'react-redux';
import LiveAnnouncement from "../component/LiveAnnouncement";
import { useState } from 'react';

const Home = ({socket}) => {
    let users = useSelector(state => state.user)
    let user = users?.currentUser;
    const accessToken = user?.accessToken
    useEffect(() => [
        productsfetch()
    ], [])
    const [details , setdetails]=useState('');

    const productsfetch = async () => {
        const response = await axios.get(`http://api.aavelance.com/api/user/own/${user?.others?._id}` , {headers:{token:accessToken}});
        setdetails(response?.data)
    }
    let isTrue = details?.following == '';
    
    return (
        <div className='mainHome'>
            <Navbar/>
            <Announcement />
            <LiveAnnouncement/>
            <div style={{ backgroundColor: 'black', padding:"7px"  }}>
                <Slider/>
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
                    <a href="/Products/fashion" style={{ textDecoration: 'none' }}>
                        <Slider2 />
                    </a>
                </div>
                <Slidercategory2 />
            </div>
          <div> 
            <Slidercategory3 />
          </div> 
          <div>
               <div style={{   paddingTop: '20px', paddingBottom: '20px', backgroundColor: 'white' }}>
                    <a href="/Products/fashion" style={{ textDecoration: 'none' }}>
                        <Slider3 />
                    </a>
                </div>
                <Slidercategory4 />
          </div>
          
            <div style={{ backgroundColor: 'white' }}>
                <Newsletter />
                <Footer />
            </div>
        </div>
    )
}

export default Home
