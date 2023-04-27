import { Link, useLocation } from "react-router-dom";
import Chart from "../../components/chart/Chart";
import "./Sellerproduct.css";
import { Publish } from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Topbar from "../../components/topbar/Topbar";
// import { async } from "@firebase/util";

export default function SellerProduct() {
  const [Product, setProduct] = useState([]);
  const admin = useSelector((state) => state.seller);
  let accessToken = admin.currentSeller.accessToken;
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `http://172.232.73.46:80/api/products/find/${productId}`
        );
        setProduct(res.data);
      } catch (error) {}
    };
    getProduct();
  }, [Product.length]);

  console.log(Product, "Product");
  const [file, setFile] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [productDetail, setProductDetails] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [price, setPrice] = useState();
  const [Stock, setStock] = useState();

  console.log(title , desc , productDetail , size , color , price , Stock)

  const handleColor = (e) => {
    setColor(e.target.value.split(" "));
  };

  const handleSize = (e) => {
    setSize(e.target.value.split(" "));
  };

  const handleProductDetail = (e) => {
    setProductDetails(e.target.value.split(","));
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

  const handleclick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
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
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("price", price);
    formData.append("Stock", Stock);

    await axios.put(`http://192.168.18.4:5000/api/products/${productId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', token: accessToken } }).then((data) => {
      alert(data.data)
      // window.location.reload()
    })
  };

  return (
    <div className="product">
      <Topbar/>
      <div className="product">
        <div className="productTitleContainer">
          <h1 className="productTitle">Product</h1>
          <Link to="/newProductAdmin">
            <button className="productAddButton">Create</button>
          </Link>
        </div>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            {Product?.img?.slice(0, 1).map((item) => (
              <img src={item} alt="" className="productInfooImage" />
            ))}
            <span className="productName">{Product?.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue" style={{ marginLeft: "90px" }}>
                {Product._id}
              </span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales</span>
              <span className="productInfoValue">123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">action</span>
              <span className="productInfoValue">yes</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock</span>
              <span className="productInfoValue">{Product.Stock}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="productButtom">
        <form className="productForm">
          <div className="productFormLeft">
            <div className="addProductItem">
              <label>Product Title</label>
              <input className="inputnames"
                name="title"
                type="text"
                placeholder="Product Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="addProductItem">
              <label>Description</label>
              <textarea className="inputnames"
                name="desc"
                type="textare"
                placeholder="Product Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="addProductDescription">
              <label className="laberdesc">Product details</label>
              <textarea
                className="inputnames"
                type="textarea"
                placeholder="Product details"
                onChange={handleProductDetail}
              />
            </div>

            <div className="addProductItem">
              <label>Size</label>
              <input className="inputnames"
                name="size"
                type="textare"
                placeholder="Size"
                onChange={handleSize}
              />
            </div>

            <div className="addProductItem">
              <label>Color</label>
              <input className="inputnames"
                name="color"
                type="textare"
                placeholder="Color"
                onChange={handleColor}
              />
            </div>

            <div className="addProductItem">
              <label>Price</label>
              <input className="inputnames"
                name="price"
                type="textare"
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="addProductItem">
              <label>Stock</label>
              <input className="inputnames"
                name="Stock"
                type="text"
                
                placeholder="Stock"
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              {Product?.img?.slice(0, 1).map((item) => (
                <img src={item} alt="" className="productUploadImgg" />
              ))}
              <label for="file">
                <Publish
                  style={{ marginTop: "190px", width: 50, height: 30 }}
                />
                <input className="inputnames"
                  id="file"
                  type="file"
                  multiple
                  onChange={handleImage}
                  style={{ display: "none" }}
                />
              </label>
              <input className="inputnames" type="file" id="file" style={{ display: "none" }} />
            </div>
            <button
              className="productButton"
              onClick={handleclick}
              disabled={
                title === "" ||
                desc === "" ||
                productDetail === "" ||
                size === "" ||
                color === "" ||
                price === "" ||
                Stock === ""
                  ? true
                  : ""
              }
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
