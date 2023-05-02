import "./sellerproductList.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { ProductRows } from "../dummydata";
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerProductList() {
  const [Products , SetProducts] = useState([])
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  console.log(id);

  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  useEffect(() => {
    const Products = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/seller/product/by/${id}`, {
          headers: {
            token: accessToken
          }
        })
        SetProducts(res.data);
      } catch (error) {

      }
    }
    Products();
  }, []);

  console.log(Products)

  const [data , setdata] = useState(Products);
  console.log(Products , "seller products")
  console.log(data , "data")

  const handleDelete = (id)=>{
    setdata(data.filter((item)=> item.id !== id))
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 190 },
    {
      field: 'title',
      headerName: 'Product',
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListUser">
            {/* <img src={params.row.img} alt="" className="productListimg" /> */}
            {params.row.title}
          </div>
        )
      }
    },
    {
      field: 'Stock',
      headerName: 'Stock',
      width: 250,
      editable: false,
    },
   
    {
      field: 'price',
      headerName: 'Price',
      width: 160,
      editable: false,
    },
    {
      field: "action",
      headerName: "Active",
      width: 150,
      renderCell: (params) => {
        return (
          <>
          {/* <Link>
            <button className="productListEdit">Edit</button>
          </Link> */}
            <DeleteOutline className="productListDelete" onClick={()=>handleDelete(params.row._id)}/>
          </>
        )
      }
    }
  ];
  
  return (
    <div className="ProductList">
      <DataGrid
        rows={Products}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        getRowId = {(row)=> row._id}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>

  )
}
