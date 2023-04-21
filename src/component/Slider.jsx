import {sliderItems} from "./data"
import React,{useState} from "react";
import { Link } from "react-router-dom";
import "./slider.css"

const Slider = () => {
    const [slideIndex, setslideIndex] = useState(0)
  
    return (
        <div className="SliderContainer" >
            <div className="Wrapper" slideIndex={slideIndex}>
                {sliderItems.map(item=>(
                    <div bg={item.bg} key={item.id}>
                  
                    <div className="InfoContainer">
                        <h1 className="SliderTitle">{item.title}</h1>
                        <p className="SliderDesc">{item.desc}</p>
                        <a href="Products/Fashion Product" style={{ textDecoration: 'none' }}>
                        <button className="Buttonslider">Shop now</button>
                       </a>
                    </div>
                </div >

))}
            
            </div>
          
        </div>
        )
}

export default Slider
