import axios from "axios";
import {apiURL} from "utils/config";

export const axiosApi = axios.create({
  baseURL: apiURL,
});