import "./pendingtransactionsellerlist.css";
import axios from "axios";
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../pages/dummydata";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
export default function PendingTransactionSellerList() {
  // const [allSeller , setallSeller] = useState([])
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`http://localhost:5000/api/transfer/transaction/for/mainAdmin`, {
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
    width: 150,
    renderCell: (params) => {
      return (
        <div className="userListUser">
          {params.row.amount}
        </div>
      )
    }
  },
  {
    field: 'seller',
    headerName: 'Seller',
    width: 250,
    editable: false,
  },
  {
    field: 'createdAt',
    headerName: 'CreatedAt',
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
      return (
        <>
          <Link to={"/seller/" + params.row.seller}>
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
