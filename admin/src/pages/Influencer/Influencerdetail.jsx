import "./influencer.css"
import { Link } from "react-router-dom"
import Influencerfeaturedinfo from "../../Influencerfeaturedinfo/Influencerfeaturedinfo"

export default function Influencerdetail() {
    return (
        <div className="user">
            <div className="userTitleContainer">
                <h1 className="userTitle">Edit Influencer</h1>
                <Link to="/newUser">
                  <button className="userAddButton">Create </button>
                </Link>
            </div>
            
            <Influencerfeaturedinfo />
               

        </div>
    )
}
