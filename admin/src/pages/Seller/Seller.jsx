import "./seller.css"
import { PermIdentity, CalendarToday , PhoneAndroid , LocationSearching , Mail ,Publish  } from "@material-ui/icons"
import { Link } from "react-router-dom"
import Sellerfeaturedinfo from "../../Sellerfeaturedinfo/Sellerfeaturedinfo"

export default function Seller() {
    return (
        <div className="user">
            <div className="userTitleContainer">
                <h1 className="userTitle">Edit Seller</h1>
                <Link to="/newUser">
                  <button className="userAddButton">Create </button>
                </Link>
            </div>
            
            <Sellerfeaturedinfo />
               

        </div>
    )
}
