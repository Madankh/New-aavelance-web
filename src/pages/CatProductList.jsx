import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../component/Navbar";
import Announcement from "../component/Announcement";
import { Footer } from "../component/Footer";
import CatProducts from "../component/CatProducts";
import { Newsletter } from "../component/Newsletter";
import { useLocation } from "react-router-dom";
import "./CatProductList.css";
import { Beauty, Book, KidFashio, MenFashion, WomenFashion } from "./subcatdata";
const Container = styled.div`
overflow: hidden;
`;

const Option = styled.option``;

const CatProductList = () => {
    const location = useLocation();
    console.log(location);
    const proto = (location.pathname.split("/")[3])
    const cat = proto.replaceAll("%20", " ");
    const [subcat , setsubcat] = useState('');

    const [filters, setFilters] = useState({})
    const [sort, setsort] = useState("Newest")
    
    const handleChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;
        if(value !== '' && isChecked == true){
            setsubcat(value)
        }else{
            setsubcat('');
        }
      };

      const handlemobile = (value)=>{
        if(value !== "Show All"){
            setsubcat(value);
        }else{
            setsubcat('')
        }
      }

    const handleFilters = (e) => {
        const value = e.target.value;
        setFilters({
            ...filters,
            [e.target.name]: value,
        })
    }
    return (
        <Container>
            <Navbar />
            <Announcement />
            <div className="catContainer" style={{ alingItem: 'center', fontSize: '12px', marginLeft: '29%', marginTop: '20px' }}>
                <h2 className="catsearchTitle">{cat}</h2>
            </div>
                <div className="submobilecat">
                    {cat == "Women's Fashion" ? WomenFashion.map((item)=>(
                    <div className="submobileitems" style={{marginLeft:"10px" , alignItems:"center"}} onClick={()=>handlemobile(item.value)}>
                        <img src={`${item?.img}`} className="subcatmobileimage" alt="" />
                        <p className="subcatmobiletitle" style={{width:"110%" , fontSize:"10px" , textAlign:"start" , marginLeft:"-10px"}}>{item.value}</p>
                    </div>
                    )): cat == "Men's Fashion" ? MenFashion.map((item)=>(
                        <div className="submobileitems" style={{marginLeft:"10px" , alignItems:"center"}}>
                            <img src={`${item?.img}`} className="subcatmobileimage" alt="" />
                            <p className="subcatmobiletitle" style={{width:"110%" , fontSize:"10px" , textAlign:"start" , marginLeft:"-10px"}}>{item.value}</p>
                        </div>
                    )): cat == "Kid's Fashion" ? KidFashio.map((item)=>(
                        <div className="submobileitems" style={{marginLeft:"10px" , alignItems:"center"}}>
                            <img src={`${item?.img}`} className="subcatmobileimage" alt="" />
                            <p className="subcatmobiletitle" style={{width:"110%" , fontSize:"10px" , textAlign:"start" , marginLeft:"-10px"}}>{item.value}</p>
                        </div>
                    )): cat == "Beauty and Personal Care" ? Beauty.map((item)=>(
                        <div className="submobileitems" style={{marginLeft:"10px" , alignItems:"center"}}>
                            <img src={`${item?.img}`} className="subcatmobileimage" alt="" />
                            <p className="subcatmobiletitle" style={{width:"110%" , fontSize:"10px" , textAlign:"center" , marginLeft:"-10px"}}>{item.value}</p>
                        </div>
                    )) : cat == "Books" ? Book.map((item)=>(
                        <div className="submobileitems" style={{marginLeft:"10px" , alignItems:"center"}}>
                            <img src={`${item?.img}`} className="subcatmobileimage" alt="" />
                            <p className="subcatmobiletitle" style={{width:"110%" , fontSize:"10px" , textAlign:"start" , marginLeft:"-10px"}}>{item.value}</p>
                        </div>
                    )) :"" }
                </div>
            <div className="flexContainer">
                <div className="left">
                    <div className="filterItem">
                        <h4 className="catTitle2">Product Subcategories</h4>
                        {cat == "Women's Fashion" ? WomenFashion?.map((item) => (
                            <div className="inputItem" key={item.id}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    value={item.value}
                                    onChange={handleChange}
                                />
                                <label htmlFor={item.value} className="inputname">{item.value}</label>
                            </div>
                         )) : cat == "Men's Fashion" ? MenFashion?.map((item) => (
                            <div className="inputItem" key={item.id}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    value={item.value}
                                    onChange={handleChange}
                                />
                                <label htmlFor={item.value} className="inputname">{item.value}</label>
                            </div>
                         )) : cat == "Kid's Fashion" ? KidFashio?.map((item) => (
                            <div className="inputItem" key={item.id}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    value={item.value}
                                    onChange={handleChange}
                                />
                                <label htmlFor={item.value} className="inputname">{item.value}</label>
                            </div>
                         )): cat == "Books" ? Book?.map((item) => (
                            <div className="inputItem" key={item.id}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    value={item.value}
                                    onChange={handleChange}
                                />
                                <label htmlFor={item.value} className="inputname">{item.value}</label>
                            </div>
                         )): cat == "Beauty and Personal Care" ? Beauty?.map((item) => (
                            <div className="inputItem" key={item.id}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    value={item.value}
                                    onChange={handleChange}
                                />
                                <label htmlFor={item.value} className="inputname">{item.value}</label>
                            </div>
                         )): ""}
                    </div>
                    {/* <div className="filterItem">
                        <h2>Filter by price</h2>
                        <div className="inputItem">
                            <span>0</span>
                            <input
                                type="range"
                                min={0}
                                max={1000}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                            <span>{maxPrice}</span>
                        </div>
                    </div> */}
                    {/* <div className="filterItem">
                        <h2>Sort by</h2>
                        <div className="inputItem">
                            <input
                                type="radio"
                                id="asc"
                                value="asc"
                                name="price"
                                onChange={(e) => setSort("asc")}
                            />
                            <label htmlFor="asc">Price (Lowest first)</label>
                        </div>
                        <div className="inputItem">
                            <input
                                type="radio"
                                id="desc"
                                value="desc"
                                name="price"
                                onChange={(e) => setSort("desc")}
                            />
                            <label htmlFor="desc">Price (Highest first)</label>
                        </div>
                    </div> */}
                </div>

                <div className="rightSide">
                    <span className="FilterContainer">
                        <div className="Filter"><div className="FilterText">Filter Products:</div>
                            <select className="select" onChange={handleFilters} name="color">
                                <Option disabled>Color</Option>
                                <Option>white</Option>
                                <Option>black</Option>
                                <Option>red</Option>
                                <Option>blue</Option>
                                <Option>yellow</Option>
                                <Option>green</Option>
                            </select>
                            <select className="select" onChange={handleFilters} name="size">
                                <Option disabled>Size</Option>
                                <Option>XS</Option>
                                <Option>S</Option>
                                <Option>M</Option>
                                <Option>L</Option>
                                <Option>XL</Option>
                            </select>
                        </div>
                        <div className="Filter"><div className="FilterText">Price range:</div>
                            <select className="select" onChange={(e) => setsort(e.target.value)}>
                                <Option value="newest">Newest</Option>
                                <Option value="lower"> Price (lower)</Option>
                                <Option value="higher"> Price (higher)</Option>

                            </select>
                        </div>

                    </span>
                    <CatProducts cat={cat} subcat={subcat} filters={filters} sort={sort} />

                </div>
            </div>
            <Newsletter />
            <Footer />
        </Container>
    )
}

export default CatProductList;
