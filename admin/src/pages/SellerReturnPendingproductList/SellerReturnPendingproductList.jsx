import "./SellerReturnPendingproductList.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { ProductRows } from "../dummydata";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerReturnPendingproductList() {
  // const [data , setdata] = useState(ProductRows);

  const [returnproduct , setreturnproduct] = useState([])
  const [data , setdata] = useState(returnproduct);
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  console.log(id);
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"

  useEffect(() => {
    const pendingorder = async () => {
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/get/return/userOrders/${id}`, {
          headers: {
            token: accessToken
          }
        })
        setreturnproduct(res.data);
      } catch (error) {

      }
    }
    pendingorder();
  }, [0]);
  console.log(returnproduct)


  const handleDelete = (id)=>{
    setdata(data.filter((item)=> item.id !== id))
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'product',
      headerName: 'Product',
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListUser">
            <img src={params.row.image} alt="" className="productListimg" />
            {params.row.name}
          </div>
        )
      }
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 250,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
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
            <Link to={"/seller/return/order/changeorder/status"}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline className="productListDelete" onClick={()=>handleDelete(params.row.id)}/>
          </>
        )
      }
    }
  ];
  
  return (
    <div className="ProductList">
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>

  )
}
