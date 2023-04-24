import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
import Carousel from "react-elastic-carousel";
// import Item from "./item";
// import Product from "./InfluencerProduct";
import "./styles.css";

// import {popularProducts} from "../component/data";

import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import axios from "axios";

const options = {
  edit: false,
  activeColor: "tomato",
  size: window.innerWidth < 600 ? 20 : 25,
};

// const breakPoints = [
//   { width: 1, itemsToShow: 6 },
//   //   { width: 550, itemsToShow: 2, itemsToScroll: 2 },
//   //   { width: 768, itemsToShow: 3 },
//   //   { width: 1200, itemsToShow: 4 }
// ];



function Slidercategory3() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async ()=>{
        try {
            const res = await axios.get(`http://139.162.11.30:80/api/products/getallProduct?subcategories=Shoes`)
            setProducts(res.data);
          } catch (error) {
              
          }
      }
      getProducts();
      console.log(Products)

  }, [])

  return (
    <div className="App">
    <div className="itemContainer">
      {Products?.slice(0, 10).map((itemsss) => (
        <div className="mainSlideCatContainer">
          <Link to={`/influencer/product/find/${itemsss?._id}`} style={{textDecoration:"none"}}>
            <img src={`${itemsss.img}`} className="slidercatimage" alt="" />
            <p className="slidercatTilte">{itemsss?.title.slice(0,100)}</p>
            <p className="slidercatprice">Price : {`${itemsss.price}`}</p>
            <div className="ratingcontainer">
              <ReactStars value={itemsss.ratings} {...options} isHalf={true} count={5} />
            </div>
          </Link>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Slidercategory3;
