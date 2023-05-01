import axios from "axios";
const BASE_URL = "https://api.aavelance.com/api/";
export const publicRequest = axios.create({
    baseURL:BASE_URL,
})

export const UserRequest = axios.create({
    baseURL:BASE_URL,
})

export const SellerRequest = axios.create({
    baseURL:BASE_URL,
})