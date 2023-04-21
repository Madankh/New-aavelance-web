import { sliderItems1 } from "./data"
import React, { useState } from "react";
import Slide1 from "../Assest/Electronic.png";
import "./slider2.css"

const Slider2 = () => {
    const [slideIndex, setslideIndex] = useState(0)

    return (
        <div style={{ display: 'flex' }}>
            <div className="slider2Container">
                 <div className="slider2Wrapper" slideIndex={slideIndex}>
                    {sliderItems1.map(item => (
                        <div bg={item.bg} key={item.id}>

                            <div className="slider2InfoContainer">
                                <div className="slider2Title">{item.title}</div>
                                <div className="slider2Desc">{item.desc}</div>
                                <button className="slider2Buttom">Shop now</button>
                            </div>
                        </div >

                    ))}

                </div>

            </div>
           
        </div>
    )
}

export default Slider2
