import { Add, Remove } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components"
import Announcement from "../component/Announcement";
import { Footer } from "../component/Footer";
import Navbar from "../component/Navbar";
import { Newsletter } from "../component/Newsletter";
import { mobile } from "../responsive";
import { publicRequest } from "../requestMethos"
import { addProduct } from "./redux/cartRedux";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import "../pages/product.css";
import ReactStars from "react-rating-stars-component";
import Post from "../pages/PostContainer/Post"
import React, { useRef } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core'
import { Rating } from "@material-ui/lab";
import axios from "axios";


const Container = styled.div`
overflow:hidden`;

const Detail = styled.p`
margin:-10px 10px;
`;


const FilterContainer = styled.div`
   display:flex;
   justify-content:space-between;
   width:50%;
   margin:30px 0px;
   ${mobile({ width: "100%" })}
 `;

const Filter = styled.div`
    display:flex;
    align-items:center;
    margin-left:10px;
 `;

const FilterTitle = styled.span`
   font-size:20px;
   font-weight:200
 `;

// const FilterColor = styled.div`
//    width:20px;
//    height:20px;
//    border-radius:50%;
//    background-color: ${props => props.color};
//    margin:0px 5px;
//    cursor:pointer;
//  `;

const FilterSize = styled.select`
   margin-left:10px;
   padding:5px
 `;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
   display:flex;
   align-items:center;
   width:100%;
   justify-content: space-between;
   ${mobile({ width: "100%" })}
 `;

const AmountContainer = styled.div`
    display:flex;
    align-items:center;
    font-weight:700;
    margin-left:10px;
  
 `;


const Amount = styled.span`
    width:30px;
    height:30px;
    border-radius:10px;
    border:1px solid teal;
    display:flex;
    align-items:center;
    justify-content:center;
    margin: 0px 5px 
`;


const ButtonContainer = styled.div`
margin:0px 80px;

`
const MainButtonContainer = styled.div`
 display:flex
`


const Product = () => {
  const options = {
    edit: false,
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
  };

  let userDetails = useSelector(state => state.user)
  let userid = userDetails?.currentUser?.others?._id;

  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const affid = window.location.search.split("=")[1];
  const [product, setproduct] = useState({});
  const [quantity, setquantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  const [open, SetOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [Comments , Setcomments] = useState([]);
  const [comment, setComment] = useState("");
  let counts = product.ratings;
  const user = useSelector((state) => state.user);
  const accessToken = user?.currentUser?.accessToken;
  const [seller , setseller] = useState('');
  const [reviewuser , setreviewuser] = useState('');
  const sellerId = product?.seller
  const isVisiable = false;
  console.log(sellerId)

  // console.log(product?.seller);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products/find/` + id);
        setproduct(res?.data);
        return () => {};
      } catch (error) {

      }
    };
    getProduct()
  }, [id]);


  const handleQuantity = (type) => {
    if (type == "dec") {
      quantity > 1 && setquantity(quantity - 1);
    } else {
      setquantity(quantity + 1);
    }
  }

  const handleClick = () => {
    dispatch(
      addProduct({ ...product, quantity, color, size , affid }));
  }

  

  const submitReview = () => {
    open ? SetOpen(false) : SetOpen(true);
    
  };


  const handleCreate = async()=>{
    try {
      await fetch('http://139.162.11.30:5000/api/products/reviews/product', {method: 'PUT',
        headers: { 'Content-Type': 'application/json' , token : accessToken },
        body: JSON.stringify({
          productid : `${id}`,
          comment:`${comment}` , rating: Number(rating)})})
        .then(response => {
          response.json()
            .then(data => {
              if(data.success !== true){
                alert("Sorry your review isn't submited please try again")
                
              }else{
                SetOpen(false)
                alert("Your review is submited")
                window.location.reload(true)
                console.log(data)

              }
            });
        })
    }
    catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    const getSeller = async () => {
      try {
        const res = await publicRequest.get(`/seller/seller/` + sellerId);
        setseller(res?.data);
        return () => {};

      } catch (error) {

      }
    };
    getSeller()
  }, [product]);

  const [Posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`http://139.162.11.30:5000/api/post/getallpost?category=${product?.categories}&subcategories=${product?.subcategories}`)
        setPosts(res.data);
        return () => {};
      } catch (error) {

      }
    }
    getPosts();
  }, [product])



  const [selectedImage,setselectedImage]=useState('')
  const handleimaClick = (items)=>{
    setselectedImage(items)
  }
  const textAreaRef = useRef(null);

  const handleCopy=()=>{
    textAreaRef.current.select();
    document.execCommand('copy');
    window.alert('Add a product link in your Aavelance post');
  }

  return (
    <Container>
      <Navbar />
      <Announcement />
      <div className="ProductWrapper">
        <div className="ImgContainer">
        <p className="productTitle1">{product?.title}</p>
        {selectedImage === '' ? <img className="Imagee" src={product.img === null ? "https://flevix.com/wp-content/uploads/2020/01/Reload-Image-Gif-1.gif" : product?.img?.[0] } /> : <img className="Imagee" src={selectedImage} />}
            <div className="subproductimageContainer">
            {product.img?.map((items) => 
                <img className="productsubimage" src={items} onClick={()=>handleimaClick(items)} />
              )}
              </div>
        </div>
        <div className="ProductInfoContainer">
          <p className="productTitle">{product?.title}</p>
          <p className="productprice">NPR {product?.price}</p>
          <FilterContainer>
            <Filter>
              <FilterTitle >Color</FilterTitle>
              <select className="filtersize" onClick={(e)=>setColor(e.target.value)}>
              {product.color?.map((item) => (
                  <FilterSizeOption key={"Select"}>Select</FilterSizeOption>,
                  <FilterSizeOption key={item}>{item}</FilterSizeOption>
                ))}
              </select>
            </Filter>
            <Filter>
              <FilterTitle>Size</FilterTitle>
              <FilterSize onClick={(e) => setSize(e.target.value)}>
                {product.size?.map((item) => (
                  <FilterSizeOption key={"Select"}>Select</FilterSizeOption>,
                  <FilterSizeOption key={item}>{item}</FilterSizeOption>
                ))}
              </FilterSize>
            </Filter>
          </FilterContainer>
          <AddContainer>
            <AmountContainer>
              <Remove onClick={() => handleQuantity("dec")} />
              <Amount>{quantity}</Amount>
              <Add onClick={() => handleQuantity("inc")} />
              <MainButtonContainer>
                <ButtonContainer>
                  {product?.Stock === "0" ? <p style={{color:"red"}}>Out Of Stock</p> :
                  <Link to="/cart"> 
                    <button style={{paddingLeft:"40px" , paddingRight:"40px" , paddingTop:"6px", paddingBottom:"6px" , border:"none" , backgroundColor:"black" , color:"white" , borderRadius:"10px"}} onClick={handleClick}>Buy</button>
                  </Link>
                  }
                </ButtonContainer>
              </MainButtonContainer>
            </AmountContainer>

          </AddContainer>
          <div >
            <textarea style={{width:"0px" , height:"0px"}} security={true} ref={textAreaRef} value={`http://139.162.11.30:3000/product/find/${product?._id}?affid=${userid}`}></textarea>
          </div>
          <button onClick={handleCopy} className="copyproduct">Copy Product Link</button>
          <p style={{ fontSize: '12px' }}>Shipping time : 1 to 2 days</p>
          <Link to={`/profile/${product.seller}`}>
            <div style={{display:"flex" , alignItems:"center"}}>
              <p style={{fontSize:"19px"}}>Selling by</p>
              <p style={{ fontSize: '18px' }}>{seller?.shopname} </p>
            </div>
          </Link>
          <p className="Desc">{product?.desc}</p>
          <h2 style={{marginTop:"30px" , marginLeft:"0px"}}>About Product</h2>
          <Detail>
          {product?.productDetail?.map((txt)=>(
            <li>{txt}</li>
          ))}
          </Detail>
          <h2 style={{marginTop:"30px" , marginLeft:"0px"}}>Product Specifications</h2>
          {product?.subcategories === "Makeup"? 
          <div>
            <p>Makeup</p>
          </div>:product?.subcategories === "Self help" || product?.subcategories === "Business" || product?.subcategories === "Finance" || product?.subcategories === "Spiritual" || product?.subcategories === "computer and programming" || product?.subcategories === "Story" ? 
          <div className="specificationsInfo">
            <h4> Publisher : {`${product?.Publisher}`}</h4>
            <h4>Language : {`${product?.Language}`}</h4>
            <h4>Item-Weight : {`${product?.Item_Weight}`}</h4>
          </div>:product?.subcategories === "Hoodie" || product?.subcategories === "Shirts" || product?.subcategories === "T-Shirts" || product?.subcategories === "Casual Shirts" || product?.subcategories === "Formal Shirts" || product?.subcategories === "Sweatshirts" || product?.subcategories === "Sweaters" || product?.subcategories === "Jackets" || product?.subcategories === "Coats" || product?.subcategories === "Suits" || product?.subcategories === "Jeans" || product?.subcategories === "Shorts" || product?.subcategories === "Track Pants & Joggers" || product?.subcategories === "Trousers" || product?.subcategories === "Shoes" || product?.subcategories === "Sandals and Floaters" || product?.subcategories === "Socks" || product?.subcategories === "Socks" ? 
          <div className="specificationsInfo">
            <h4>Brand : {`${product?.brand}`}</h4>
            <h4>Date First Available: {`${product?.Date_First_Available}`}</h4>
            <h4>Manufacturer : {`${product?.Manufacturer}`}</h4>
            <h4>Country of origin: {`${product?.Country_of_origin}`}</h4>
            <h4>ASIN : {`${product?.ASIN}`}</h4>
            <h4>Material : {`${product?.Material}`}</h4>
            <h4>Item model number : {`${product?.Item_model_number}`}</h4>
            <h4>Product Dimensions : {`${product?.Product_Dimensions}`}</h4>
          </div>:product?.subcategories === "Women's Bages" || product?.subcategories === "Kurtas & Suits" || product?.subcategories === "Shirts" || product?.subcategories === "Sarees" || product?.subcategories === "Jeans" || product?.subcategories === "Shorts & Skirts" || product?.subcategories === "Flats" || product?.subcategories === "Coats" || product?.subcategories === "Heels" || product?.subcategories === "Boots" || product?.subcategories === "Sleepwear & Loungewear" || product?.subcategories === "Tops" || product?.subcategories === "Co-ords" || product?.subcategories === "Playsuits" || product?.subcategories === "Blazers & Waistcoats" || product?.subcategories === "Sweatshirts & Sweaters"    ? 
           <div className="specificationsInfo">
            <h4>Brand : {`${product?.brand}`}</h4>
            <h4>Date First Available: {`${product?.Date_First_Available}`}</h4>
            <h4>Manufacturer : {`${product?.Manufacturer}`}</h4>
            <h4>Country of origin: {`${product?.Country_of_origin}`}</h4>
            <h4>ASIN : {`${product?.ASIN}`}</h4>
            <h4>Material : {`${product?.Material}`}</h4>
            <h4>Item model number : {`${product?.Item_model_number}`}</h4>
            <h4>Product Dimensions : {`${product?.Product_Dimensions}`}</h4>
            </div>:product?.subcategories === "Girl T-Shirts" || product?.subcategories === "Boy Sweaters & Sweatshirts" || product?.subcategories === "Girl Sweaters & Sweatshirts" || product?.subcategories === "Boy Jackets" || product?.subcategories === "Girl Jackets" || product?.subcategories === "Shorts" || product?.subcategories === "Track Pants" || product?.subcategories === "Sandals and Floaters" || product?.subcategories === "Ethnic Wear" || product?.subcategories === "Boy Nightwear & Loungewear" || product?.subcategories === "Boy Jackets" || product?.subcategories === "Girl Nightwear & Loungewear" || product?.subcategories === "Sandals & Heels" || product?.subcategories === "Flats & Flipflops" || product?.subcategories === "Boy Clothing sets" || product?.subcategories === "Girl Clothing sets" || product?.subcategories === "Kurta Sets" || product?.subcategories === "Boy Party Wear" || product?.subcategories === "Girl Party Wear" || product?.subcategories === "Lehenge choli"  ? 
          <div className="specificationsInfo">

            <h4>Brand : {`${product?.brand}`}</h4>
            <h4>Date First Available: {`${product?.Date_First_Available}`}</h4>
            <h4>Manufacturer : {`${product?.Manufacturer}`}</h4>
            <h4>Country of origin: {`${product?.Country_of_origin}`}</h4>
            <h4>ASIN : {`${product?.ASIN}`}</h4>
            <h4>Material : {`${product?.Material}`}</h4>
            <h4>Item model number : {`${product?.Item_model_number}`}</h4>
            <h4>Product Dimensions : {`${product?.Product_Dimensions}`}</h4>

          </div>:product?.subcategories === "Lipstick" || product?.subcategories === "Lip Gloss" || product?.subcategories === "Hand Cream"|| product?.subcategories === "Makeup Kit"|| product?.subcategories === "Lip Liner"|| product?.subcategories === "Mascara"|| product?.subcategories === "Eyeliner"|| product?.subcategories === "Kajal"|| product?.subcategories === "Foundation"|| product?.subcategories === "Nail Polish"|| product?.subcategories === "Face Moisturiser"|| product?.subcategories === "Cleanser"|| product?.subcategories === "Face Wash & Eye Cream"|| product?.subcategories === "Sunscreen"|| product?.subcategories === "Lip Balm"|| product?.subcategories === "Body Lotion"|| product?.subcategories === "Body Wash"|| product?.subcategories === "Fragrances"|| product?.subcategories === "Men's Grooming"|| product?.subcategories === "Lip Gloss"|| product?.subcategories === "Concealer"|| product?.subcategories === "Compact"|| product?.subcategories === "Baby Care"|| product?.subcategories === "Skin Care" ? 
          <div className="specificationsInfo">
            <h4>Brand : {`${product?.brand}`}</h4>
            <h4>Skin Type : {`${product?.Skin_Type}`}</h4>
            <h4>Material : {`${product?.Material}`}</h4>
            <h4>Skin Tone :{`${product?.Skin_Tone}`}</h4>
            <h4>Product Dimensions : {`${product?.Product_Dimensions}`}</h4>
            <h4>Item model number : {`${product?.Item_model_number}`}</h4>
            <h4>Age Range : {product?.Age_Range}</h4>
            <h4>ASIN : {`${product?.ASIN}`}</h4>
            <h4>Manufacturer : {`${product?.Manufacturer}`}</h4>
            <h4>Date First Available: {`${product?.Date_First_Available}`}</h4>
            

          </div>:product?.subcategories === "Shampoo" || product?.subcategories === "Hair Cream" || product?.subcategories === "Hair Oil"|| product?.subcategories === "Hair Gel"|| product?.subcategories === "Hair Color"|| product?.subcategories === "Hair Accessory"|| product?.subcategories === "Conditioner"|| product?.subcategories === "Hair Care"|| product?.subcategories === "Hair Serum" ? 
          <div className="specificationsInfo">

            <h4>Brand : {`${product?.brand}`}</h4>
            <h4>Product Benefits : {`${product?.Product_Benefits}`}</h4>
            <h4>Hair Type :{`${product?.Hair_Type}`}</h4>
            <h4>Material Type Free : {`${product?.Material_Type_Free}`}</h4>
            <h4>Scent : {`${product?.Scent}`}</h4>
            <h4>Liquid Volume : {product?.Liquid_Volume}</h4>
            <h4>Item Weight : {product?.Item_Weight}</h4>
            <h4>Item model number : {product?.Item_model_number}</h4>
            <h4>ASIN : {`${product?.ASIN}`}</h4>
            <h4>Manufacturer : {`${product?.Manufacturer}`}</h4>
            <h4>Product Dimensions: {`${product?.Product_Dimensions}`}</h4>

          </div>:""
          }
        </div>
      </div>

      {Posts.length !== 0 ?
             <div style={{backgroundColor:"black" }}>
              <h2 className="headertitleee">User Post</h2>
              <div className="HomefollowitemContainer">
                {Posts.map((item)=>(
                  <Post post={item}/>
                ))}
                     
              </div>
              </div>
        : ""}

      <div className="Submain">
        <div style={{ flex: 1 }}>
          <p className="customerRating">Customer Rating</p>
          <div className="RatingContainer">
            <ReactStars {...options} value={counts} isHalf={true} count={5} />
            <p className="ratingCounter" > {counts} out of 5</p>
          </div>
        </div>

        <Dialog aria-labelledby="Simple-dialog-title"
          open={open}
          onClose={submitReview}>
          <DialogTitle>Submit Review</DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            <Rating onChange={(e) => setRating(e.target.value)}
              value={rating}
              size="large" />
            <textarea style={{
              border: '1px solid reba(0,0,0,0.082)',
              margin: '1vmax',
              outline: 'none',
              padding: '1rem'
            }}
              cols={"30"}
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}>
            </textarea>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreate}>Submit</Button>
          </DialogActions>
        </Dialog>


        <div style={{ flex: 2 }}>
          <button className="SendCustomer" onClick={submitReview}>Send Customer reviews</button>
          <div className="mainReviewcontainer">
            {product.reviews?.map((item) => (
              <div className="productReview">
                <div className="reviewContainer">
                  <img src="https://yt3.ggpht.com/xVOV14gMQ-Y7RUIde5MG2WlocjHq3aFQncsNJguGkmYyV9xGgN3EQYndxg18mNiaKYSgDit4nA=s176-c-k-c0x00ffffff-no-rj" className="reviewuserimg" alt="" />
                  <p className="customerid">{item.username}</p>
                </div>
                <div style={{ marginRight: '25px' , marginTop:'-12px' }}>
                  <p>{item.comment}</p>
                  <div style={{ marginTop: '-22px', display: 'flex' , alignItems:"center" }}>
                    <ReactStars {...options} value={item.rating} isHalf={true} count={5} />
                    <p style={{ fontWeight: '800' , fontSize:"11px",marginTop:'14px' , marginLeft:"6px" }}>Rating By user</p>
                  </div>
                </div>
              </div>))}
          </div>


        </div>

      </div>

      {/* <Newsletter />
      <Footer /> */}
    </Container>
  )
}
export default Product