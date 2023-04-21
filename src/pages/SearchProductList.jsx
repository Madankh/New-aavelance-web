import React ,{useState} from "react";
import styled from "styled-components";
import Navbar from "../component/Navbar";
import Announcement from "../component/Announcement";
import { Footer } from "../component/Footer";
import SearchProducts from "../component/SearchProducts";
import {Newsletter} from "../component/Newsletter";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import "./searchproductlist.css"

const Select = styled.select`
   padding:10px;
   margin-right:10px;
   ${mobile({margin:"8px 0px"})}
`;
const Option = styled.option``;

const SearchProductList = () => {
    const location = useLocation();
    const proto = (location.pathname.split("/")[3]);
    const title = proto.replaceAll("%20", " ");
    
    const [filters , setFilters] = useState({});
    const [sort , setsort] = useState("Newest");
    const handleFilters = (e) =>{
        const value = e.target.value;
        setFilters({
            ...filters,
           [e.target.name] : value,
        })
    }
    return (
        <div className="SearchContainer">
            <Navbar/>
            <Announcement/>
            <div style={{alingItem:'center' , fontSize:'16px' , marginLeft:'45%' , marginTop:'20px'}}> 
               <h1 className="searchTitle">Results</h1>
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
            <SearchProducts title={title} filters={filters} sort={sort} />
            <Newsletter/>
            <Footer/>
        </div>
    )
}

export default SearchProductList;
