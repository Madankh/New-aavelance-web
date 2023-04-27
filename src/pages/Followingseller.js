import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import ReactStars from "react-rating-stars-component";
import axios from "axios";
import { useSelector } from "react-redux";

const options = {
  edit: false,
  activeColor: "tomato",
  size: window.innerWidth < 569 ? 17 : 18,
};


function Followingseller() {
  let users = useSelector(state => state.user)
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`http://api.aavelance.com/api/seller/flwpdu/${users?.currentUser?.others?._id}`);
        setProducts(res.data);
      } catch (error) {

      }
    }
    getProducts();
  }, [])

  return (
    <div className="App">
      <h2 className = "Followingtitle" >Following shop products</h2>
      <div className="followitemContainer">
        {Products?.map((itemsss) => (
          itemsss.slice(0, 12).map((item)=>(
          <div className="mainSlideCatContainerr">
            <a href={`/product/find/${item?._id}`} style={{ textDecoration: "none" }}>
            {item?.img?.slice(0,1).map((items)=>( 
              <img src={items} className="slidercatimagee" alt="" />
              
            ))}
              <p className="slidercatTiltee">{`${item?.title?.slice(0,60)}`}</p>
              <p className="slidercatprice">Price : {`${item.price}`}</p>
              <div className="ratingcontainer">
                <ReactStars value={item.ratings} {...options} isHalf={true} count={5} />
              </div>
            </a>
          </div>
          ))
        ))}
      </div>

    </div>
  );
}

export default Followingseller;
