import "./pendingorder.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../Seller/components/sidebar/Sidebar";
import Topbar from "../../Seller/components/topbar/Topbar";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Pendingorder() {
  const [Products, setProducts] = useState([])
  const admin = useSelector((state)=> state.seller);
  let seller = admin;
  let accessToken = admin.currentSeller.accessToken;

  useEffect(() => {
    const getProduct = async()=>{
      try {
        const res = await axios.get('http://139.162.11.30:80/api/order/get/proccessing/userOrders', {
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

  console.log(Products.length)

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
            {params.row.orderItems.map((item)=>(
              item?.imgKey.slice(0,1).map((img)=>(
                <img src={img} alt="" className="productListiiimg" />
              ))
  
              ))}
             {params.row.orderItems.map((item)=>(
              <p>{item.title}</p>
              ))}
            </div>
          </>
        )
      }
    },
    {
      field: 'Quantity',
      headerName: 'Quantity',
      width: 140,
      renderCell: (params) => {
        return (
          <>
            <div className="productListUser">
              {params.row.orderItems.map((item)=>(
                <p>{item.quantity}</p>
              ))}
            </div>
          </>
        )
      }
    },
    {
      field: 'orderStatus',
      headerName: 'orderStatus',
      width: 140,
      renderCell: (params) => {
        return (
          <>
            <div className="productListUser">
              <p>{params.row.orderStatus}</p>
            </div>
          </>
        )
      }
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <div className="productListUser">
              {params.row.orderItems.map((item)=>(
                <p>{item.price}</p>
              ))}
            </div>
          </>
        )
      }
    },
    {
      field: "action",
      headerName: "Active",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/seller/update/pendinguser/Order/" + params.row._id}>
              <button className="productListEdit">Edit</button>
            </Link>
          </>
        )
      }
    }
  ];

  return (
    <div className="ProductList">
      <Topbar pending={Products.length} />
      <div style={{display:'flex'}}>
        <Sidebar />
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
