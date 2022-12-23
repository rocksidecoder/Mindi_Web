import { Button } from "@mui/material";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <>
      <p>Click to login</p>
      <Button
        type="submit"
        variant="contained"
        size="small"
        sx={{ margin: "0 10px 12px" }}
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    </>
  );
};

export default Index;
