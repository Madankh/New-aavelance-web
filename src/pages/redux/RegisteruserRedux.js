import { createSlice } from "@reduxjs/toolkit";

const RegisteruserRedux = createSlice({
    name:"Seller",
    initialState:{
        currentSeller: null,
        isFetching: false,
        error: false
    },
    reducers:{
        SellerloginStart: (state) => {
            state.isFetching = true
        },
        SellerloginSuccess:(state , action)=>{
            state.isFetching = false;
            state.currentSeller = action.payload
        },
        SellerloginFailure:(state , action)=>{
            state.isFetching = false;
            state.error = action.payload
        },
        Sellerlogout: (state) => {
            state.currentSeller = null;
            state.error =  null;
        },
    },
});


export const {SellerloginStart , SellerloginSuccess , SellerloginFailure , Sellerlogout} = RegisteruserRedux.actions;
export default RegisteruserRedux.reducer;