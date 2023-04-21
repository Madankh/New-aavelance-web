import "./supplierdetail.css"
import { Link } from "react-router-dom"
import Supplierfeaturedinfo from "../../supplierfeaturedinfo/Supplierfeaturedinfo"

export default function Supplierdetail() {
    return (
        <div className="user">
            <div className="userTitleContainer">
                <h1 className="userTitle">Edit Supplier</h1>
                <Link to="/newUser">
                  <button className="userAddButton">Create </button>
                </Link>
            </div>
            
            <Supplierfeaturedinfo />
               

        </div>
    )
}
