import axios from "axios";
import React, {useState , useEffect} from "react";
import Product from "./Product";
import "./searchProducts.css"


const SearchProducts = ({title , filters , sort}) => {
    const [products , setProducts] = useState([]);
    const [filterProduct , setfilterProducts] = useState([]);

    useEffect(() => {
      const getProducts = async ()=>{
          try {
              const res = await axios.get( title ? `http://api.aavelance.com/api/products/getallProduct?search_query=${title}`:  `http://api.aavelance.com/api/products/getallProduct`);
              setProducts(res.data);
            } catch (error) {
                
            }
        }
        getProducts();
        console.log(products)

    }, [title])

    useEffect(()=>{
        title && setfilterProducts(
            products.filter((item)=> 
                Object.entries(filters).every(([key , value])=>
                    item[key].includes(value)
                ) 
              )
        )
    },[products , title , filters]);

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
        <div className="searchProductContainer">
            {filterProduct.map((item)=>(
                 <Product propsitem={item} key={item.id}/>
                 ))}
        </div>
    )
}
export default SearchProducts
