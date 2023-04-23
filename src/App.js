import './App.css';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Pay from './pages/Pay';
import Product from './pages/Product';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Success from './pages/Success';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import Order from './pages/order';
import SearchProductList from './pages/SearchProductList';
import ShippingInfo from './pages/shippingInfo';
import UpdateUserProfile from './pages/UpdateUserProfile/UpdateUserProfile';
import Userprofile from './pages/Userprofile/userprofile'
import UpdateUserpassword from './pages/UpdateUserpassword/UpdateUserpassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import SellerForgotPassword from './pages/SellerForgotPassword/SellerForgotPassword';
import InfluencerForgotPassword from './pages/InfluencerForgotPassword/InfluencerForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import SellerResetPassword from './pages/SellerResetPassword/SellerResetPassword';
import InfluencerResetPassword from './pages/InfluencerResetPassword/InfluencerResetPassword';
import CatProductList from './pages/CatProductList';

import { BrowserRouter , Routes , Navigate , Route} from "react-router-dom";
import FeedHome from "./FeedUserPages/Home/Home"

import Sellerlogin from './pages/Sellerlogin'
import HomepageForSeller from './Seller/HomepageForSeller';
import Transaction from './Seller/components/Transactions/Transaction'
import Pendingorder from '../src/Seller/SellerPendingOrder/Pendingorder'
import ProductListAdmin from './Seller/pages/productList/ProductList';
import ProductAdmin from './Seller/pages/product/SellerProduct';
import SellerOrder from './Seller/SellerOrders/SellerOrder';
import Sales from "./Seller/Sales/Sales";
import SellerRegister from './pages/SellerRegister';
import SellerProduct from './Seller/pages/product/SellerProduct';
import SellerprofileDetails from './Seller/SellerprofileDetails/SellerprofileDetails';
import UpdateSellerProfileDetail from './Seller/UpdateSellerProfileDetail/UpdateSellerProfileDetail';
import ReturnProduct from './Seller/ReturnOrder/ReturnProduct';
import UpdateSellerpassword from './Seller/UpdateSellerpassword/UpdateSellerpassword';
import SellerBankAccountUpdate from './Seller/SellerprofileDetails/sellerBankAccountUpdate'
import AddsellerBankAccount from './Seller/SellerprofileDetails/AddsellerBankAccount';
import NewProduct from './Seller/pages/newProduct/NewProduct';
import Verifyemail from './component/Verifyemail';
import UserProfile from "./UserProfile/Profile"


import HomepageForInfluencer from './Influencer/Influencerpages/InfluencerProfile/HomepageForInfluencer';
import AddinfluenerBankAccount from './Influencer/InfluencerprofileDetails/AddinfluenerBankAccount'
import InfluencerBankAccountUpdate from './Influencer/InfluencerprofileDetails/InfluencerBankAccountUpdate';
import SellerVerifyemail from './component/SellerVerifyemail';
import Followingseller from './pages/Followingseller';
import FollowingSeller from './component/FollowingSeller';
import ComplectedTransactions from './Seller/components/ComplectedTransactions/ComplectedTransactions';
import UserTransactions from './Influencer/components/InfluencerTransactions/UserComplectedTransactions';
import UserComplectedTransactions from './Influencer/components/UserComplectedTransactions/UserCompletedTransactions';
import Chat from './FeedUserPages/Chat/Chat';
import Makeup from './pages/Makeup/Makeup';
import FashionContent from './pages/FashionContent/FashionContent';
import Discover from './pages/Discover/MainDiscover';
import Livestreaming from './component/Livestreaming';


function App() {
  
  const users = useSelector(state => state.user.currentUser);
  const seller = useSelector(state => state.seller.currentSeller);
  const user = users?.others?.username;
  return (
    <>
    <BrowserRouter> 
    <Routes>
      <Route path="/" element={seller?.isSeller===true && seller?.verified === true ? <Navigate to="/admin" replace={true} /> :<Home/>} />  
      <Route path="/Product/find/:id"element={<Product/> } />  
      <Route path="/Products/:category"element={<ProductList/>} />  
      <Route path="/Products/sub/:cat"element={<CatProductList/>} /> 
      <Route path="/result/search_query/:title"element={<SearchProductList/>} />  
      <Route path="/Cart"element={<Cart/>} />  
      <Route path="/Register"element={user ? <Navigate to="/" replace={true}/> : <Register/>} />
      <Route path="/Login"element={user ? <Navigate to="/" replace={true} />: <Login/>} />  
      <Route path="/pay" element={<Pay/>}/>
      <Route path="/Success"element={<Success/>} />
      <Route path='/verify/email' element={ users?.others?.verified === true ? <Navigate to="/" replace={true}/> : <Verifyemail/>}/>
      <Route path='/seller/verify/email' element={seller?.others?.verified === true ? <Navigate to="/admin" replace={true}/> : <SellerVerifyemail/>}/>
      <Route path="/profile/:id" element={ <Profile/>}/>
      <Route path="/user/profile/:id" element={ users?.others?.verified === true ? <UserProfile/> :  <Navigate to="/login" replace={true}/> }/>
      <Route path="/ResetPassword" element={ <ResetPassword/>}/>
      <Route path="/my/profile" element={user ? <Userprofile/>: <Navigate to="/login" replace={true}/>}/>
      <Route path="/Forgot/password" element={<ForgotPassword/>}/>
      <Route path="/Seller/Forgot/password" element={<SellerForgotPassword/>}/>
      <Route path="/Influencer/Forgot/password" element={<InfluencerForgotPassword/>}/>
      <Route path="/update/my/profile" element={user ? <UpdateUserProfile/> :<Navigate to="/login" replace={true}/> }/>
      <Route path="/update/my/password" element={user ? <UpdateUserpassword/> :<Navigate to="/login" replace={true}/> }/>
      <Route path="/shippingInfo" element={user ? <ShippingInfo /> : <Navigate to="/login" replace={true}/>}/>
      <Route path="/order" element={user ? <Order/>: <Navigate to="/login" replace={true}/> }/>
      <Route path="/reset/password" element={<ResetPassword/>}/>
      <Route path="/seller/reset/password" element={<SellerResetPassword/>}/>
      <Route path="/influencer/reset/password" element={<InfluencerResetPassword/>}/>
      <Route path="/following/seller" element={<FollowingSeller/>}/>

      <Route path="/your/feed" element={user ? <FeedHome/> : <Navigate to="/login" replace={true}/>} />

      <Route path="/makeup/user/content" element={<Makeup/>} />
      <Route path="/fashion/user/content" element={<FashionContent/>} />
      <Route path="/Discover" element={<Discover/>} />
      <Route path='/livestreming' element={<Livestreaming/>} />

      <Route path="/seller/profile" element={seller?.isSeller===true ? <SellerprofileDetails/> : <Navigate to="/seller/login" replace={true}/>}/>
      <Route path="/seller/update/my/profile" element={ seller?.isSeller===true ? <UpdateSellerProfileDetail/> : <Navigate to="/seller/login" replace={true}/> }/>
      <Route path="/seller/login" element={seller?.isSeller===true ? <Navigate to="/admin" replace={true} />: <Sellerlogin/> }/> 
      <Route path="/Seller/register" element={seller?.isSeller===true? <Navigate to="/admin" replace={true} /> : <SellerRegister/>}/>
      <Route path="/update/seller/password" element={seller?.isSeller===true ? <UpdateSellerpassword/> :<Navigate to="/login" replace={true}/> }/>
      <Route path="/admin" element={seller?.isSeller===true ? <HomepageForSeller /> : <Sellerlogin/>} />
      <Route path="/sellerproduct/:productId" element={seller?.isSeller===true ? <SellerProduct/> : <Sellerlogin/>} />
      <Route path="/seller/update/pendinguser/Order/:productId" element={seller?.isSeller === true ? <SellerOrder/> : <Sellerlogin/>} />

      <Route path="/sales" element={seller?.isSeller===true ? <Sales/> : <Sellerlogin/>} />
      <Route path="/transaction" element={seller?.isSeller===true ? <Transaction/> : <Sellerlogin/>} />
      <Route path="/Complected/transaction" element={seller?.isSeller===true ? <ComplectedTransactions/> : <Sellerlogin/>} />

      <Route path="/seller/penddingorder" element={seller?.isSeller===true ? <Pendingorder/> : <Sellerlogin/>} />
      <Route path="/Productlistadmin" element={seller?.isSeller===true ? <ProductListAdmin/> : <Sellerlogin/>} />
      <Route path="/ProductAdmin/:productId" element={seller?.isSeller===true ? <ProductAdmin/> : <Sellerlogin/>} />
      <Route path="/seller/update/bank/account" element={seller?.isSeller===true ? <SellerBankAccountUpdate/> : <Sellerlogin/>} />
      <Route path="/seller/add/bank/account" element={seller?.isSeller===true ? <AddsellerBankAccount/> : <Sellerlogin/>} />
      <Route path="/newProductAdmin" element={seller?.isSeller===true ? <NewProduct/> : <Sellerlogin/>} />
      <Route path="/ordersAdmin" element={seller?.isSeller===true ? <ordersAdmin/> : <Sellerlogin/>} />
      <Route path="/Returnorder" element={seller?.isSeller===true ? <ReturnProduct/> : <Sellerlogin/>}/>
      <Route path="/Chat" element={ users?.others?.verified === true ? <Chat/> :  <Navigate to="/login" replace={true}/>}/>
      <Route path="/user/earning" element={ user !== undefined ?  <HomepageForInfluencer/> : <Login/> }></Route>
      <Route path="/creator/transaction"element={user !== undefined || user !== null ? <UserTransactions/>: <Login/> } />
      <Route path="/completed/creator/transaction"element={user !== undefined || user !== null ? <UserComplectedTransactions/>: <Login/> } />
      <Route path="/add/user/bank/account"element={user !== undefined || user !== null ? <AddinfluenerBankAccount/>: <Login/> } />
      <Route path="/update/user/bank" element={user !== undefined || user !== null ? <InfluencerBankAccountUpdate/> : <Login/>} /> 
    </Routes> 
     
    </BrowserRouter>
    
    
    </>
  );
}

export default App;
