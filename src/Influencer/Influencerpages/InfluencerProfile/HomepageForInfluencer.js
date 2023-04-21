import React from 'react';
import FeaturedInfo from '../../featuredinfo/FeaturedInfo';
import Chart from "../../components/chart/Chart";
import "./home.css";
import Sidebar from '../../components/sidebar/Sidebar';
import { useSelector } from 'react-redux';
import Navbar from '../../../component/Navbar';

export default function HomepageForInfluencer() {
    let userDetails = useSelector(state => state.user)

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
