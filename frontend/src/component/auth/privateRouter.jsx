import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import authAxios from "../../http/authAxios";

const PrivateRouter = ({ children }) => {
  const [isAuth, setIsAuth] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const authenticateUser = async () => {
    try {
      const res = await authAxios.get("/auth/authUser", {
        headers: {
          Authorization: userInfo.token
        }
      });
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      authenticateUser();
    }
  }, [userInfo]);

  return isAuth && userInfo ? children : <Navigate to={"/login"} replace />;
};
export default PrivateRouter;
