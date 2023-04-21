import axios from "axios";
const BASE_URL = "http://192.168.18.4:5000/api/";
// const SELLERTOKEN = "";
// const SELLERTOKEN = (JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.currentSeller)?.accessToken);
// console.log(SELLERTOKEN)
export const publicRequest = axios.create({
    baseURL:BASE_URL,
})

// const UserTOKEN = ""
// const UserTOKEN = (JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.currentUser)?.accessToken);
// console.log(UserTOKEN)
export const UserRequest = axios.create({
    baseURL:BASE_URL,
    // headers:{token:`${UserTOKEN}`}
})
// const SELLERTOKEN = ""
export const SellerRequest = axios.create({
    baseURL:BASE_URL,
    // headers:{token:`${SELLERTOKEN}`}
})