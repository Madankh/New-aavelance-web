import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import "./styles.css";
import ReactStars from "react-rating-stars-component";
import Slider1 from "../component/Slider1";
import axios from "axios";
import { useSelector } from "react-redux";

const options = {
  edit: false,
  activeColor: "tomato",
  size: window.innerWidth < 600 ? 20 : 25,
  // value: 4.7,
};

const breakPoints = [
  { width: 1, itemsToShow: 6 },
];


function Followingseller() {
  let influencer = useSelector(state => state.influencer)
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async ()=>{
        try {
            const res = await axios.get(`https://api.aavelance.com/api/seller/influencer/flwpdu/${influencer?.currentInfluencer?.other?._id}`)
            setProducts(res.data);
          } catch (error) {
              
          }
      }
      getProducts();
      
    }, [])

console.log(Products)
    let insideProduct = Products.map((item)=>{
      console.log(item);
    })

  return (
    <div className="App">
      <div className="carousel-wrapper" >
        <h2 style={{color:'white' , marginRight:'80%' , backgroundColor:'black'}}>Following shop products</h2>
        <Carousel breakPoints={breakPoints}>
          {Products.map((itemsss)=>(
            itemsss.map((item)=>(
              <Link to={`/influencer/Product/find/${item?._id}`}>
             
              <div className="productCard" style={{ flex: 2, alignItems: "center", width: "30px", backgroundColor: "white"}} key={item?.id}>
                <div>
                  <img src={item?.img}alt=""style={{ width: "10vmax", height: "12vmax", objectFit: "contain" , borderRadius:'1px'}}/>
                </div>
                <p style={{ fontSize: "14px", fontWeight: "500", width: "200px", marginBottom: "-12px"  , textDecoration: 'none'}}>{item?.title?.slice(0 , 50)}....</p>
                <p style={{ fontWeight: "600", width: "200px", marginBottom: "-12px" }}>NPR {item?.price}</p>
                <span style={{ fontWeight: "600", width: "200px", marginBottom: "-12px" , marginLeft:'60px'}}>
                  <ReactStars value={item.ratings} {...options} isHalf={true} count={5} />
                </span>
              </div>
              </Link>
              
            ))
          )
          )}
        </Carousel>
      </div>
       </div>
      );
    }
    
    export default Followingseller;
