import "./productList.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProductList() {
  const [data, setdata] = useState([]);
  const [Products, setProducts] = useState([])
  const admin = useSelector((state)=> state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;

  useEffect(() => {
    const getProduct = async()=>{
      try {
        const res = await axios.get('http://172.232.73.46:80/api/products/allpro', {
          headers:{
            token: accessToken
          }
        })
        setProducts(res.data);

      } catch (error) {
        
      }
    }
    getProduct();
  }, [0])

  const handleDelete = (id) => {
    setProducts(Products.filter((item) => item._id !== id))
    axios.delete(`http://172.232.73.46:80/api/products/${id}`, {
      headers: {
        token: accessToken
      }
    });
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    {
      field: 'product',
      headerName: 'Product',
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <div className="productListUser">
              <img src={params?.row?.img[0]} alt="" className="productListimg1" />
              {params?.row?.title?.slice(0 , 55)}
            </div>
          </>
        )
      }
    },
    {
      field: 'Stock',
      headerName: 'Stock',
      width: 140,
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
            <Link to={"/sellerproduct/" + params?.row?._id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline className="productListDelete" onClick={() => handleDelete(params?.row?._id)} />
          </>
        )
      }
    }
  ];

  return (
    <div className="ProductList">
      <Topbar />
      <div style={{display:'flex'}}>
        {/* <div style={{flex:'1'}}> */}
          <Sidebar />
        {/* </div> */}
        <div style={{flex:'5' , height:"100vh"}}>
          <DataGrid
            columns={columns}
            rows={Products}
            pageSize={13}
            getRowId = {(row)=> row._id}
            rowsPerPageOptions={[6]}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>

  )
}
