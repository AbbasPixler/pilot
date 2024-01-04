import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : "http://localhost:8080/"
    // baseURL : "http://18.183.136.171/" 
})