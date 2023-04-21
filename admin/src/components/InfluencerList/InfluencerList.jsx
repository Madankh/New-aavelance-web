import "./userList.css";
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../pages/dummydata";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InfluencerList() {
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  const [data, setdata] = useState([]);
  useEffect(() => {
    const getOrder = async()=>{
      try {
        const res = await axios.get(`http://localhost:5000/api/main/influencer`, {
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

const columns = [
  { field: '_id', headerName: 'ID', width: 180 },
  {
    field: 'username',
    headerName: 'Username',
    width: 150,
    renderCell: (params) => {
      return (
        <div className="userListUser">
          {/* <img src={params.row.avatar} alt="" className="userLISTimg" /> */}
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
    headerName: 'phoneNumber',
    width: 120,
    editable: false,
  },
  {
    field: 'transaction',
    headerName: 'Transaction',
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
          <Link to={"/influencer/" + params.row._id}>
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
        getRowId = {(row)=> row._id}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  )
}
