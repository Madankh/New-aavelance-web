import React from 'react'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom'
import './product.css'

const options = {
  edit: false,
  activeColor: 'tomato',
  size: window.innerWidth < 600 ? 20 : 25
}

function Product({ propsitem }) {
  return (
    <>
       <div className="App">
        <div className="itemContainer">
          {/* {Products?.slice(0, 10).map((itemsss)=>( */}
          <div className="mainSlideCatContainer">
            <Link to={`/influencer/product/find/${propsitem._id}`} style={{textDecoration:"none"}}>
              <img src={`${propsitem.img}`} className="slidercatimage" alt="" />
              <p className="slidercatTilte">Lorem ipsum dolor sit, amet conse ctetur adipisicing elit.</p>
              <p className="slidercatprice">Price : {`${propsitem.price}`}</p>
              <div className="ratingcontainer">
                <ReactStars value={propsitem.ratings} {...options} isHalf={true} count={5} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
