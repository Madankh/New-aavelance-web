
import Sidebar from "../../Seller/components/sidebar/Sidebar";
import Topbar from "../../Seller/components/topbar/Topbar";
import "./StreamingVideo.css"
import ReactStars from "react-rating-stars-component";
import { useSelector } from 'react-redux';
import Navbar from "../../component/Navbar";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const options = {
      edit: false,
      activeColor: "tomato",
      size: window.innerWidth < 600 ? 20 : 25,
      value: 4.7,
};

let Userid = '';
export default function Profile() {
      const admin = useSelector((state) => state.seller);
      let seller = admin.currentSeller;
      const location = useLocation();
      const id = location.pathname.split("/")[4];
      console.log(id)
      let users = useSelector(state => state.user);
      if (users) {
            Userid = users?.currentUser?.other?._id;
      }


      let istrue;
      const followingorNot = users?.currentUser?.other?.following?.map((item) => (istrue = item));
      let followinguser = istrue == id;


      let [Follow, SetFollow] = useState(followinguser == true ? "Unfollow" : "Follow");
      const handleChange = async () => {
            if (Follow == "Follow") {
                  await axios.put(`http://localhost:5000/api/seller/${id}/follow`, {
                        user: `${Userid}`
                  });
                  SetFollow("Unfollow")

            } else {
                  await axios.put(`http://localhost:5000/api/seller/${id}/unfollow`, {
                        user: `${Userid}`
                  });
                  SetFollow("Follow")
            }

      }

      const [Products, setProducts] = useState([]);
      useEffect(() => {
            const getProducts = async () => {
                  try {
                        const res = await axios.get(`http://localhost:5000/api/products/allproduct/${id}`)
                        setProducts(res.data);
                  } catch (error) {

                  }
            }
            getProducts();
      }, [])

      console.log(Products)
      return (
            <>
                  {seller !== null ? <Topbar /> : <Navbar />}

                  {/* {seller } */}
                  <div style={{ display: 'flex' , backgroundColor:"black" }}>
                        {seller !== null ? <Sidebar /> : ''}

                        <div style={{ flex: 5, overflow: 'hidden' }}>
                              <div>
                                    <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg" style={{ width: '100%', height: '44vh', borderRadius: '0px' }} alt="" />
                              </div>
                              <div style={{ display: 'flex', margin: 'auto', backgroundColor: 'black', padding: 10 }}>
                                    <div className="FirstContainer">
                                          <img src="https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg" alt="" />
                                          <p className="textforShopComponent">ShopName</p>
                                    </div>
                                    <div className="MiddleContainer">
                                          <Link to={`/profile/${id}`}>
                                                <p className="textforShopComponent">Products</p>
                                          </Link>
                                          <p className="textforShopComponent">Streaming Videos</p>

                                    </div>
                                    
                                    {seller !== null ? <Link to={"/seller/profile"}><div className="followContainer"><p style={{ color: 'white', fontWeight: '600', width: '100%', marginLeft: -10 }}> Manage account</p></div></Link> : <div className="followContainer">{users?.currentUser !== null ? <p style={{ color: 'white', fontWeight: '600' }} onClick={handleChange}> {Follow}</p> : <Link to={"/login"}><p style={{ color: 'white', fontWeight: '600' }}> {Follow}</p> </Link>}  </div>}
                                    {/* </div> */}
                              </div>

                        
                              <p style={{ marginLeft: 100, fontSize: '20px', fontWeight: "600", marginTop: 14, color: 'white' }}>All Products</p>
                              <div style={{ width: '90%', margin: 'auto', marginTop: 10, flexWrap: 'wrap', display: 'flex' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: 27, backgroundColor: "black" }}>
                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                          <div style={{ width: '250px' }}>
                                                <img src="https://i.ytimg.com/vi/yICVNta8jMU/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZMwZM7jwc0QJQqjOnsQ74lG5cUw" className='subscriptionThumnailimg' alt="" />
                                                <p style={{ marginTop: -36, marginLeft: 190 }}>5:50</p>
                                                <div>
                                                      <p className="titlename">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem enim</p>
                                                      <p className='channelSubscription'>CodeDemo</p>
                                                      <div style={{ display: 'flex', marginTop: -20, marginLeft: -3 }}>
                                                            <p className='ViewsSubscription'>30M views</p>
                                                            <p className='UploadDate'>3 days ago</p>
                                                      </div>
                                                </div>
                                          </div>

                                    </div>
                                    
                              </div>
                        </div>
                  </div>
            </>
      )
}
