
import './App.css';
import React from "react";
import {BrowserRouter , Routes , Route} from "react-router-dom";
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';
import Home from './pages/Home';
import UserList from './components/userList/UserList';
import User from './pages/user/User';
import NewUser from './pages/newPage/NewUser';

import SellerList from './components/SellerList/SellerList';
import InfluencerList from './components/InfluencerList/InfluencerList';
import SupplierList from './components/SupplierList/SupplierList';

import Seller from './pages/Seller/Seller';
import Influencerdetail from './pages/Influencer/Influencerdetail';
import Supplierdetail from './pages/supplier/Supplierdetail';

import SellerProductList from './pages/SellerproductList/SellerProductList';
import SupplierproductList from './pages/SupplierproductList/SupplierproductList';
import Influencerproductlist from './pages/InfluencerproductList/InfluencerproductList';

import InfluencerSales from './SalesForAll/InfluencerSales/InfluencerSales';
import SellerSales from './SalesForAll/SellerSales/SellerSales';
import SupplierSales from './SalesForAll/SupplierSales/SupplierSales';

import SellerPendingproductList from './pages/SellerPendingproductList/SellerPendingproductList';
import SupplierPendingproductList from './pages/SupplierPendingproductList/SupplierPendingproductList';
import InfluencerPendingOrderList from './pages/InfluencerPendingOrderList/InfluencerPendingOrderList';

import SellerReturnPendingproductList from './pages/SellerReturnPendingproductList/SellerReturnPendingproductList';
import SupplierReturnPendingproductList from './pages/SupplierReturnPendingproductList/SupplierReturnPendingproductList';
import InfluencerReturnPendingproductList from './pages/InfluencerReturnPendingOrderList/InfluencerReturnPendingOrderList';
import ChangeReturnorderStatus from './components/ChangeReturnorderStatus/ChangeReturnorderStatus';

import InfluencerChangeReturnorderStatus from './components/InfluencerChangeReturnorderStatus/InfluencerChangeReturnorderStatus';
import SupplierChangeReturnorderStatus from './components/SupplierChangeReturnorderStatus/SupplierChangeReturnorderStatus';
import SellerChangePendingorderStatus from './components/SellerChangePendingorderStatus/SellerChangePendingorderStatus';

import InfluencerChangePendingorderStatus from './components/InfluencerChangePendingorderStatus/InfluencerChangePendingorderStatus';

import PendingTransactionSellerList from './components/PendingTransactionSellerList/PendingTransactionSellerList';
import PendingTransactionInfluencerList from './components/PendingTransactionInfluencerList/PendingTransactionInfluencerList';
import Login from './Login/Login';
import Pendingorder from './pages/PendingOrders/Pendingorder';
import ReturnpendingOrders from './pages/ReturnPendingOrder/ReturnpendingOrders';
import UpdatePendingOrder from './pages/UpatePendingOrder/UpdatePendingOrder';
import InfluencerTransactiondone from './components/InfluencerTransactiondone/InfluencerTransactiondone';
import SellerTransactiondone from './components/SellerTransactiondone/SellerTransactiondone';
import ComTransactionSellerList from './components/ComTransactionSellerList/comTransactionSellerList';
import ComTransactionInfluencerList from './components/comTransactionInfluencerList/comTransactionInfluencerList';

function App() {
  return (
    <>
      <BrowserRouter>
        <Topbar />
        <div className="container">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList/>} />
            <Route path="/SellerList" element={<SellerList/>} />
            <Route path="/InfluencerList" element={<InfluencerList/>} />
            <Route path="/SellerPaymentPendingList" element={<PendingTransactionSellerList/>} />

            <Route path="/com/SellerPaymentPendingList" element={<ComTransactionSellerList/>} />
            <Route path="/com/UserPaymentPendingList" element={<ComTransactionInfluencerList/>} />


            <Route path="/InfluencerPaymentPendingList" element={<PendingTransactionInfluencerList/>} />
            {/* <Route path="/SupplierList" element={<SupplierList/>} /> */}
            <Route path="/user/:userId" element={<User/>} />
            <Route path="/seller/:id" element={<Seller/>} />
            <Route path="/supplier/:id" element={<Supplierdetail/>} />
            <Route path="/influencer/:id" element={<Influencerdetail/>} />
            <Route path="/seller/productlist/:id" element={<SellerProductList/>} />
            <Route path="/supplier/productlist/:id" element={<SupplierproductList/>} />
            <Route path="/influencer/productlist/:id" element={<Influencerproductlist/>} />
            <Route path="/seller/sales/:id" element={<SellerSales/>} />
            <Route path="/supplier/sales/:id" element={<SupplierSales/>} />
            <Route path="/influencer/sales/:id" element={<InfluencerSales/>} />
            <Route path="/seller/pendingorder/:id" element={<SellerPendingproductList/>} />
            <Route path="/supplier/pendingorder/:id" element={<SupplierPendingproductList/>} />
            <Route path="/influencer/pendingorder/:id" element={<InfluencerPendingOrderList/>} />
            <Route path="/seller/return/pendingorder/:id" element={<SellerReturnPendingproductList/>} />
            <Route path="/supplier/return/pendingorder/:id" element={<SupplierReturnPendingproductList/>} />
            <Route path="/influencer/return/pendingorder/:id" element={<InfluencerReturnPendingproductList/>} />
            <Route path="/seller/return/order/changeorder/status/:id" element={<ChangeReturnorderStatus/>} />
            <Route path="/influencer/return/order/changeorder/status/:id" element={<InfluencerChangeReturnorderStatus/>} />
            <Route path="/supplier/return/order/changeorder/status/:id" element={<SupplierChangeReturnorderStatus/>} />
            <Route path="/seller/pending/order/changeorder/status/:id" element={<SellerChangePendingorderStatus/>} />
            <Route path="/influencer/pending/order/changeorder/status/:id" element={<InfluencerChangePendingorderStatus/>} />
            <Route path="/supplier/pending/order/changeorder/status/:id" element={<SupplierChangeReturnorderStatus/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path="/pending/order" element={<Pendingorder/>} />
            <Route path="/return/pending/order" element={<ReturnpendingOrders/>} />
            <Route path="/update/pending/order" element={<UpdatePendingOrder/>} />
            <Route path="/influencer/transaction/done/:id" element={<InfluencerTransactiondone/>} />
            <Route path="/seller/transaction/done/:id" element={<SellerTransactiondone/>} />
            
          </Routes>
        </div>
      </BrowserRouter>
    </>

  );
}

export default App;
