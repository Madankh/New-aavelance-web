import axios from "axios";
import React, {useState , useEffect} from "react";
import styled from "styled-components";
import Product from "./Product";

const Container = styled.div`
   width:100%;
   padding:10px 40px;
   margin:auto;
   display:flex;
   flex-wrap:wrap;
 
`;

const CatProducts = ({cat , filters , sort , subcat}) => {
    const [products , setProducts] = useState([]);
    const [filterProduct , setfilterProducts] = useState([]);
    console.log(cat);
    console.log(subcat)

    useEffect(() => {
      const getProducts = async ()=>{
          try {
              const res = await axios.get( subcat !== '' ? `http://192.168.18.4:5000/api/products/getallProduct?category=${cat}&subcategories=${subcat}`:  `http://192.168.18.4:5000/api/products/getallProduct?category=${cat}`);
              setProducts(res.data);
            } catch (error) {
                
            }
        }
        getProducts();
        console.log(products)

    }, [subcat])

    useEffect(()=>{
        cat && setfilterProducts(
            products.filter((item)=> 
                Object.entries(filters).every(([key , value])=>
                    item[key].includes(value)
                ) 
              )
        )
    },[products , cat , filters, subcat]);

    useEffect(()=>{
        if(sort === "newest"){
            setfilterProducts((prev)=>
            [...prev].sort((a,b)=> a.createdAt - b.createdAt));
        }else if(sort === "lower"){
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
export default CatProducts
