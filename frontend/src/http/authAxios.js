import axios from "axios";

const authAxios = axios.create({
  baseURL: `http://192.168.0.72:4001`
  // headers: {
  //   Authorization: localStorage.getItem("user-token")
  // }
});

export default authAxios;
