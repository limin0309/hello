/*
 * @Author: your name
 * @Date: 2021-04-02 11:29:08
 * @LastEditTime: 2021-04-02 11:49:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /hello-world/src/utils/request.js
 */
import axios from "axios";
import Cookies from "js-cookie";
import {
  Toast
} from "vant";
import {
  baseUrl, basePageUrl
} from "./utils";

const LoginFailure = () => {
  location.href = `${basePageUrl}wxwork/401`;
};
const Service = axios.create({
  timeout: 30000, // 请求超时时间
  // baseURL: baseUrl,
  method: "post",
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

/**
 * axios配置
 */
try {
  delete Service.defaults.headers.common.Authorization;
  delete Service.defaults.headers.common.devicetoken;
} catch (err) {
  console.log(err);
}


// 添加一个请求拦截器
Service.interceptors.request.use(
  config => {
    const {
      url
    } = config;
    // 有的接口是全路径，不需要拼接
    if (url.indexOf("http") !== 0) {
      config.url = `${baseUrl}${url}`;
    }
    const Authorization = Cookies.get("Authorization");
    if (Authorization) {
      config.headers.Authorization = Authorization;
    }
    console.log(config);
    return config;
  },
  error => {
    return error;
  }
);

// 添加一个响应拦截器
Service.interceptors.response.use(
  res => {
    res = res.data;
    if (res.code == 1002 || res.code == 1001) {
      LoginFailure();
    }
    return res;
  },
  (error = {}) => {
    // 断网 或者 请求超时 状态
    Toast.clear();
    if (!error.response) {
      // 请求超时状态
      if (error.message.includes("timeout")) {
        Toast("请求超时，请检查网络是否连接正常");
      } else {
        Toast("请求失败，请检查网络是否已连接");
      }
    } else {
      if (error.response.status == 401) {
        LoginFailure();
      } else {
        Toast(JSON.stringify(error));
      }
    }
    return Promise.reject(error);
  }
);

export default Service;
