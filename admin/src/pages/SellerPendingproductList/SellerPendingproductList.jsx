import "./sellerpendingproductList.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { ProductRows } from "../dummydata";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerPendingproductList() {
  const [pendingproduct , setPendingproduct] = useState([])
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  console.log(id);
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"

  useEffect(() => {
    const pendingProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/main/get/pending/userOrders/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setPendingproduct(res.data);
      } catch (error) {

      }
    }
    pendingProducts();
  }, []);

console.log(id)
console.log(pendingproduct)

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'product Image',
      headerName: 'Product Image',
      width: 180,
      renderCell: (params) => {
        return (
          <div className="productListUser">
          {params.row.orderItems.map((item)=>(
            <img src={item.img} alt="" className="productListimg" />
            ))}
           
          </div>
        )
      }
    },

    {
      field: 'Title',
      headerName: 'Title',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListUser">
           {params.row.orderItems.map((item)=>(
            <p>{item.title}</p>
            ))}
          </div>
        )
      }
    },

    {
      field: 'Price',
      headerName: 'Price',
      width:130,
      renderCell: (params) => {
        return (
          <div className="productListUser">
            {params.row.orderItems.map((item)=>(
            <p>{item.price}</p>
            ))}



          </div>
        )
      }
    },

    {
      field: 'orderStatus',
      headerName: 'orderStatus',
      width:230,
      renderCell: (params) => {
        return (
          <div className="productListUser">
            <p>{params.row.orderStatus}</p>




          </div>
        )
      }
    },


    {
      field: 'quantity',
      headerName: 'quantity',
      width:130,
      renderCell: (params) => {
        return (
          <div className="productListUser">
            {params.row.orderItems.map((item)=>(
            <p>{item.quantity}</p>
            ))}



          </div>
        )
      }
    },


    {
      field: 'Total_amount',
      headerName: 'Total_amount',
      width: 170,
      editable: false,
    },
    {
      field: 'username',
      headerName: 'username',
      width: 120,
      editable: false,
    },
    {
      field: 'PaymentMethods',
      headerName: 'PaymentMethods',
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
            <Link to={`/seller/pending/order/changeorder/status/${params.row._id}`}>
              <button className="productListEdit">Edit</button>
            </Link>
            {/* <DeleteOutline className="productListDelete" onClick={()=>handleDelete(params.row.id)}/> */}
          </>
        )
      }
    }
  ];
  
  return (
    <div className="ProductList">
      <DataGrid
        rows={pendingproduct}
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
