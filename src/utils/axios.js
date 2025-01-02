import axios from "axios"

const token = sessionStorage.getItem("token");
const commonHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

const instance_users = axios.create({
    baseURL: "http://localhost/userapi",
    headers: commonHeaders
});

const instance_devices = axios.create({
    baseURL: "http://localhost/deviceapi",
    headers: commonHeaders
});

export {instance_users, instance_devices};