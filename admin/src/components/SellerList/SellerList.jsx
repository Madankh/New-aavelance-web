import "./userList.css";
import axios from "axios";
import { DataGrid } from '@material-ui/data-grid';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
export default function SellerList() {
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`http://localhost:5000/api/main/seller`, {
          headers:{
            token: accessToken
          }
        })
        setdata(res.data);
      } catch (error) { 
      }
    }
    getOrder();
  }, [])


const columns = [
  { field: '_id', headerName: 'ID', width: 210 },
  {
    field: 'username',
    headerName: 'Username',
    width: 150,
    renderCell: (params) => {
      return (
        <div className="userListUser">
          {params.row.username}
        </div>
      )
    }
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250,
    editable: false,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone number',
    width: 120,
    editable: false,
  },
  {
    field: 'paymentPendingDate',
    headerName: 'PaymentPendingDate',
    width: 160,
    renderCell: (params) => {
      return (
        <>
            <p className="userListEdit">{params.row.paymentPendingDate}</p>
        </>
      )
    }
  },
  {
    field: 'shopname',
    headerName: 'shopname',
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
          <Link to={"/seller/" + params.row._id}>
            <button className="userListEdit">Edit</button>
          </Link>
        </>
      )
    }
  }
];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId = {(row)=> row._id}
        disableSelectionOnClick
      />
    </div>
  )
}
