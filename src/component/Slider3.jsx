import { sliderItems3 } from "./data"
import React, { useState } from "react";
import "./slider3.css"

const Slider3 = () => {
    const [slideIndex, setslideIndex] = useState(0)

    return (
        <div style={{ display: 'flex' }}>
            <div className="slider3Container">
                 <div className="slider3Wrapper" slideIndex={slideIndex}>
                    {sliderItems3.map(item => (
                        <div bg={item.bg} key={item.id}>

                            <div className="slider3InfoContainer">
                                <div className="slider3Title">{item.title}</div>
                                <div className="slider3Desc">{item.desc}</div>
                                <button className="slider3Buttom">Shop now</button>
                            </div>
                        </div >

                    ))}

                </div>

            </div>
           
        </div>
    )
}

export default Slider3
