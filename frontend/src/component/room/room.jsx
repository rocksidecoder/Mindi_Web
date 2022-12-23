import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubdirectoryArrowLeftRoundedIcon from "@mui/icons-material/SubdirectoryArrowLeftRounded";
import { IconButton, Tooltip } from "@mui/material";
import { SocketContext } from "../../context/socketContext";
import { userContext } from "../../context/userContext";
import ShowCard from "../cardTable/ShowCard";

const Room = () => {
  const { id } = useParams();
  const { socket } = useContext(SocketContext);
  const { loginDetail } = useContext(userContext);
  const navigate = useNavigate();

  const handleClick = () => {
    socket.emit(
      "leave:room",
      {
        host: loginDetail.username,
        roomId: id
      },
      (res) => {
        // console.log("leaveroom --", res);
      }
    );
    navigate("/home", {
      replace: true
    });
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "16px",
        height: "100%",
        position: "relative"
      }}
    >
      <div style={{ position: "fixed", right: "25px", zIndex: 1 }}>
        <Tooltip title="Left Room">
          <IconButton
            onClick={handleClick}
            sx={{ fontSize: "28px", backgroundColor: "bisque" }}
          >
            <SubdirectoryArrowLeftRoundedIcon />
          </IconButton>
        </Tooltip>
      </div>
      <ShowCard />
    </div>
  );
};

export default Room;
