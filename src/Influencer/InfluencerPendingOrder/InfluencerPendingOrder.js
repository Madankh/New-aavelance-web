import "./InfluencerPendingOrder.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../Influencer/components/sidebar/Sidebar";
import Topbar from "../../Influencer/components/topbar/Topbar";
import axios from "axios";
import { useSelector } from "react-redux";

export default function InfluencerPendingOrder() {
  const [Products, setProducts] = useState([])
  const influencer = useSelector((state) => state.influencer);
  // let  = admin;
  let accessToken = influencer.currentInfluencer.accessToken;
  console.log(accessToken);

  useEffect(() => {
    const getProduct = async()=>{
      try {
        const res = await axios.get('http://localhost:5000/api/order/get/affid/proccessing/userOrders', {
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

  console.log(Products)

  // const handleDelete = (id) => {
  //   setProducts(Products.filter((item) => item._id !== id))
  //   axios.delete(`http://localhost:5000/api/products/${id}`, {
  //     headers: {
  //       token: accessToken
  //     }
  //   });
  // }

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
              <img src={item.img} alt="" className="productListimg" />
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
            
            {/* <DeleteOutline className="productListDelete" onClick={() => handleDelete(params.row._id)} /> */}
          </>
        )
      }
    }
  ];

  return (
    <div className="ProductList">
      <Topbar pending={Products.length} />
      <div style={{display:'flex'}}>
        <div style={{flex:'1'}}>
          <Sidebar />
        </div>
        <div style={{flex:'5'}}>
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
