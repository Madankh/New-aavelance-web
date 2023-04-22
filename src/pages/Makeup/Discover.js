import React, { useEffect, useState } from 'react'
import "../Makeup/makeup.css"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { publicRequest } from '../../requestMethos';
import Modal from 'react-modal';
import LikeIcon from "../../FeedUserComponent/Images/like.png"
import anotherlikeicon from "../../FeedUserComponent/Images/setLike.png"
import CommentIcon from "../../FeedUserComponent/Images/speech-bubble.png";

export default function Discover({item}) {

  let userDetails = useSelector(state => state.user)
  let users = userDetails?.user;
  let id = userDetails?.currentUser?.others?._id;
  const accessToken = userDetails?.currentUser?.accessToken;
  const productLink = item?.ProductLinks[0]?.slice(35,90);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [product , setproduct] = useState('');
  const [productitem , setproductitem] = useState('');
  
  const [Like, setLike] = useState([item?.like.includes(id) ? anotherlikeicon : LikeIcon]);
  const [count, setCount] = useState(item?.like?.length);
  const [Comments, setComments] = useState(item?.comments);
  const [commentwriting, setcommentwriting] = useState('');
  const [show, setshow] = useState(false);
  
  
  const [user, setuser] = useState([]);
  useEffect(() => {
    const getuser = async () => {
      try {
        const res = await axios.get(`http://192.168.18.4:5000/api/user/post/user/details/${id}`)
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [])


  const handleLike = async () => {
    if (Like == LikeIcon) {
      await fetch(`http://192.168.18.4:5000/api/post/${item._id}/like`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken } })
      setLike(anotherlikeicon);
      setCount(count + 1);
    } else {
      await fetch(`http://192.168.18.4:5000/api/post/${item._id}/like`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken } })
      setLike(LikeIcon)
      setCount(count - 1);
    }
  }

  const addComment = async () => {
    const comment = {
      "postid": `${item._id}`,
      "username": `${userDetails?.currentUser?.others?.username}`,
      "comment": `${commentwriting}`,
      "profile": `${userDetails?.currentUser?.others?.profile}`
    }
    await fetch(`http://192.168.18.4:5000/api/post/comment/post`, { method: "PUT", headers: { 'Content-Type': "application/Json", token: accessToken }, body: JSON.stringify(comment) })
    setComments(Comments.concat(comment));
    alert("Your Comment is post successfully")
  }

  const handleComment = () => {
    addComment();
  }

  console.log(Comments)

  const handleshow = () => {
    if (show === false) {
      setshow(true);
    } else {
      setshow(false);
    };
  };

  const [Follow, setFollow] = useState(() => {
    if (!user?.Userfollowing) {
      return "Follow";
    }
    return user.Userfollowing.includes(item.user) ? "Following" : "Follow";
  });
  
  useEffect(() => {
    if (user.Userfollowing) {
      setFollow(user.Userfollowing.includes(item.user) ? "Following" : "Follow");
    }
  }, [user, item]);
  
  console.log(user?.Userfollowing , "Userfollowing")
  const handleFollow= async(e)=>{
    if(Follow == "Follow"){
      await fetch(`http://localhost:5000/api/user/feed/following/${id}` , {method:'PUT', headers:{'Content-Type':"application/JSON" , token:accessToken} , body:JSON.stringify({user:`${item?.user}`})})
      setFollow("Following");
    }else{
      await fetch(`http://localhost:5000/api/user/feed/following/${id}` , {method:'PUT', headers:{'Content-Type':"application/JSON" , token:accessToken} , body:JSON.stringify({user:`${item?.user}`})})
      setFollow("Follow");
    }
  }



  
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

  const handleClick = (item)=>{
    if(modalIsOpen == false){
      setModalIsOpen(true);
      setproductitem(item);
    }
  }

  return (
    <div className='insidemakeupcontent' onClick={()=>handleClick(item)}>
          {item?.image !== '' ? <img src={`${item.image}`} className='makeupContentImage' alt="" /> : item.video !== ''?
          
          <video  src={`${item?.video}`} controls controlsList="nodownload" className='makeupContentImage'></video>

           :""
            }
          <p style={{ textAlign: 'start', width: "96%", marginLeft: 0,fontSize:"13px", marginTop: 0 }}>{item.title?.slice(0,35)}</p>
          
          {product !== null && product !== '' ? 
            <div style={{marginTop:'-10px'}}>
             <div className='productContainer'>
               {product?.img?.slice(0,1).map((item)=>(
                   <img src={`${item}`} className="makeProductImageForPostt"  alt="" />
                   ))}
               <div style={{ marginLeft: "10px" }}>
                 <p className='productdesincontent' >{product?.title?.slice(0,30)}</p>
                 <p className='otherproductdesincontent' >{product?.desc?.slice(0,40)}</p>
               </div>
              
               
             </div>
               <a href={`/product/find/${productLink}`}>
                 <button className='btnformakeup' style={{ width:"100%",border: "none", 
                 marginRight: "10px", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "black", color: "white", 
                 borderBottomLeftRadius: "10px", cursor: "pointer", marginBottom: "0px", fontWeight: "600" 
                 }}>Buy</button>
               </a>
            </div>
          :''
          }
         
    <Modal
       isOpen={modalIsOpen}
       onRequestClose={() => setModalIsOpen(false)}
       contentLabel="Create New Group"
       className="modal"
       >
          <div className='ModalForDiscoverPage'>
          <div style={{flex:2}}>
            {productitem?.image == "" ? <video src={`${item?.video}`} controls controlsList="nodownload" style={{width:"100%" , height:"65vh" , marginTop:"-0px"}}></video> : 
            <img src={`${productitem?.image}`} className="ModalImage"  alt="" />}
          </div>
          <div style={{flex:2}}>
            <div style={{display:"flex" , justifyContent:"space-between"}}>
              <div style={{display:"flex" , alignItems:"center" , marginLeft:"20px"}}>
                {user.profile == "" ? 
                <img src={`https://news.artnet.com/app/news-upload/2022/12/prisma-labs-lensa-ai.jpg`} style={{width:"30px" , height:"30px", borderRadius:"50%"}} className=""  alt="" />:<img src={`${user?.profile}`} style={{width:"30px" , height:"30px", borderRadius:"50%"}} className=""  alt="" />
                }
                <p style={{marginLeft:"10px"}}>{user?.username}</p>
              </div>
              <div style={{marginTop:"10px"}} onClick={handleFollow}>
                <button style={{paddingLeft:"25px" ,color:"white" ,borderRadius:"10px", paddingRight:"25px" , paddingTop:"4px" , paddingBottom:"4px" , backgroundColor:"black"}}>{Follow}</button>
              </div>
            </div>
            <p style={{marginLeft:"30px"}}>{productitem?.title}</p>
            {product !== null && product !== '' ? 
            <div style={{marginTop:'-10px' , marginLeft:"15px"}}>
             <div className='productContainer'>
               {product?.img?.slice(0,1).map((item)=>(
                   <img src={`${item}`} className="makeProductImageForPostt"  alt="" />
                   ))}
               <div style={{ marginLeft: "10px" }}>
                 <p className='productdesincontent' >{product?.title?.slice(0,30)}</p>
                 <p className='otherproductdesincontent' >{product?.desc?.slice(0,50)}</p>
               </div>
              
               
             </div>
               <a href={`/product/find/${productLink}`}>
                 <button className='btnformakeup' style={{ width:"100%",border: "none", 
                 marginRight: "10px", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "black", color: "white", 
                 borderBottomLeftRadius: "10px", cursor: "pointer", marginBottom: "0px", fontWeight: "600" 
                 }}>Buy</button>
               </a>
            </div>
          :''
          }
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                {id == undefined || null ? 
                <a href='/login' style={{textDecoration:"none"}}>
                <div style={{display:"flex" , alignItems:"center"}}>
                  <img src={`${Like}`} className="iconsforPost"  alt="" />
                  <p style={{ marginLeft: "6px" }}>{count} Likes</p>
                </div>
                </a>
              :
              <div style={{display:"flex" , alignItems:"center"}}  onClick={handleLike} >
              <img src={`${Like}`} className="iconsforPost"  alt="" />
              <p style={{ marginLeft: "6px" }}>{count} Likes</p>
            </div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", marginLeft: 20, cursor: "pointer" }} onClick={handleshow}>
              {id == undefined || null ? 
              <a href='/login' style={{textDecoration:"none"}}>
                <div style={{display:"flex" , alignItems:"center"}} >
                  <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p>
                </div>
              </a>
              :
              <div style={{display:"flex" , alignItems:"center"}} onClick={handleshow}>
                <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p>
            </div>}
                {/* <img src={`${CommentIcon}`} className="iconsforPost" alt="" />
                <p style={{ marginLeft: "6px" }}>{Comments.length} Comments</p> */}
              </div>
            </div>

          </div>

          {show === true ?
            <div style={{ padding: '10px' }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={`${user?.profile}`} className="PostImage" alt="" />
                {/* <p style={{marginLeft:"6px"}}>Suman</p> */}
                <input type="text" className='commentinput' placeholder='Write your thought' onChange={(e) => setcommentwriting(e.target.value)} />
                <button className='addCommentbtn' onClick={handleComment}>Post</button>
              </div>
              {Comments.map((item) => (
                <div style={{ alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {item.profile === '' ?
                      <img src={`https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`} className="PostImage" alt="" /> : <img src={`${item.profile}`} className="PostImage" alt="" />
                    }
                    <p style={{ marginLeft: "6px", fontSize: 18, marginTop: 6 }}>{item.username}</p>
                  </div>
                  <p style={{ marginLeft: "55px", textAlign: 'start', marginTop: -16 }}>{item.comment}</p>
                  <p style={{ marginLeft: "55px", textAlign: 'start', marginTop: -10, color: "#aaa", fontSize: 11 }}>Reply</p>

                </div>

              ))}
            </div> : ''
          }
          </div>
          </div>
    </Modal>
    
        </div>
  )
}
