import React from 'react'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom'
import '../pages/styles.css'

const options = {
  edit: false,
  activeColor: 'tomato',
  size: window.innerWidth < 500 ? 10 : 20
}

function Product({ propsitem }) {
  return (
    <>
      <div className="App">
        <div className="itemContainer">
          {/* {Products?.slice(0, 10).map((itemsss)=>( */}
          <div className="mainSlideCatContainer">
            <a href={`/product/find/${propsitem?._id}`} style={{textDecoration:"none"}}>
            {propsitem?.img?.slice(0,1).map((item)=>( 
              <img src={item} className="slidercatimage" alt="" />
            ))}
              <p className="slidercatTilte">{propsitem?.title?.slice(0,60)}...</p>
              <p className="slidercatprice">Price : {`${propsitem?.price}`}</p>
              <div className="ratingcontainer">
                <ReactStars value={propsitem?.ratings} {...options} isHalf={true} count={5} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
