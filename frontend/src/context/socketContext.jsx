import { io } from "socket.io-client";
import React, { createContext, useEffect } from "react";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  let socket = io("http://192.168.0.72:4001", { transports: ["websocket"] });
  useEffect(() => {
    socket.on("connect", (socket) => {
      console.log("client connected ...");
    });
  }, []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
