import axios from "axios"

const instance = axios.create({
    baseURL : "https://chatmate-dy3z.onrender.com",
    withCredentials: true
})

export default instance;
