import React from 'react'
import "./contentpost.css";
import imageIcon from "../Images/gallery.png"
import VideoIcon from "../Images/video.png"
import profileimage from "../../Assest/UserProfile.png"
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Modal from '../../Modal/Modal';
import axios from 'axios';
export default function ContentPost() {
  let userDetails = useSelector(state => state.user)
  const accessToken = userDetails?.currentUser?.accessToken;


  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [title, setTile] = useState('');
  const [imagePre, setImagePre] = useState(null);
  const [categories, setcategories] = useState('');
  const [subcategories, setsubcategories] = useState('');
  const [VideoPre, setVideoPre] = useState(null);
  const [ProductLinks, setProductLinks] = useState([]);
  const [ProductLink, setProductLink] = useState('');

  const [modalOpen, setModalOpen] = useState(false);

  const handleAddProduct = () => {
    setProductLinks(ProductLinks.concat(ProductLink));
  }
  console.log(file);
  console.log(file2)

  const handlePost = async (e) => {
    e.preventDefault();

    // Create a new FormData object and append the image file to it
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("categories", categories);
    formData.append("subcategories", subcategories);
    formData.append("ProductLinks", ProductLinks);
    formData.append("video", file2);
    await axios.post("https://api.aavelance.com/api/post/user/post", formData, { headers: { 'Content-Type': 'multipart/form-data', token: accessToken } }).then(() => {
      window.location.reload()
    })
  }



  const handleVideoPost = async (e) => {
    e.preventDefault();

    // Create a new FormData object and append the image file to it
    const formData = new FormData();
    formData.append("image", '');
    formData.append("title", title);
    formData.append("categories", categories);
    formData.append("subcategories", subcategories);
    formData.append("ProductLinks", ProductLinks);
    formData.append("video", file2);
    await axios.post("https://api.aavelance.com/api/post/user/post/video", formData, { headers: { 'Content-Type': 'multipart/form-data', token: accessToken } }).then(() => {
      window.location.reload()
    })
  }





  function handleCat(value) {
    setcategories(value)
  }

  function handlesubCat(value){
    setsubcategories(value)
  }

  return (
    <div>

      <div className='ContentUploadContainer'>
        <form onSubmit={file !== null ? handlePost : handleVideoPost}>
          {modalOpen && <Modal setOpenModal={setModalOpen} />}
          <div style={{ display: "flex", alignItems: "center", padding: 10 }}>

            {userDetails?.currentUser?.others?.profile == '' ? <img src={`${profileimage}`} className="profileimage" /> :
              <img src={`${userDetails?.currentUser?.others?.profile}`} className="profileimage" alt="" />
            }
            <input type="text" className='contentWritingpart' placeholder='Write your real thought.....' onChange={(e) => setTile(e.target.value)} />
          </div>

          <div style={{ marginLeft: '10px' }}>
            {imagePre !== null ? <img src={imagePre} style={{ width: "100%", height: '50vh', objectFit: "cover", borderRadius: '10px' }} alt="" /> : VideoPre !== null ? <video src={`${VideoPre}`} className='PosttImage' controls >
              <source />
            </video> : ''
            }
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <label htmlFor='file'>
                  <img src={`${imageIcon}`} className="icons" alt="" />
                  <input type="file" name="file" id="file" accept="image/*" style={{ display: "none" }} onChange={(e) => [setFile(e.target?.files[0]), setImagePre(URL.createObjectURL(e.target.files[0]))]} />
                </label>

                <label htmlFor='file2'>
                  <img src={`${VideoIcon}`} className="icons" alt="" />
                  <input type="file" name="file2" id="file2" style={{ display: "none" }} onChange={(e) => [setFile2(e.target.files[0]), setVideoPre(URL.createObjectURL(e.target.files[0]))]} />
                </label>

              </div>
              <button style={{ height: "30px", marginRight: "12px", marginTop: "40px", paddingLeft: "20px", paddingRight: "20px", paddingTop: 6, paddingBottom: 6, border: "none", backgroundColor: "black", color: "white", borderRadius: "5px", cursor: "pointer" }} type="submit">Post</button>
            </div>
          </div>
        </form>
        <div style={{ display: "flex", marginLeft: "0px", marginTop: "10px", padding: "10px" }}>
          <input className='productLink' type="text" name="" id="" placeholder='What you wear links product to earn. ' onChange={(e) => setProductLink(e.target.value)} />
          <button className='ProductAddBtn' onClick={handleAddProduct}>Add</button>
        </div>
        {ProductLinks.length !== 0 ? <div>{ProductLinks.map((item) => (<p>{item}</p>))}</div> : ""}
        <div style={{display:'flex' , justifyContent:'space-between' , padding:"5px" , marginTop:"-20px"}}>
          <div>
            <div>
              <p className='cattitle'>Categories</p>
            </div>
            <div>
              <select className='inputcontainer' onClick={(event) => handleCat(event.target.value)} name="Categories" id="option">
                <option value="">Select Categories</option>
                <option value="Hand Made">Hand Made</option>
                <option value="Beauty and Personal Care">Beauty and Personal Care</option>
                <option value="Women's Fashion">Women's Fashion</option>
                <option value="Men's Fashion">Men's Fashion</option>
                <option value="Kid's Fashion">Kid's Fashion</option>  
              </select>
              </div>
          </div>

          <div>
            <div>
              <p className='cattitle'>Subcategories</p>
            </div>
            <div>
            {categories === "Books" ? 
              <select className='inputcontainerr' onClick={(event) => handlesubCat(event.target.value)} id="option">
                <option value="">Select</option>
                <option value="Self help">Self help</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Spiritual">Spiritual</option>
                <option value="computer and programming">Computer and programming</option>
                <option value="Story">Story</option>
                
                

              </select>: categories === "Beauty and Personal Care" ?
              <select className='inputcontainerr' onClick={(event) => handlesubCat(event.target.value)} id="option">
              <option value="">Select</option>
              <option value="Beauty Tools">Beauty Tools</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Lipstick">Lipstick</option>
              <option value="Lip Gloss">Lip Gloss</option>
              <option value="Lip Liner">Lip Liner</option>
              <option value="Mascara">Mascara</option>
              <option value="Eyeliner">Eyeliner</option>
              <option value="Kajal">Kajal</option>
              <option value="Foundation">Foundation</option>
              <option value="Nail Polish">Nail Polish</option>
              <option value="Face Moisturiser">Face Moisturiser</option>
              <option value="Cleanser">Cleanser</option>
              <option value="Face Wash & Eye Cream">Face Wash & Eye Cream</option>
              <option value="Sunscreen">Sunscreen</option>
              <option value="Body Lotion">Body Lotion</option>
              <option value="Lip Balm">Lip Balm</option>
              <option value="Body Wash">Body Wash</option>
              <option value="Body Scrub">Body Scrub</option>
              <option value="Shampoo">Shampoo</option>
              <option value="Hair Cream">Hair Cream</option>
              <option value="Hair Oil">Hair Oil</option>
              <option value="Hair Gel">Hair Gel</option>
              <option value="Hair Color">Hair Color</option>
              <option value="Hair Accessory">Hair Accessory</option>
              <option value="Fragrances">Fragrances</option>
              <option value="Men's Grooming">Men's Grooming</option>

              

            </select>: categories === "Women's Fashion" ? 
            <select className='inputcontainerr' onClick={(event) => handlesubCat(event.target.value)} id="option">
            <option value="">Select</option>
            <option value="Hoodie">Hoodie</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Shirts">Shirts</option>
            <option value="Sweatshirts & Sweaters">Sweatshirts & Sweaters</option>
            <option value="Jackets">Jackets</option>
            <option value="Coats">Coats</option>
            <option value="Sarees">Sarees</option>
            <option value="Jeans">Jeans</option>
            <option value="Shorts & Skirts">Shorts & Skirts</option>
            <option value="Track Pants & Joggers">Track Pants & Joggers</option>
            <option value="Flats">Flats</option>
            <option value="Heels">Heels</option> <option value="Clothing">Clothing</option>
            <option value="Boots">Boots</option>
            <option value="Women's Bages">Women's Bages</option>
            <option value="Sleepwear & Loungewear">Sleepwear & Loungewear</option>
            <option value="Tops">Tops</option>
            <option value="Co-ords">Co-ords</option>
            <option value="Playsuits">Playsuits</option>
            <option value="Blazers & Waistcoats">Blazers & Waistcoats</option>


            

          </select>: categories === "Men's Fashion" ? 
          <select className='inputcontainerr' onClick={(event) => handlesubCat(event.target.value)} id="option">
          <option value="">Select</option>
          <option value="Hoodie">Hoodie</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Casual Shirts">Casual Shirts</option>
          <option value="Formal Shirts">Formal Shirts</option>
          <option value="Sweatshirts">Sweatshirts</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Jackets">Jackets</option>
          <option value="Coats">Coats</option>
          <option value="Suits">Suits</option>
          <option value="Jeans">Jeans</option>
          <option value="Shorts">Shorts</option>
          <option value="Track Pants & Joggers">Track Pants & Joggers</option>
          <option value="Trousers">Trousers</option>
          <option value="Men's Bages">Men's Bages</option>
          <option value="Shoes">Shoes</option>
          <option value="Sandals and Floaters">Sandals and Floaters</option>
          <option value="Socks">Socks</option>
          <option value="Personal Care & Grooming">Personal Care & Grooming</option>

        </select>: categories === "Kid's Fashion" ? 
          <select className='inputcontainerr' onClick={(event) => handlesubCat(event.target.value)} id="option">
          <option value="">Select</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Girl T-Shirts">Girl T-Shirts</option>
          <option value="Shirts">Shirts</option>
          <option value="Boy Sweaters & Sweatshirts">Boy Sweaters & Sweatshirts</option>
          <option value="Girl Sweaters & Sweatshirts">Girl Sweaters & Sweatshirts</option>
          <option value="Boy Jackets">Boy Jackets</option>
          <option value="Girl Jackets">Girl Jackets</option>
          <option value="Coats">Coats</option>
          <option value="Suits">Suits</option>
          <option value="Jeans">Jeans</option>
          <option value="Shorts">Shorts</option>
          <option value="Track Pants">Track Pants</option>
          <option value="Casual Shoes">Casual Shoes</option>
          <option value="Sandals and Floaters">Sandals and Floaters</option>
          <option value="Ethnic Wear">Ethnic Wear</option>
          <option value="Boy Nightwear & Loungewear">Boy Nightwear & Loungewear</option>
          <option value="Girl Nightwear & Loungewear">Girl Nightwear & Loungewear</option>
          <option value="Shoes">Shoes</option>
          <option value="Sandals & Heels">Sandals & Heels</option>
          <option value="Flats & Flipflops">Flats & Flipflops</option>

          <option value="Boy Clothing sets">Boy Clothing sets</option>
          <option value="Girl Clothing sets">Girl Clothing sets</option>
          <option value="Tops">Tops</option>
          <option value="Kurta Sets">Kurta Sets</option>
          <option value="Boy Party Wear">Boy Party Wear</option>
          <option value="Girl Party Wear">Girl Party Wear</option>
          <option value="Lehenge choli">Lehenge choli</option>


        </select>: <select id="option" className='inputcontainerr'>
          <option value="Select Subcategories">Select Subcategories</option>
        </select>

               }
            </div>
          </div>


        </div>

      </div>

    </div>
  )
}
