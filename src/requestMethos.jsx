import axios from "axios";
const BASE_URL = "http://api.aavelance.com/api/";
export const publicRequest = axios.create({
    baseURL:BASE_URL,
})

export const UserRequest = axios.create({
    baseURL:BASE_URL,
})

export const SellerRequest = axios.create({
    baseURL:BASE_URL,
})