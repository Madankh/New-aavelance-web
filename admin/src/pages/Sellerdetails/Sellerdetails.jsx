import "./sellerdetail.css"
import { PermIdentity, CalendarToday , PhoneAndroid , LocationSearching , Mail ,Publish  } from "@material-ui/icons"
import { Link } from "react-router-dom"
import FeaturedInfo from "../../featuredinfo/FeaturedInfo"

export default function User() {
    return (
        <div className="user">
            <div className="userTitleContainer">
                <h1 className="userTitle">Edit User</h1>
                <Link to="/newUser">
                  <button className="userAddButton">Create </button>
                </Link>
            </div>
            
            <FeaturedInfo />
               

        </div>
    )
}
