import "./comtransactioninfluencerlist.css";
import axios from "axios";
import { DataGrid } from '@material-ui/data-grid';

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
export default function ComTransactionInfluencerList() {
  // const [allSeller , setallSeller] = useState([])
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`https://api.aavelance.com/api/influencer/transaction/Complected/transaction/for/mainAdmin`, {
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
  console.log(data)
  const handleDelete = (id)=>{
  }



const columns = [
  { field: '_id', headerName: 'ID', width: 220 },
  
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    editable: false,
  },
  {
    field: 'createdAt',
    headerName: 'CreatedAt',
    width: 220,
    renderCell: (params) => {
      return (
        <>
          <p className="userListEdit">{params.row.createdAt}</p>
        </>
      )
    }
  },
  {
    field: 'Sales',
    headerName: 'Sales',
    width: 220,
    editable: false,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 220,
    editable: false,
  },
  {
    field: "action",
    headerName: "Active",
    width: 150,
    renderCell: (params) => {
      console.log(params.row.user)
      return (
        <>
          <Link to={"/influencer/" + params.row.user}>
            <button className="userListEdit">Edit</button>
          </Link>
          {/* <DeleteOutline className="userListDelete" onClick={()=>handleDelete(params.row.id)}/> */}
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
