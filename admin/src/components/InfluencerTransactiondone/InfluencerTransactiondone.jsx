import "./InfluencerTransactiondone.css";
import axios from "axios";
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
export default function InfluencerTransactiondone() {
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`https://api.aavelance.com/api/main/seller`, {
          headers:{
            token: accessToken
          }
        })
        setdata(res.data);
      } catch (error) { 
      }
    }
    getOrder();
  }, [0])
  const handleDelete = (id)=>{

  }



const columns = [
  { field: '_id', headerName: 'ID', width: 90 },
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
    width: 260,
    renderCell: (params) => {
      return (
        <>
          {/* <Link to={"/seller/" + params.row.id}> */}
            <p className="userListEdit">{params.row.paymentPendingDate}</p>
          {/* </Link> */}
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
          <DeleteOutline className="userListDelete" onClick={()=>handleDelete(params.row.id)}/>
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
