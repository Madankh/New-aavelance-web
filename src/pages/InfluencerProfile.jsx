import Sidebar from "../Seller/components/sidebar/Sidebar"
import Topbar from "../Seller/components/topbar/Topbar"
import "./profile.css"
import ReactStars from "react-rating-stars-component";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import InfluencerNavbar from "../Influencer/component/InfluencerNavbar";
const options = {
    edit: false,
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: 4.7,
  };

export default function InfluencerProfile() {
    const admin = useSelector((state) => state.seller);
    let seller = admin.currentSeller;
    const location = useLocation();
    const id = location.pathname.split("/")[3];
    console.log(id)

    let influencer = useSelector(state => state.influencer);
    let Influencerid = "";
    if(influencer){
        Influencerid = influencer?.currentInfluencer?.others?._id;
    }


    let istrue;
    const followingorNot = influencer?.currentInfluencer?.others?.following?.map((item)=>(istrue = item));
    let followinguser = istrue == id;

    let [Follow , SetFollow] = useState(followinguser == true ? "Unfollow" : "Follow");
    const handleChange = async()=>{
        if(Follow == "Follow"){
            await axios.put(`http://139.162.11.30:80/api/seller/${id}/influencer/follow` , {
                influencer: `${Influencerid}`
            });
            SetFollow("Unfollow")
            
        }else{
            await axios.put(`http://139.162.11.30:80/api/seller/${id}/influencer/unfollow` , {
                influencer:`${Influencerid}`
            });
            SetFollow("Follow")
        }
       
    }
     
    const [Products, setProducts] = useState([]);
    useEffect(() => {
        const getProducts = async ()=>{
            try {
                const res = await axios.get(`http://139.162.11.30:80/api/products/allproduct/${id}`)
                setProducts(res.data);
              } catch (error) {

              }
          }
          getProducts();
        }, [])
        
        console.log(Products)
    return (
        <>
        {seller !== null ? <Topbar /> : <InfluencerNavbar/>}
            
            {/* {seller } */}
            <div style={{ display: 'flex' , backgroundColor:'black' }}>
                {seller !==null ? <Sidebar/> : ''}
               
                <div style={{ flex: 5 , overflow:'hidden' }}>
                    <div>
                        <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg" style={{ width: '100%', height: '44vh', borderRadius: '0px' }} alt="" />
                    </div>
                    <div style={{display:'flex' ,  margin:'auto' , backgroundColor:'black' , padding:10}}>
                       <div className="FirstContainer">
                           <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg" alt="" />
                           <p className="textforShopComponent">ShopName</p>
                       </div>
                       <div className="MiddleContainer">
                           <p className="textforShopComponent">Products</p>
                           <Link to={`/profile/streaming/vid/${id}`}>
                              <p className="textforShopComponent">Streaming Videos</p>
                           </Link>
                       </div>
                       {/* <div className="followContainer"> */}
                           {seller !==null ?  <Link to={"/seller/profile"}><div className="followContainer"><p style={{color:'white' , fontWeight:'600' , width:'100%' , marginLeft:-10}}> Manage account</p></div></Link> : <div className="followContainer">{influencer?.currentInfluencer !== null ?  <p style={{color:'white' , fontWeight:'600'}}  onClick={handleChange}> {Follow}</p> : <Link to={"/login"}><p style={{color:'white' , fontWeight:'600'}}> {Follow}</p> </Link>}  </div>  }
                       {/* </div> */}
                    </div>

                    {/* <p style={{marginLeft:125 , fontSize:'20px', fontWeight:"600"}}>Top Rating products</p>
                    <div style={{ width:'90%' , margin:'auto', marginTop:10 , flexWrap:'wrap' , display:'flex' , marginLeft:190}}>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div style={{marginTop:-12}}>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>

                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12, fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12, fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>

                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>

                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>

                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12 , width:'80%'}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                                <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div> 
                    </div> */}

                    <p style={{marginLeft:130 , fontSize:'20px', fontWeight:"600" , marginTop:14 , backgroundColor:'black' , color:'white'}}>All Products</p>
                        <div style={{ width:'90%' , margin:'auto', marginTop:10 , flexWrap:'wrap' , display:'flex' ,marginLeft:190}}>
                       {Products.map((item)=>(
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src={item.img} style={{width:'76%' , borderRadius:"0px" , height:'20vh' , objectFit:'contain'}} alt="" />
                            <p style={{marginTop:-12 , width:'72%' , color:'white'}}>{item.title.slice(0 , 50)}</p>
                            <p style={{marginTop:-12 , fontWeight:"800" , color:'white'}}>NPR {item.price}</p>
                            <div>
                               <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div> 
                         ))}
                        {/* <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                            <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                            <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div>
                        <div style={{width:'300px' , marginLeft:-60}}>
                            <img src="https://icdn.digitaltrends.com/image/digitaltrends/macbook-pro-2021-16.jpg" style={{width:'76%' , borderRadius:"0px" , height:'20vh'}} alt="" />
                            <p style={{marginTop:-12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                            <p style={{marginTop:-12 , fontWeight:"800"}}>NPR 6000</p>
                            <div>
                            <ReactStars {...options} isHalf={true} count={5} />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
