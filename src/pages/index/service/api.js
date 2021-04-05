
import axios from "@/utils/request";
import { baseUrl } from "../../../utils/utils";

export async function getUserInfo(code) {
  return axios({
    url: `${baseUrl}intelli-store/user/getLoginToken?code=${code}`,
    method: "get"
  });
}


export function getDetail(id) {
  return axios({
    url: `${baseUrl}/goods/detail/${id}`,
    method: "get"
  });
}

export function getCategory() {
  return axios({
    url: `${baseUrl}/categories`,
    method: "get"
  });
}


export function search(params) {
  return axios({
    url: `${baseUrl}/search, { params }`,
    method: "get"
  });
}

