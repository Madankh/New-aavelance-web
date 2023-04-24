import React from 'react';
import FeaturedInfo from '../../featuredinfo/FeaturedInfo';
import "./home.css";
import Navbar from '../../../component/Navbar';

export default function HomepageForInfluencer() {

    return (
        <div className='home'>
            <Navbar/>
            <div className='submain'>
                <div className='part2'>
                    <FeaturedInfo/>
                </div>
            </div>
        </div>
    )
}
