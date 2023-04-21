import { createSlice } from "@reduxjs/toolkit";

const InfluencerSlice = createSlice({
    name:"influencer",
    initialState:{
        currentInfluencer: null,
        isFetching: false,
        error: false
    },
    reducers:{
        loginInfluencerStart: (state) => {
            state.isFetching = true
        },
        loginInfluencerSuccess:(state , action)=>{
            state.isFetching = false;
            state.currentInfluencer = action.payload
        },
        loginInfluencerFailure:(state , action)=>{
            state.isFetching = false;
            state.error = action.payload
        },
        logoutInfluencer: (state) => {
            state.currentInfluencer = null;
            state.error = null
        },
    },
});

export const {loginInfluencerStart , loginInfluencerSuccess , loginInfluencerFailure , logoutInfluencer} = InfluencerSlice.actions;
export default InfluencerSlice.reducer