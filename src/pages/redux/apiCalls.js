import { loginFailure, loginStart, loginSuccess } from "./userRedux"
import { SellerloginFailure , SellerloginStart , SellerloginSuccess } from "./RegisteruserRedux";
import { loginInfluencerStart , loginInfluencerSuccess , loginInfluencerFailure  } from "./influencerRedux";
import { publicRequest, UserRequest   } from "../../requestMethos";
import { addProductStart , addProductSuccess , addProductFailure , updateProductStart , updateProductSuccess , updateProductFailure } from "./productSlice";
import { ordersStart , ordersSuccess , ordersFailure } from "./orderSlice";
import { SellerRequest } from "../../requestMethos";

export const login = async(dispatch , user)=>{
    dispatch(loginStart());
    try{
        const res = await publicRequest.post("/auth/login" , user);
        dispatch(loginSuccess(res.data))
   }catch(err){
     dispatch(loginFailure(err?.response?.data))
     
  }
}

export const VerifyUser = async(dispatch , user)=>{
  dispatch(loginStart());
  try{
      const res = await publicRequest.post("/auth/verify/email" , user);
      dispatch(loginSuccess(res.data))
 }catch(err){
   dispatch(loginFailure(err?.response?.data))
}
}

export const VerifySeller = async(dispatch , seller)=>{
  dispatch(SellerloginStart());
  try{
      const res = await publicRequest.post("/seller/verify/email" , seller);
      dispatch(SellerloginSuccess(res.data))
 }catch(err){
   dispatch(SellerloginFailure(err?.response?.data))
}
}

export const VerifyInfluencer = async(dispatch , influencer)=>{
  dispatch(loginInfluencerStart());
  try{
      const res = await publicRequest.post("/influencer/verify/email" , influencer);
      dispatch(loginInfluencerSuccess(res.data))
 }catch(err){
   dispatch(loginInfluencerFailure(err?.response?.data))
}
}


export const register = async(dispatch , user)=>{
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/register" , user);
    dispatch(loginSuccess(res.data))
  } catch (err) {
    dispatch(loginFailure(err?.response?.data))
  }
}


export const Influencerslogin = async(dispatch , influencer)=>{
  dispatch(loginInfluencerStart());
  try{
      const res = await publicRequest.post("/influencer/login" , influencer);
      dispatch(loginInfluencerSuccess(res.data));
 }catch(err){
   dispatch(loginInfluencerFailure(err?.response?.data))}
}

export const InfluencersRegister = async(dispatch , influencer)=>{
dispatch(loginInfluencerStart());
try {
  const res = await publicRequest.post("/influencer/register" , influencer);
  dispatch(loginInfluencerSuccess(res.data))
} catch (err) {
  dispatch(loginInfluencerFailure(err?.response?.data))}
}



export const Sellerlogins = async(dispatch , seller)=>{
  dispatch(SellerloginStart());
  try{
      const res = await publicRequest.post("/seller/login" , seller);
      dispatch(SellerloginSuccess(res.data))
 }catch(err){
   dispatch(SellerloginFailure(err?.response?.data))
   console.log(err?.response?.data)
}
}

export const Sellerregisters = async(dispatch , seller)=>{
dispatch(SellerloginStart());
try {
  const res = await publicRequest.post("/seller/register" , seller);
  dispatch(SellerloginSuccess(res.data))
} catch (err) {
  dispatch(SellerloginFailure(err?.response?.data))
}
}

export const addProduct = async ( dispatch , product) => {
  dispatch(addProductStart());
  try {
    const res = await SellerRequest.post("/products/product", product);
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};

export const updateProduct = async (id, product, dispatch) => {
  dispatch(updateProductStart());
  try {
    // update
    dispatch(updateProductSuccess({ id, product }));
  } catch (err) {
    dispatch(updateProductFailure());
  }
};

export const addOrders = async (dispatch , orders) => {
  dispatch(ordersStart());
  try {
    const res = await UserRequest.post("/order" , orders);
    dispatch(ordersSuccess(res.data));
  } catch (err) {
    dispatch(ordersFailure());
  }
};