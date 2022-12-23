import React, { createContext, useEffect, useState } from "react";
export const userContext = createContext();

const UserProvider = ({ children }) => {
  const [loginDetail, setLoginDetail] = useState({});
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  useEffect(() => {
    if (userInfo?.token) setLoginDetail(userInfo);
  }, [userInfo?.token]);

  return (
    <userContext.Provider value={{ loginDetail, setLoginDetail }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
