import React, { useEffect, useState } from "react";
import Post from "../pages/PostContainer/Post"
import "./styles.css";

// import {popularProducts} from "../component/data";

import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import axios from "axios";

const options = {
  edit: false,
  activeColor: "tomato",
  size: window.innerWidth < 569 ? 17 : 18,
};

const breakPoints = [
  { width: 1, itemsToShow: 6 },
  //   { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  //   { width: 768, itemsToShow: 3 },
  //   { width: 1200, itemsToShow: 4 }
];


function Slidercategory4() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`http://192.168.18.4:5000/api/products/getallProduct?category=Beauty and Personal Care`)
        setProducts(res.data);
      } catch (error) {

      }
    }
    getProducts();
  }, [])


  const [Posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`http://192.168.18.4:5000/api/post/getallpost?category=Beauty and Personal Care`)
        setPosts(res.data);
      } catch (error) {

      }
    }
    getPosts();
  }, [])

  return (
    <div className="App">
      <div className="followitemContainer">
        {Products.slice(0,12)?.map((item) => (
          
          <div className="mainSlideCatContainerr">
            <a href={`/product/find/${item?._id}`} style={{textDecoration:"none"}}>
            {item?.img?.slice(0,1).map((items)=>( 
              <img src={items} className="slidercatimagee" alt="" />
              
            ))}
              <p className="slidercatTiltee">{item?.title?.slice(0,58)}</p>
              <p className="slidercatprice">Price : {`${item.price}`}</p>
              <div className="ratingcontainer">
                <ReactStars value={item.ratings} {...options} isHalf={true} count={5} />
              </div>
            </a>
          </div>
        ))}
      </div>

      {Posts.length !== 0 ?
     <div style={{backgroundColor:"black"}}>
      <h2 className="headertitleee">User Post</h2>
      <div className="HomefollowitemContainer">

        {Posts.map((item)=>(
          <Post post={item}/>
        ))}
             
      </div>
      </div>
    : ""}

    </div>
  );
}

export default Slidercategory4;
