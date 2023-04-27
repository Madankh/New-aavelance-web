import axios from "axios";
const BASE_URL = "http://172.232.73.46:80/api/";
export const publicRequest = axios.create({
    baseURL:BASE_URL,
})

export const UserRequest = axios.create({
    baseURL:BASE_URL,
})

export const SellerRequest = axios.create({
    baseURL:BASE_URL,
})