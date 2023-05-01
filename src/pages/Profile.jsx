import Sidebar from "../Seller/components/sidebar/Sidebar"
import Topbar from "../Seller/components/topbar/Topbar"
import "./profile.css"
import ReactStars from "react-rating-stars-component";
import { useSelector } from 'react-redux';
import Navbar from '../component/Navbar'
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const options = {
    edit: false,
    activeColor: "tomato",
    size: window.innerWidth < 550 ? 16 : 20,
    value: 4.7,
  };

let Userid = '';
export default function Profile() {
    const admin = useSelector((state) => state.seller);
    let seller = admin?.currentSeller;
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    
    let users = useSelector(state => state.user);
    if(users){
        Userid = users?.currentUser?.others?._id;
    }
    const accessToken = users?.currentUser?.accessToken;
    const [userDetails , setuserDetails] = useState('');
    const [sellershop , setsellershop] = useState('');
    useEffect(() => {
        const getuserDetails = async ()=>{
            try {
                const res = await axios.get(`https://api.aavelance.com/api/user/own/${Userid}` , {headers:{token:accessToken}})
                setuserDetails(res.data);
                console.log(userDetails)
              } catch (error) {
              }
          }
          getuserDetails();
        },[])
        useEffect(() => {
            const getSeller = async () => {
              try {
                const res = await axios.get(`https://api.aavelance.com/api/seller/seller/` + id);
                setsellershop(res.data);
                console.log(res.data)
              } catch (error) {
        
              }
            };
            getSeller()
          }, []);
          console.log(sellershop)

    let Follow = userDetails?.following?.includes(id) === true ? "Unfollow":"Follow";

    const handleChange = async()=>{
        if(Follow === "Follow"){
            await axios.put(`https://api.aavelance.com/api/seller/${id}/follow` , {
                user: `${Userid}`
            });
            window.location.reload(true);
            
        }else{
            await axios.put(`https://api.aavelance.com/api/seller/${id}/unfollow` , {
                user:`${Userid}`
            });
            window.location.reload(true);
        }
       
    }
     
    const [Products, setProducts] = useState([]);
    useEffect(() => {
        const getProducts = async ()=>{
            try {
                const res = await axios.get(`https://api.aavelance.com/api/products/allproduct/${id}`)
                setProducts(res.data);
              } catch (error) {
              }
          }
          getProducts();
        }, [])
        
        console.log(Products)
    return (
        <>
        {seller !== null ? <Topbar /> : <Navbar/>}
            
            {/* {seller } */}
            <div style={{ display: 'flex' , backgroundColor:'black' }}>
                {seller !==null ? <Sidebar/> : ''}
               
                <div style={{ flex: 5 , overflow:'hidden' }}>
                    <div>
                        <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg" className="coverforprofile" alt="" />
                    </div>
                    <div style={{display:'flex' ,  margin:'auto' , backgroundColor:'black' , padding:10}}>
                       <div className="FirstContainer">
                           <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg" className="profileimage" alt="" />
                           <p className="textforShopComponent">{sellershop?.shopname}</p>
                       </div>
                       
                        {seller !==null ?  <Link to={"/seller/profile"}><div className="followContainer"><p style={{color:'white' , fontWeight:'600' , width:'100%' , marginLeft:-10}}>Manage account</p></div></Link> : <div className="followContainer">{users?.currentUser !== null ?  <p style={{color:'white' , fontWeight:'600' , marginTop:"12px"}}  onClick={handleChange}> {Follow}</p> : <Link to={"/login"}><p style={{color:'white' , fontWeight:'600' }}> {Follow}</p> </Link>}  </div>  }
                    </div>



                    <p style={{marginLeft:10 , fontSize:'15px', fontWeight:"600" , marginTop:14 , backgroundColor:'black' , color:'white'}}>All Products</p>
                        <div style={{ width:'96%' , margin:'auto', marginTop:10 , flexWrap:'wrap' , display:'flex' ,marginLeft:40}}>
                       {Products?.map((item)=>(
                        <div className="mainSlideCatContainer">
                        <Link to={`/product/find/${item?._id}`} style={{textDecoration:"none"}}>
                          <img src={`${item?.img[0]}`} className="slidercatimage" alt="" />
                          <p className="slidercatTilte">{item?.title?.slice(0,60)}..</p>
                          <p className="slidercatprice">Price : {`${item?.price}`}</p>
                          <div className="ratingcontainer">
                            <ReactStars value={item?.ratings} {...options} isHalf={true} count={5} />
                          </div>
                        </Link>
                      </div>
                         ))}

                    </div>
                </div>
            </div>
        </>
    )
}
