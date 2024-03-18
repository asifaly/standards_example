import axios from 'axios'
import { routeNames } from "../../Features/Routes/RouteName";
import { message } from 'antd';
const updatedBackendURL = "http://localhost:8080";
const DeployedServerUrl = "https://los-api-ghan9.ondigitalocean.app";
const isDevEnvironment = window.location.hostname.includes("localhost");

const axiosClient = axios.create({
    baseURL: isDevEnvironment ? updatedBackendURL : DeployedServerUrl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.response.use(
    (response:any) => {
        if (response.data?.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
        }
        return response;
    }
    , (error:any) => {
        let errorResponse = error.response;
        // console.log({errorResponse});
        switch (errorResponse?.status) {
            case 401:
                console.log(errorResponse);
                // message.error(errorResponse?.message||"Please Login to continue")
                // window.location.pathname = routeNames.login;
                // const origin = window.location.origin;
                // const search = window.location.search;
                // sessionStorage.setItem("lastExpiredRoute", window.location.pathname + search);
                //  ${ errorResponse?.data?.message }
                // const errorMessage ="Please Sign In"
                const errorMessage = ["jwt malformed", "invalid signature"].includes(errorResponse?.data?.message) ? "Please Sign In" : errorResponse?.data?.message;
                window.location.href = `${routeNames.login}?errorMessage=${ errorMessage }`;
                // message.info("Please login to continue")
                return;
            // case undefined:
            // case 500:
            //     window.location.pathname = routeNames.internalError;
            //     return;
            default:
                return errorResponse;

        }
        // if (errorResponse.status === 401) {
        //     window.location.pathname = routeNames.login
        //     return
        // }
    }
)

export default axiosClient;