import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loginDetail } = useContext(userContext);

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    navigate("/login");
  };
  const array = ["/login", "/signup", "/"];
  return (
    <>
      <Box
        sx={{
          flexGrow: 1
        }}
        className={!array.includes(pathname) ? "main" : ""}
      >
        {!array.includes(pathname) ? (
          <AppBar position="static" sx={{ backgroundColor: "#1976d233" }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                MINDI GAME
              </Typography>
              <div
                style={{
                  marginRight: "15px",
                  fontSize: "25px",
                  textTransform: "uppercase"
                }}
              >
                {loginDetail.username}
              </div>
              <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                  backgroundColor: "#5a3660",
                  "&:hover": {
                    backgroundColor: "#5a366088"
                  }
                }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        ) : (
          ""
        )}
        <main
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 64px)"
          }}
        >
          {children}
        </main>
      </Box>
    </>
  );
};

export default DefaultLayout;
