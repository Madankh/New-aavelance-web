import React, { useEffect } from 'react';
import "./influencerhome.css";
import Announcement from '../../component/Announcement';
import InfluencerNavbar from '../component/InfluencerNavbar'
import axios from 'axios';
import Slider from "../../component/Slider";
import { Newsletter } from '../../component/Newsletter';
import { Footer } from '../../component/Footer';
import MainCategories from '../component/MainCategories';
import Slidercategory from '../Influencerpages/Slidercategory';
import Slidercategory2 from '../Influencerpages/Slidercategory2';
import Slidercategory3 from '../Influencerpages/Slidercategory3';
import Slidercategory4 from '../Influencerpages/Slidercategory4';
import { Link } from 'react-router-dom';
import Slider2 from '../../component/Slider2';
import Slider3 from '../component/Slider3'
import Followingseller from '../../Influencer/Influencerpages/Followingseller';
import { useSelector } from 'react-redux';

const InfluencerHome = ({socket}) => {
    let influencer = useSelector(state => state.influencer)

    let isTrue = influencer?.currentInfluencer?.others?.following == '';

    useEffect(() => [
        productsfetch()
    ], [])

    const productsfetch = async () => {
        const response = await axios.get('http://139.162.11.30:80/api/products/getallProduct');
    }
    return (
        <div className='mainHome'>
            <InfluencerNavbar/>
            <Announcement />
            <div style={{ backgroundColor: 'black' }}>
                <Slider />
                <MainCategories />
            </div>

            {isTrue == true || influencer == null ? ''
                :<div>
                <Followingseller />
                </div>}
               
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
                <Footer/>
            </div>
        </div>
    )
}

export default InfluencerHome
