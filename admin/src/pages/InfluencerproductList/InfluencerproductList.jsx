import "./influencerproductlist.css"
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from "@material-ui/icons";
import { ProductRows } from "../dummydata";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function InfluencerproductList() {
  const [data , setdata] = useState(ProductRows);

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
            <button className="productListEdit">Edit</button>
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
