import React, { useEffect, useState } from "react";
import "./topbar.css";
import { Notifications, Settings } from "@material-ui/icons";
import { Sellerlogout } from "../../../pages/redux/RegisteruserRedux";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  AttachMoney,
  ForumOutlined,
  Category,
  AddCircleOutline,
  Reorder,
  Home,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import Menu from "./menu.png";

export default function Topbar() {
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(Sellerlogout());
    console.log("Something was happened");
  };

  const [Products, setProducts] = useState([]);
  const admin = useSelector((state) => state.seller);
  const [isVisiable, setisVisiable] = useState(false);
  let accessToken = admin?.currentSeller?.accessToken;

  const handleisvisiable = ()=>{
    if(isVisiable === false){
      setisVisiable(true)
    }else{
      setisVisiable(false)
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          "http://139.162.11.30:80/api/order/get/proccessing/userOrders",
          {
            headers: {
              token: accessToken,
            },
          }
        );
        setProducts(res.data);
      } catch (error) {}
    };
    getProduct();
  }, [0]);
  let id = admin.currentSeller._id;

  return (
    <div className="topbar">
      <div className="topbarwrapper">
        <div className="topleft">
          <div style={{ display: "flex" }} onClick={handleisvisiable}>
            <img className="menuicon" src={`${Menu}`} alt="" />
          </div>
          <Link to={"/admin"} style={{ textDecoration: "none" }}>
            <div>
              <p className="logoname">Admin</p>
            </div>
          </Link>
        </div>
        <div className="topright">
          <p onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </p>
          <Link to={"/seller/penddingorder"}>
            <div className="topbarIconContainer">
              {Products.length == 0 ? (
                <Notifications />
              ) : (
                <div>
                  <Notifications />
                  <span className="topIconBadge">{Products.length}</span>
                </div>
              )}
            </div>
          </Link>
          <div className="topbarIconContainer">
          <Link to={`/profile/${id}`}>
            <Settings/>
          </Link>
          </div>
        </div>
      </div>

      <div>
        {isVisiable !== true ? "" : 
          <div className="sidebarisVisiable">
            <div className="sidebarWrapperisVisiable">
              <div className="sidebarmenuisVisiable">
                <h3 className="sidebarTitleisVisiable">Dashboard</h3>
                <ul className="sidebarListisVisiable">
                  <Link to="/admin" className="link">
                    <li className="sidebarListItemisVisiable">
                      <Home className="sidebarIconisVisiable" />
                      Home
                    </li>
                  </Link>
                  <Link to="/sales" className="link">
                    <li className="sidebarListItemisVisiable">
                      <TrendingUp className="sidebarIconisVisiable" />
                      Sales
                    </li>
                  </Link>
                </ul>
              </div>

              <div className="sidebarmenuisVisiable">
                <h3 className="sidebarTitleisVisiable">Quick menu</h3>
                <ul className="sidebarListisVisiable">
                  <Link to="/ProductListAdmin" className="link">
                    <li className="sidebarListItemisVisiable">
                      <Category className="sidebarIconisVisiable" />
                      Products
                    </li>
                  </Link>
                  <Link to="/newProductAdmin" className="link">
                    <li className="sidebarListItemisVisiable">
                      <AddCircleOutline className="sidebarIconisVisiable" />
                      Create Product
                    </li>
                  </Link>
                  <Link to={"/transaction"} className="link">
                    <li className="sidebarListItemisVisiable">
                      <AttachMoney className="sidebarIconisVisiable" />
                      Transactions
                    </li>
                  </Link>

                  <Link to={"/Complected/transaction"} className="link">
                    <li className="sidebarListItemisVisiable">
                      <AttachMoney className="sidebarIconisVisiable" />
                      Completed Transactions
                    </li>
                  </Link>
                </ul>
              </div>

              <div className="sidebarmenuisVisiable">
                <h3 className="sidebarTitleisVisiable">Notification</h3>
                <ul className="sidebarListisVisiable">
                  <Link to={"/seller/penddingorder"} className="link">
                    <li className="sidebarListItemisVisiable">
                      <ForumOutlined className="sidebarIconisVisiable" />
                      Pending orders
                    </li>
                  </Link>
                  <Link to={"/Returnorder"} className="link">
                    <li className="sidebarListItemisVisiable">
                      <div style={{ display: "flex" }}>
                        <Reorder className="sidebarIconisVisiable" />
                        {/* <span className='topIconBadgee'>4</span> */}
                      </div>
                      Return orders
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
