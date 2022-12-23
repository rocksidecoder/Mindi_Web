import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import authAxios from "../../http/authAxios";

const RoomRouter = ({ children }) => {
  const [isAuth, setIsAuth] = useState(true);
  const { id } = useParams();

  const authRoom = async () => {
    try {
      const res = await authAxios.get(`/room/${id}`);

      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    }
  };
  useEffect(() => {
    authRoom();
  }, [id]);

  return isAuth ? children : <Navigate to="/home" replace />;
};

export default RoomRouter;
