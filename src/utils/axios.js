import axios from "axios"

const token = sessionStorage.getItem("token");
const commonHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

const instance_users = axios.create({
    baseURL: "https://user-management-microservice.proudgrass-626b941a.westeurope.azurecontainerapps.io/userapi",
    headers: commonHeaders
});

const instance_devices = axios.create({
    baseURL: "https://device-management-microservice.proudgrass-626b941a.westeurope.azurecontainerapps.io/deviceapi",
    headers: commonHeaders
});

export {instance_users, instance_devices};