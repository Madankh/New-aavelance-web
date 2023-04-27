import React, { useState } from 'react'
import "./post.css";
import { useEffect } from 'react';
import axios from 'axios';
import { publicRequest } from '../requestMethos';
export default function Post({detail}) {
  const productLink = detail?.ProductLinks[0]?.slice(35,90);
  const [product , setproduct] = useState('');
  
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products/find/` + productLink);
        setproduct(res.data);
      } catch (error) {

      }
    };
    getProduct()
  }, []);
 console.log(product)

  const [user , setuser] = useState([]);
  useEffect(() => {
    const getuser = async()=>{
      try {
        const res  = await axios.get(`http://api.aavelance.com/api/user/post/user/details/${detail.user}`)
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [])


  return (
    <div className='PostContainer'>
      <div className='SubPostContainer'>
        <div>
          <div style={{ display: 'flex', alignItems: "center" }}>
            <img src={`${user?.profile}`} className="PostImage" alt="" /> 
            
            <div>
              <p style={{ marginLeft: '5px', textAlign: "start" }}>{user?.username}</p>
              <p style={{ fontSize: "11px", textAlign: "start", marginLeft: 5, marginTop: -13, color: "#aaa" }}>Following by suman</p>
            </div>
          </div>
          <p style={{ textAlign: 'start', width: "96%", marginLeft: 20, marginTop: 0 }}>{detail?.title}</p>
          {detail?.image == "" ? <video src={`${detail?.video}`} className="PostImages" controls /> : 
          <img src={`${detail?.image}`} className="PostImages" alt="" />
          }

          {product !== null && product !== '' ? 
          <div className='productContainer'>
            {product?.img?.slice(0,1).map((item)=>(
              <img src={`${item}`} className="ProductImageForPost"  alt="" />
              ))}       
            <div style={{ marginLeft: "10px" }}>
              <p className='productTextforpost'>{product?.title?.slice(0,60)}</p>
              <p className='productTextdescforpost'>{product?.desc?.slice(0,70)}</p>
            </div>
           
            <a href={`/product/find/${productLink}`}>
              <button className='btnforpost' style={{ paddingLeft: "38px", paddingRight: "30px", border: "none", marginRight: "10px", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "white", color: "black", borderRadius: "10px", cursor: "pointer", marginBottom: "42px", fontWeight: "600" }}>Buy</button>
            </a>
            
          </div>
          :''
          }
       
          
        </div>
      </div>
    </div>
  )
}
