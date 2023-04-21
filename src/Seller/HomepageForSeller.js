import React, { useEffect, useState , useSelector } from 'react'
import FeaturedInfo from './featuredinfo/FeaturedInfo'
import "./home.css"
import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar'
import axios from 'axios'

export default function HomepageForSeller() {
    
    return (
        <div className='home'>
            <Topbar/>
            <div className='submain'>
                  <Sidebar />
                <div className='part2'>
                    <FeaturedInfo />
                </div>
            </div>
        </div>
    )
}
