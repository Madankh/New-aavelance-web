import axios from "axios";
import React, {useState , useEffect} from "react";
import styled from "styled-components";
import Product from "./Product";
import {Link} from 'react-router-dom'

const Container = styled.div`
   width:100%;
   padding:10px 0px;
   margin:auto;
   display:flex;
   flex-wrap:wrap;
 
`;

const Products = ({cat , filters , sort}) => {
    const [products , setProducts] = useState([]);
    const [filterProduct , setfilterProducts] = useState([]);
    console.log(cat)

    useEffect(() => {
      const getProducts = async ()=>{
          try {
              const res = await axios.get( cat ? `http://localhost:5000/api/products/getallProduct?subcategories=${cat}`:  `http://localhost:5000/api/products/getallProduct`);
              setProducts(res.data);
            } catch (error) {
                
            }
        }
        getProducts();
        console.log(products)

    }, [cat])

    useEffect(()=>{
        cat && setfilterProducts(
            products.filter((item)=> 
                Object.entries(filters).every(([key , value])=>
                    item[key].includes(value)
                ) 
              )
        )
    },[products , cat , filters]);

    useEffect(()=>{
        if(sort === "newest"){
            setfilterProducts((prev)=>
            [...prev].sort((a,b)=> a.createdAt - b.createdAt));
        }else if(sort === "asc"){
            setfilterProducts((prev) => 
            [...prev].sort((a , b) => a.price - b.price));
        }else{
            setfilterProducts((prev)=>
            [...prev].sort((a,b)=> b.price - a.price))
        }
    },[sort])
    return (
        <Container>
            {filterProduct.map((item)=>(
              
                 <Product propsitem={item} key={item.id}/>
                
                 ))}
        </Container>
    )
}
export default Products
