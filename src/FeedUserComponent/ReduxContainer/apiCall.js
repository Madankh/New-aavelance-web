import axios from "axios";
import {loginStart , loginSuccess , loginFailure , logout} from "./userReducer";

export const login = async(dispatch , user)=>{
          dispatch(loginStart());
          try {
                   const res = await axios.post("http://api.aavelance.com/api/user/login" , user);
                   dispatch(loginSuccess(res.data)); 
          } catch (error) {
                    dispatch(loginFailure());
          }
}

export const VerifyEmail = async(dispatch , user)=>{
          dispatch(loginStart());
          try {
                   const res = await axios.post("http://api.aavelance.com/api/user/verify/email" , user);
                   dispatch(loginSuccess(res.data)); 
          } catch (error) {
                    dispatch(loginFailure());
          }
}


export const signup = async(dispatch , user)=>{
          dispatch(loginStart());
          try {
                   const res = await axios.post("http://api.aavelance.com/api/user/create/user" , user);
                   dispatch(loginSuccess(res.data)); 
          } catch (error) {
                    dispatch(loginFailure());
          }
}