import React, { useEffect, useState } from "react";
import Post from "../pages/PostContainer/Post"
import "./styles.css";
import ReactStars from "react-rating-stars-component";
import axios from "axios";

const options = {
  edit: false,
  activeColor: "tomato",
  size: window.innerWidth < 569 ? 17 : 18,
};


function Slidercategory3() {
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`http://139.162.11.30:80/api/products/getallProduct?category=Kid's Fashion`)
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
        const res = await axios.get(`http://139.162.11.30:80/api/post/getallpost?category=Kid's Fashion`)
        setPosts(res.data);
      } catch (error) {

      }
    }
    getPosts();
  }, [])



  return (
    <div className="App">
      <h3 className="headertitle">Kid's Fashion</h3>
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

export default Slidercategory3;
