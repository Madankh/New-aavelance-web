import "./userList.css";
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../pages/dummydata";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [data, setdata] = useState([]);
  // const [Products, setProducts] = useState([]);
  // const handleDelete = (id)=>{
  //   setdata(data.filter((item)=> item.id !== id))
  // }

  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU1NDE2YjQ2OTcwZDA3YzQxNzc0NCIsImlzTWFpbkFkbWluIjp0cnVlLCJpYXQiOjE2NjgxODMyMjl9.WVA29ajSIjT6jnWwCw8_kVlrfSDL0Q9nQdIwdbyScz4"
  useEffect(() => {
    const getProduct = async()=>{
      try {
        const res = await axios.get('https://api.aavelance.com/api/main/user', {
          headers:{
            token: accessToken
          }
        })
        setdata(res.data);

      } catch (error) {
        
      }
    }
    getProduct();
  }, [0])

const columns = [
  { field: '_id', headerName: 'ID', width: 190 },
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
    headerName: 'PhoneNumber',
    width: 120,
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
        getRowId = {(row)=> row._id}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  )
}
