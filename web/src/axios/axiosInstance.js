import axios from "axios";
import { store } from "../store/store";
import { startLoading, stopLoading } from "../redux/loading.slice.js";

export const getReduxToken = () => {
  return store.getState().token.token || "";
};

const getToken = () => {
  return localStorage.getItem("access_token") || getReduxToken() || "";
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());
    // const updatedToken = getToken();
    const updatedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGZhNDg4NmRhNDQxYzkzOTg2NTljZiIsImlhdCI6MTc0MDg1NzE5MywiZXhwIjoxNzQxMTgxMTkzfQ.RTwUJqotKsuHkeFpZjbp729KsuJRKALcyCsL74qQ6Zs";
    if (
      updatedToken &&
      updatedToken !== config.headers.Authorization?.split(" ")[1]
    ) {
      config.headers.Authorization = `Bearer ${updatedToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    return response;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  },
);

export default axiosInstance;