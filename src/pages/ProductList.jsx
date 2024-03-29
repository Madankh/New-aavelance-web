import React ,{useState} from "react";
import styled from "styled-components";
import Navbar from "../component/Navbar";
import Announcement from "../component/Announcement";
import { Footer } from "../component/Footer";
import Products from "../component/Products";
import {Newsletter} from "../component/Newsletter";
import { useLocation } from "react-router-dom";

const Container = styled.div``;

const Option = styled.option``;

const ProductList = () => {
    const location = useLocation();
    console.log(location);
    const proto = (location.pathname.split("/")[2])
    const cat = proto.replaceAll("%20", " ")
    
    const [filters , setFilters] = useState({})
    const [sort , setsort] = useState("Newest")

    const handleFilters = (e) =>{
        const value = e.target.value;
        setFilters({
            ...filters,
           [e.target.name] : value,
        })
    }
    return (
        <Container>
            <Navbar/>
            <Announcement/>
            <div className="catContainer" style={{alingItem:'center' , fontSize:'12px' , marginLeft:'29%' , marginTop:'20px'}}> 
               <h2 className="catsearchTitle">{cat}</h2>
            </div>
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
                    <Option value="asc"> Price (asc)</Option>
                    <Option value="desc"> Price (desc)</Option>

                </select>
                </div>
              
            </span>
            <Products cat={cat} filters={filters} sort={sort} />
            
            <Newsletter/>
            <Footer/>
        </Container>
    )
}

export default ProductList;
