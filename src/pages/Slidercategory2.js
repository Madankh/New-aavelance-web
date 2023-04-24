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



function Slidercategory2() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async ()=>{
        try {
            const res = await axios.get(`http://139.162.11.30:80/api/products/getallProduct?category=Men's Fashion`)
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
        const res = await axios.get(`http://139.162.11.30:80/api/post/getallpost?category=Men's Fashion`)
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
            {/* <Link to={`/product/find/${item?._id}`} style={{ textDecoration: "none" }}> */}
            <a href={`/product/find/${item?._id}`} style={{textDecoration:"none"}}>
            {item?.img?.slice(0,1).map((items)=>( 
              <img src={items} className="slidercatimagee" alt="" />
              
              ))}
              </a>
              <p className="slidercatTiltee">{item?.title?.slice(0,58)}</p>
              <p className="slidercatprice">Price : {`${item.price}`}</p>
              <div className="ratingcontainer">
                <ReactStars key={item?._id} value={item.ratings} {...options} isHalf={true} count={5} />
              </div>
            {/* </Link> */}
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

export default Slidercategory2;
