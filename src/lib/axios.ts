import axios from "axios";
import Cookies from 'js-cookie';



const baseapi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API,
    withCredentials: true 
})


baseapi.interceptors.request.use(function(config){
    const token = Cookies.get('accessToken')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, function(error){
    console.log("accessToken in not imported and set in cookie")
})

baseapi.interceptors.response.use(
    (response) => response,
    async(error) =>{
    const errorRequest = error.config;
    if (
        error.response.status === 401 && 
        !errorRequest._retry && 
        errorRequest.url ! == `${"http://127.0.0.1:8000"}/api/token/refresh/`
        
    ){
        errorRequest._retry =true;
        try {
            const res = await baseapi.post(
                `/api/token/refresh`,
                {},
                {withCredentials: true}
            );

            const newAccessToken = res.data.accessToken;
            Cookies.set('accessToken', newAccessToken);
            errorRequest.headers.Authorization= `Bearer ${newAccessToken}`;
            return baseapi(errorRequest)

        } catch (error) {
            Cookies.remove('accessToken');
            window.location.href='/login';
        }
    }
    return Promise.reject(error);
}
); 

export default baseapi;
