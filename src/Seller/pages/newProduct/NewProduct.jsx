import Sidebar from '../../../Seller/components/sidebar/Sidebar'
import './newProduct.css'
import Topbar from './../../components/topbar/Topbar'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import addimag from "../newProduct/add-product.png"
import axios from 'axios';
export default function NewProduct() {
  const admin = useSelector((state)=> state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;

  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState([]);
  const [cat , setCat] = useState([]);
  const [subcat , setsubCat] = useState('');
  const [size , setSize] = useState([]);
  const [color , setColor] = useState([]);

  const [brand, setbrand] = useState('');
  const [Manufacturer, setManufacturer] = useState('');
  const [ASIN, setASIN] = useState('');
  const [Item_model_number, setItem_model_number] = useState('');
  const [Skin_Type , setSkin_Type ] = useState('');
  const [Product_Dimensions, setProduct_Dimensions] = useState('');
  const [Date_First_Available , setDate_First_Available] = useState('');
  const [Skin_Tone , setSkin_Tone] = useState('');
  const [Age_Range , setAge_Range] = useState('');
  const [Product_Benefits , setProduct_Benefits] = useState('');
  const [Material_Type_Free , setMaterial_Type_Free] = useState('');
  const [Scent , setScent] = useState('');
  const [Liquid_Volume , setLiquid_Volume] = useState('');
  const [Item_Weight , setItem_Weight] = useState('');
  const [Publisher , setPublisher] = useState('');
  const [Language , setLanguage] = useState('');
  const [Liquid_Type , setLiquid_Type] = useState('');
  const [Material, setMaterial] = useState('');  
  const [Hair_Type, setHair_Type] = useState('');
  const [Country_of_origin, setCountry_of_origin] = useState('');
  const [productDetail , setProductDetail] = useState([]);
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setInputs(prev => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }
  const handleColor=(e)=> {
    setColor(e.target.value.split(" "));
  };
  const handleProductDetail=(e)=> {
    setProductDetail(e.target.value.split(","));
  };

  const handleSize=(e)=> {
    setSize(e.target.value.split(" "));
  };
  const [ImagePre , setImagePre] = useState(null);
  const handleImage = (e)=>{
    for(let i = 0; i < e.target.files.length; i++){
      const newImage = e.target.files[i];
      setImagePre(URL.createObjectURL(e.target.files[0]))
      newImage["id"] = Math.random();
      setFile((prev)=>[...prev , newImage]);
    }
  };


  console.log(file);


  function handleCat(value) {
    setCat(value)
  }

  function handlesubCat(value){
    setsubCat(value)
  }

  console.log(color.length)


  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in inputs) {
      formData.append(key, inputs[key]);
    }
    for(let i = 0 ; i < file.length ; i++){
      formData.append("img", file[i]);
    }

    for(let i = 0 ; i < color.length ; i++){
      formData.append("color", color[i]);
    }

    for(let i = 0 ; i < size.length ; i++){
      formData.append("size", size[i]);
    }

    for(let i = 0; i < productDetail.length; i++){
      formData.append("productDetail", productDetail[i]);
    }

    // formData.append("img" , file[0])
    formData.append("brand", brand);
    formData.append("Manufacturer", Manufacturer);
    formData.append("ASIN", ASIN);
    formData.append("Country_of_origin", Country_of_origin);
    formData.append("Item_model_number", Item_model_number);
    formData.append("Product_Dimensions", Product_Dimensions);
    formData.append("Material", Material);
    formData.append("subcategories", subcat);
    formData.append("Publisher", Publisher);
    formData.append("Language", Language);
    formData.append("Date_First_Available", Date_First_Available);
    formData.append("Skin_Tone", Skin_Tone);
    formData.append("Age_Range", Age_Range);
    formData.append("Product_Benefits", Product_Benefits);
    formData.append("Material_Type_Free", Material_Type_Free);
    formData.append("Scent", Scent);
    formData.append("Liquid_Volume", Liquid_Volume);
    formData.append("Liquid_Type", Liquid_Type);
    formData.append("Item_Weight", Item_Weight);
    formData.append("categories", cat);

    formData.append("Hair_Type", Hair_Type);
    formData.append("Skin_Type", Skin_Type);
    await axios.post("http://139.162.11.30:80/api/products/product", formData, { headers: { 'Content-Type': 'multipart/form-data', token: accessToken } }).then(() => {
      alert("You successfully upload product")
      // window.location.reload()
    })

  };

  return (
    <>
      <Topbar />
      <div className='maincontainer'>
          <Sidebar />
        <div style={{flex:5, marginLeft:10}}>
          <div className="newProduct">
            <h1 className="addProductTitle">New Product</h1>
            <form className="addProductForm" onSubmit={handleSubmit}>
              <div className="addProductItem">
                <label>Image</label>
                
                {/* <input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
                <input className='inputcontainer' id="file" multiple type="file" onChange={handleImage} />
                {ImagePre !== null ? 
                <img src={ImagePre} alt="" className='ProductUploadingImage' />:<img src={addimag} className='ProductUploadingImage' alt="" />
                }
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Product title</label>
                <textarea className='inputcontainer' name='title' type="textarea"  placeholder="Product title" onChange={handleChange} />
              </div>
              <div className="addProductDescription">
                <label className='laberdesc'>Description</label>
                <textarea className='inputcontainer' name='desc' type="textarea" placeholder="Product Description" onChange={handleChange} />
              </div>

              <div className="addProductDescription">
                <label className='laberdesc'>Product details</label>
                <textarea className='inputcontainer' type="textarea" placeholder="Product details" onChange={handleProductDetail} />
              </div>

              <div className="addProductItem">
              <label className='laberdesc'>Categories</label>
              <select className='inputcontainer' onClick={(event) => handleCat(event.target.value)} name="Categories" id="option">
                <option value="">Select Categories</option>
                <option value="Books">Books</option>
                <option value="Beauty and Personal Care">Beauty and Personal Care</option>
                <option value="Women's Fashion">Women's Fashion</option>
                <option value="Men's Fashion">Men's Fashion</option>
                <option value="Kid's Fashion">Kid's Fashion</option>  
              </select>
            </div>


            <div className="addProductItem">
              <label>Subcategories</label>
              {cat === "Books" ? 
              <select className='inputcontainerr' onClick={(event) => handlesubCat(event.target.value)} id="option">
                <option value="">Select</option>
                <option value="Self help">Self help</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Spiritual">Spiritual</option>
                <option value="computer and programming">Computer and programming</option>
                <option value="Story">Story</option>
                
                

              </select>: cat === "Beauty and Personal Care" ?
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

              

            </select>: cat === "Women's Fashion" ? 
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


            

          </select>: cat === "Men's Fashion" ? 
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

        </select>: cat === "Kid's Fashion" ? 
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
            {subcat === 'Self help' || subcat === 'Business' || subcat === 'Computer science' || subcat === 'Finance' || subcat === 'Story' || subcat === 'Management' || subcat === 'Spiritual' ? <div>
              <div className="addProductItem">
                 <label className='laberdesc'>Publisher</label>
                 <input className='inputcontainer' type="text" placeholder="Publisher" onChange={(e)=>setPublisher(e.target.value)} />
               </div>
               <div className="addProductItem">
                 <label className='laberdesc'>Language</label>
                 <input className='inputcontainer' type="text" placeholder="Language" onChange={(e)=>setLanguage(e.target.value)} />
               </div>
               <div className="addProductItem">
                 <label className='Item-Weight'>Item-Weight</label>
                 <input className='inputcontainer' type="text" placeholder="Country of origin" onChange={(e)=>setItem_Weight(e.target.value)} />
               </div>
               
             </div> : subcat === 'Hoodie' || subcat === 'Shirts' || subcat === 'T-Shirts' || subcat === 'Casual Shirts' || subcat === 'Formal Shirts' || subcat === 'Sweatshirts' || subcat === 'Sweaters' || subcat === 'Jackets' || subcat === 'Coats' || subcat === 'Suits' || subcat === 'Jeans' || subcat === 'Shorts' || subcat === 'Track Pants & Joggers' || subcat === 'Trousers' || subcat === 'Shoes'|| subcat === 'Sandals and Floaters' || subcat === 'Socks' ? <div>
            
             <div className="addProductItem">
                 <label className='laberdesc'>Brand</label>
                 <input className='inputcontainer' type="text" placeholder="Brand" onChange={(e)=>setbrand(e.target.value)} />
               </div>
               <div className="addProductItem">
                 <label className='laberdesc'>Material</label>
                 <input className='inputcontainer' type="text" placeholder="Material" onChange={(e)=>setMaterial(e.target.value)} />
               </div>

               <div className="addProductItem">
                <label className='laberdesc'>Size</label>
                <input className='inputcontainer' type="text" placeholder="Size"  onChange={handleSize} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Color</label>
                <input className='inputcontainer' type="text" placeholder="Color" onChange={handleColor} />
              </div>

               <div className="addProductItem">
                 <label className='laberdesc'>Date First Available</label>
                 <input className='inputcontainer' type="text" placeholder="Date First Available" onChange={(e)=>setDate_First_Available(e.target.value)} />
               </div>

               <div className="addProductItem">
                 <label className='laberdesc'>Manufacturer</label>
                 <input className='inputcontainer' type="text" placeholder="Manufacturer" onChange={(e)=>setManufacturer(e.target.value)} />
               </div>

               <div className="addProductItem">
                 <label className='laberdesc'>Country of origin</label>
                 <input className='inputcontainer' type="text" placeholder="Country of origin" onChange={(e)=>setCountry_of_origin(e.target.value)} />
               </div>

               <div className="addProductItem">
                 <label className='laberdesc'>ASIN</label>
                 <input className='inputcontainer' type="text" placeholder="ASIN" onChange={(e)=>setASIN(e.target.value)} />
               </div>

               <div className="addProductItem">
                 <label className='laberdesc'>Item model number</label>
                 <input className='inputcontainer' type="text" placeholder="Item model number" onChange={(e)=>setItem_model_number(e.target.value)} />
               </div>

               <div className="addProductItem">
                 <label className='laberdesc'>Product Dimensions</label>
                 <input className='inputcontainer' type="text" placeholder="Product Dimensions" onChange={(e)=>setProduct_Dimensions(e.target.value)} />
               </div>
              
             </div> : subcat === "Women's Bages" || subcat === 'Kurtas & Suits' || subcat === 'Shirts'  || subcat === 'Sarees' || subcat === 'Jeans' || subcat === 'Shorts & Skirts' || subcat === 'Flats' || subcat === 'Coats' || subcat === 'Heels' || subcat === 'Boots' || subcat === 'Sleepwear & Loungewear' || subcat === 'Tops' || subcat === 'Co-ords' || subcat === 'Playsuits'|| subcat === 'Blazers & Waistcoats' || subcat === 'Sweatshirts & Sweaters' ? <div>
            
            <div className="addProductItem">
                <label className='laberdesc'>Brand</label>
                <input className='inputcontainer' type="text" placeholder="Brand" onChange={(e)=>setbrand(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Material</label>
                <input className='inputcontainer' type="text" placeholder="Material" onChange={(e)=>setMaterial(e.target.value)} />
              </div>

              <div className="addProductItem">
               <label className='laberdesc'>Size</label>
               <input className='inputcontainer' type="text" placeholder="Size"  onChange={handleSize} />
             </div>

             <div className="addProductItem">
               <label className='laberdesc'>Color</label>
               <input className='inputcontainer' type="text" placeholder="Color" onChange={handleColor} />
             </div>

              <div className="addProductItem">
                <label className='laberdesc'>Date First Available</label>
                <input className='inputcontainer' type="text" placeholder="Date First Available" onChange={(e)=>setDate_First_Available(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Manufacturer</label>
                <input className='inputcontainer' type="text" placeholder="Manufacturer" onChange={(e)=>setManufacturer(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Country of origin</label>
                <input className='inputcontainer' type="text" placeholder="Country of origin" onChange={(e)=>setCountry_of_origin(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>ASIN</label>
                <input className='inputcontainer' type="text" placeholder="ASIN" onChange={(e)=>setASIN(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Item model number</label>
                <input className='inputcontainer' type="text" placeholder="Item model number" onChange={(e)=>setItem_model_number(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Product Dimensions</label>
                <input className='inputcontainer' type="text" placeholder="Product Dimensions" onChange={(e)=>setProduct_Dimensions(e.target.value)} />
              </div>
             
            </div> : subcat === 'Girl T-Shirts' || subcat === 'Boy Sweaters & Sweatshirts' || subcat === 'Girl Sweaters & Sweatshirts' || subcat === 'Boy Jackets' || subcat === 'Girl Jackets' || subcat === 'Shorts' || subcat === 'Track Pants' || subcat === 'Sandals and Floaters' || subcat === 'Ethnic Wear' || subcat === 'Boy Nightwear & Loungewear' || subcat === 'Girl Nightwear & Loungewear' || subcat === 'Sandals & Heels' || subcat === 'Flats & Flipflops' || subcat === 'Boy Clothing sets'|| subcat === 'Girl Clothing sets' || subcat === 'Kurta Sets' || subcat === 'Boy Party Wear' || subcat === 'Girl Party Wear' || subcat === 'Lehenge choli' ? <div>
               
            <div className="addProductItem">
                <label className='laberdesc'>Brand</label>
                <input className='inputcontainer' type="text" placeholder="Brand" onChange={(e)=>setbrand(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Material</label>
                <input className='inputcontainer' type="text" placeholder="Material" onChange={(e)=>setMaterial(e.target.value)} />
              </div>

              <div className="addProductItem">
               <label className='laberdesc'>Size</label>
               <input className='inputcontainer' type="text" placeholder="Size"  onChange={handleSize} />
             </div>

             <div className="addProductItem">
               <label className='laberdesc'>Color</label>
               <input className='inputcontainer' type="text" placeholder="Color" onChange={handleColor} />
             </div>

              <div className="addProductItem">
                <label className='laberdesc'>Date First Available</label>
                <input className='inputcontainer' type="text" placeholder="Date First Available" onChange={(e)=>setDate_First_Available(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Manufacturer</label>
                <input className='inputcontainer' type="text" placeholder="Manufacturer" onChange={(e)=>setManufacturer(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Country of origin</label>
                <input className='inputcontainer' type="text" placeholder="Country of origin" onChange={(e)=>setCountry_of_origin(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>ASIN</label>
                <input className='inputcontainer' type="text" placeholder="ASIN" onChange={(e)=>setASIN(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Item model number</label>
                <input className='inputcontainer' type="text" placeholder="Item model number" onChange={(e)=>setItem_model_number(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Product Dimensions</label>
                <input className='inputcontainer' type="text" placeholder="Product Dimensions" onChange={(e)=>setProduct_Dimensions(e.target.value)} />
              </div>


             </div>: subcat === 'Lipstick' || subcat === 'Lip Gloss' || subcat === "Hand Cream"  || subcat === 'Makeup Kit' || subcat === 'Lip Liner' || subcat === 'Mascara'  || subcat === 'Eyeliner' || subcat === 'Kajal' || subcat === 'Foundation'  || subcat === 'Nail Polish' || subcat === 'Face Moisturiser' || subcat === 'Cleanser'  || subcat === 'Face Wash & Eye Cream' || subcat === 'Sunscreen' || subcat === 'Lip Balm'  || subcat === 'Body Lotion' || subcat === 'Body Wash' || subcat === 'Fragrances' ||  subcat === "Men's Grooming" || subcat === 'Lip Gloss' || subcat === 'Concealer' || subcat === 'Compact' || subcat === "Baby Care" || subcat === "Skin Care" ?<div>
             <div className="addProductItem">
                <label className='laberdesc'>Brand</label>
                <input className='inputcontainer' type="text" placeholder="Brand" onChange={(e)=>setbrand(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Skin Type</label>
                <input className='inputcontainer' type="text" placeholder="Skin Type" onChange={(e)=>setSkin_Type(e.target.value)} />
              </div>

             <div className="addProductItem">
               <label className='laberdesc'>Color</label>
               <input className='inputcontainer' type="text" placeholder="Color" onChange={handleColor} />
             </div>

              <div className="addProductItem">
                <label className='laberdesc'>Skin Tone</label>
                <input className='inputcontainer' type="text" placeholder="Skin Tone" onChange={(e)=>setSkin_Tone(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Product Dimensions</label>
                <input className='inputcontainer' type="text" placeholder="Product Dimensions" onChange={(e)=>setProduct_Dimensions(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Item model number </label>
                <input className='inputcontainer' type="text" placeholder="Item model number " onChange={(e)=>setItem_model_number(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Age Range</label>
                <input className='inputcontainer' type="text" placeholder="Age Range" onChange={(e)=>setAge_Range(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>ASIN</label>
                <input className='inputcontainer' type="text" placeholder="ASIN" onChange={(e)=>setASIN(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Manufacturer</label>
                <input className='inputcontainer' type="text" placeholder="Manufacturer" onChange={(e)=>setManufacturer(e.target.value)} />
              </div>

             </div>: subcat === 'Shampoo' || subcat === 'Hair Cream' || subcat === 'Hair Oil'  || subcat === 'Hair Gel' || subcat === 'Hair Color' || subcat === 'Hair Accessory'  || subcat === 'Conditioner' || subcat === 'Hair Serum' || subcat === 'Hair Care' ? <div>
             <div className="addProductItem">
                <label className='laberdesc'>Brand</label>
                <input className='inputcontainer' type="text" placeholder="Brand" onChange={(e)=>setbrand(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Product Benefits</label>
                <input className='inputcontainer' type="text" placeholder="Product Benefits" onChange={(e)=>setProduct_Benefits(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Hair Type</label>
                <input className='inputcontainer' type="text" placeholder="Hair Type" onChange={(e)=>setHair_Type(e.target.value)} />
              </div>

             <div className="addProductItem">
               <label className='laberdesc'>Color</label>
               <input className='inputcontainer' type="text" placeholder="Color" onChange={handleColor} />
             </div>

              <div className="addProductItem">
                <label className='laberdesc'>Material Type Free</label>
                <input className='inputcontainer' type="text" placeholder="Material Type Free" onChange={(e)=>setMaterial_Type_Free(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Liquid Type</label>
                <input className='inputcontainer' type="text" placeholder="Liquid Type" onChange={(e)=>setLiquid_Type(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Liquid Volume </label>
                <input className='inputcontainer' type="text" placeholder="Liquid Volume" onChange={(e)=>setLiquid_Volume(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Item Weight</label>
                <input className='inputcontainer' type="text" placeholder="Item Weight" onChange={(e)=>setItem_Weight(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>Item model number </label>
                <input className='inputcontainer' type="text" placeholder="Item model number " onChange={(e)=>setItem_model_number(e.target.value)} />
              </div>
              <div className="addProductItem">
                <label className='laberdesc'>ASIN</label>
                <input className='inputcontainer' type="text" placeholder="ASIN" onChange={(e)=>setASIN(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Manufacturer</label>
                <input className='inputcontainer' type="text" placeholder="Manufacturer" onChange={(e)=>setManufacturer(e.target.value)} />
              </div>

              <div className="addProductItem">
                <label className='laberdesc'>Product Dimensions</label>
                <input className='inputcontainer' type="text" placeholder="Product Dimensions" onChange={(e)=>setProduct_Dimensions(e.target.value)} />
              </div>
             </div> :"" }

              <div className="addProductItem">
                <label className='laberdesc'>Actual price</label>
                <input className='inputcontainer' name='price' type="text" placeholder="Price" onChange={handleChange} />
              </div>
              {/* <div className="addProductItem">
                <label className='laberdesc'>Your price</label>
                <input className='inputcontainer' name='Your price' type="text" placeholder="Price" onChange={handleChange} />
              </div> */}
              <div className="addProductItem">
                <label className='laberdesc'>Stock</label>
                <input className='inputcontainer' name='Stock' type="text" placeholder="123" onChange={handleChange} />
              </div>
              <button onClick={handleSubmit}  disabled={size ===''  || cat.length === 0 || subcat.length === 0 || color === ''  ? true : ''} className="addProductButton" type="submit">Create</button>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}
