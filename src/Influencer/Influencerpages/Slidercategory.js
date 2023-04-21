import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import "./styles.css";
import ReactStars from "react-rating-stars-component";
import Slider1 from "../component/Slider1";
import axios from "axios";

const options = {
  edit: false,
  activeColor: "tomato",
  size: window.innerWidth < 600 ? 20 : 25
};

// const breakPoints = [
//   { width: 2, itemsToShow: 6 },
// ];



function Slidercategory() {
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async ()=>{
        try {
            const res = await axios.get(`http://localhost:5000/api/products/getallProduct?category=Clothing`)
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
      <h2 className="headertitle">Fashion Products</h2>
      {Products?.slice(0, 10).map((itemsss) => (
        <div className="mainSlideCatContainer">
          <Link to={`influencer/product/find/${itemsss?._id}`} style={{textDecoration:"none"}}>
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
    
    export default Slidercategory;
