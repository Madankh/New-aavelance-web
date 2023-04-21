import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components"
import Announcement from "../../component/Announcement";
import { Footer } from "../../component/Footer";
import InfluencerNavbar from "../component/InfluencerNavbar";
import { Newsletter } from "../component/Newsletter";
import { mobile } from "../../responsive";
import { publicRequest } from "../../requestMethos"
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import "./InfluencerProduct.css";
import ReactStars from "react-rating-stars-component";
import Carousel from "react-elastic-carousel";

const Container = styled.div``;
const Wrapper = styled.div`
   padding:50px;
   display:flex;
 ${mobile({ padding: "10px", flexDirection: "column" })}
 `;
const ImgContainer = styled.div`
 flex:1;
`;
const Image = styled.img`
  width:100%;
  height:90vh;
  object-fit:contain;
  border-radius:1px;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
 flex:1;
 padding:0px 50px;
 ${mobile({ padding: "10px 0px" })}
`;

const Title = styled.h1`
   font-weight:200;
`;

const Desc = styled.p`
  margin:5px 0px;
`;

const Detail = styled.p`
margin:-10px 0px;
`;

const Price = styled.span`
  font-weight:100;
  font-size:40px;
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
 `;

const FilterTitle = styled.span`
   font-size:20px;
   font-weight:200
 `;

const FilterColor = styled.div`
   width:20px;
   height:20px;
   border-radius:50%;
   background-color: ${props => props.color};
   margin:0px 5px;
   cursor:pointer;
 `;

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

const Buttonn = styled.div`
  padding:15px;
  border: 2px solid teal;
  color:white;
  // margin:0px 10px;
  background-color : black;
  cursor:pointer;
  font-weight:500;
  ${mobile({})}

  &:hover{
      background-color:red
  }
`;


const ButtonContainer = styled.div`
display:flex;

`
const MainButtonContainer = styled.div`
 display:flex
`


const InfluencerProduct = () => {
  const options = {
    edit: false,
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
  };


  const breakPoints = [
    { width: 1, itemsToShow: 1 },
  ];
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const affid = window.location.search.split("=")[1];
  const [product, setproduct] = useState({});
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  let counts = product.ratings;
  const influencer = useSelector((state) => state.influencer);
  const [open , setOpen] = useState(false);
  

  const handleClick =()=>{

  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get(`/products/find/` + id);
        setproduct(res.data);
      } catch (error) {

      }
    };
    getProduct()
  }, [id]);


  return (
    <Container>
      <InfluencerNavbar />
      <Announcement/>
      <Wrapper>
        <ImgContainer>
          <Carousel breakPoints={breakPoints}>
            {product.img?.map((items) => (
              <Image src={items} />
            ))}
          </Carousel>
        </ImgContainer>
        <InfoContainer>
          <Title>{product.title}</Title>
          <Price>NPR {product.price}</Price>
          <FilterContainer>
            <Filter>
              <FilterTitle >Color</FilterTitle>
              {product.color?.map((item) => (
                <FilterColor
                  onClick={() => setColor(item)}
                  color={item} key={item} />
              ))}
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
              
              <MainButtonContainer>
                <ButtonContainer>
                  <p>{`http://localhost:3000/Product/find/${id}?affid=${influencer?.currentInfluencer?.others?._id}`}</p>
                  <Buttonn onClick={handleClick} >Influencer_link</Buttonn>
                </ButtonContainer>
              </MainButtonContainer>
            </AmountContainer>

          </AddContainer>
          <p style={{ fontSize: '12px' }}>Shipping time : 45 min</p>
          <Link to={`/Influencer/profile/${product.seller}`}>
            <p style={{ fontSize: '18px' }}>Seller Profile </p>
          </Link>
          <Desc>{product?.desc}</Desc>
          <Detail>{product?.productDetail}</Detail>
        </InfoContainer>
      </Wrapper>
      <div className="Submain" style={{ display: 'flex', padding: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '40px', fontWeight: '800' }}>Customer Rating</p>
          <div style={{ paddingLeft: '10px', display: 'flex' }}>
            <ReactStars {...options} value={counts} isHalf={true} count={5} />
            <p style={{ fontSize: '20px', fontWeight: '700' }}> {counts} out of 5</p>
          </div>
        </div>

        <div style={{ flex: 2 }}>
          {/* <button style={{ color: 'white', backgroundColor: "black", height: '30px', borderRadius: '10px', border: 'none', cursor: 'pointer' }} onClick={submitReview}>Send Customer reviews</button> */}

          <div className="maincontainer">
            {product.reviews?.map((item) => (
              <div style={{ width: '33.3%' }}>
                <div style={{ display: 'flex' }}>
                  <img src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" style={{ width: '10%', height: '10%', borderRadius: '50%', paddingTop: '10px' }} alt="" />
                  <p style={{ marginTop: '9px', fontWeight: '600', fontSize: '16px' }}>{item._id}</p>
                </div>
                <div style={{ marginRight: '25px' }}>
                  <div style={{ marginLeft: '5px', display: 'flex' }}>
                    <ReactStars {...options} value={item.rating} isHalf={true} count={5} />
                    <p style={{ fontWeight: '800' }}>Rating By user</p>
                  </div>
                  <p>{item?.comment}</p>
                </div>
              </div>))}
          </div>


        </div>

      </div>

      <Newsletter />
      <Footer/>
    </Container>
  )
}
export default InfluencerProduct