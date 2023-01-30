import React, { useContext, useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useNavigate } from "react-router-dom";
import "./home.css";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Tooltip
} from "@mui/material";
import { SocketContext } from "../../context/socketContext";
import { userContext } from "../../context/userContext";
import toastMessage from "../../utils/toast";
import { toastTypes } from "../../utils/helper";

export default function Home() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { loginDetail } = useContext(userContext);
  const [code, setCode] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [open, setOpen] = useState(false);

  const [snack, setSnack] = useState(false);
  const [snackCoordinate, setSnackCoordinate] = useState({
    vertical: "top",
    horizontal: "right"
  });
  const [snackMessage, setSnackMessage] = useState("");
  const { vertical, horizontal } = snackCoordinate;

  const [player, setPlayer] = useState(4);
  const handlePlayer = (event) => {
    setPlayer(event.target.value);
  };

  const [mode, setMode] = useState("Hide");
  const handleMode = (event) => {
    setMode(event.target.value);
  };

  const handleClose = () => setOpen(!open);
  const handleSnack = () => setSnack(!snack);

  const generateRoom = async () => {
    return Array.from(Array(7), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
  };

  const createRoom = async () => {
    socket.emit(
      "create:room",
      {
        host: loginDetail.username,
        roomId: code,
        players: player,
        mode,
        playerId: loginDetail._id
      },
      (res) => {
        if (res.status) {
          setSnack(true);
          setSnackMessage(res.message);
        }
      }
    );
  };

  const joinRoom = () => {
    if (!codeValue) {
      return toastMessage("Please enter room id !", toastTypes.error);
    }
    socket.emit(
      "join:room",
      {
        host: loginDetail.username,
        roomId: codeValue,
        playerId: loginDetail._id
      },
      (res) => {
        if (!res.status) toastMessage(res.error, toastTypes.error);
        else {
          setMode(res.mode);
          toastMessage(res.message, toastTypes.success);
          navigate(`/room/${codeValue}`, {
            state: {
              totalPlayers: res.data.players,
              mode: res.mode
            }
          });
        }
      }
    );
    setCodeValue("");
  };

  const copyToClipboard = async () => {
    createRoom();
    setSnack(!snack);
    setSnackMessage("Code copy successfully!");
    setSnackCoordinate({
      ...snackCoordinate,
      vertical: "bottom",
      horizontal: "right"
    });
    setOpen(!open);
    console.log("code ====>", code);
    copy(code);
    // await window.navigator.clipboard.writeText(code);
    setTimeout(() => {
      navigate(`/room/${code}`, {
        state: {
          totalPlayers: player,
          mode
        }
      });
    }, 500);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <Paper
        className="paperRoom"
        sx={{ width: "100%", maxWidth: "300px", margin: "65px" }}
      >
        <Box>
          <Button
            onClick={async () => {
              const randomCode = await generateRoom();
              setCode(randomCode);
              setOpen(true);
            }}
            sx={{
              width: "100%",
              maxWidth: "130px",
              border: "1px solid white",
              padding: "8px",
              color: "white",
              "&:hover": {
                background:
                  "linear-gradient(to left,rgba(63, 94, 251, 1) 0%,rgba(237, 146, 165, 1) 100%)",
                color: "white",
                border: "black"
              }
            }}
          >
            Create Room
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          columnGap="10px"
        >
          <TextField
            type="text"
            label=""
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            autoComplete="off"
            size="small"
            sx={{
              border: "1px solid #fbfbfb",
              borderRadius: "5px",
              "&:focus": {
                outline: "none"
              },
              "& .MuiOutlinedInput-input": {
                color: "#fff",
                mixBlendMode: "overlay",
                background: "black"
              }
            }}
          />
          <Button
            onClick={joinRoom}
            sx={{
              width: "100%",
              maxWidth: "130px",
              border: "1px solid white",
              padding: "8px",
              color: "white",
              "&:hover": {
                background:
                  "linear-gradient(to left,rgba(63, 94, 251, 1) 0%,rgba(237, 146, 165, 1) 100%)",
                color: "white",
                border: "black"
              }
            }}
          >
            Join Room
          </Button>
        </Box>
      </Paper>

      <div>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/history");
          }}
          sx={{
            margin: "22px",
            backgroundColor: "#5a3660",
            "&:hover": {
              backgroundColor: "#5a366088"
            }
          }}
        >
          Game History
        </Button>
      </div>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            rowGap: "10px"
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            columnGap="5px"
          >
            <TextField
              value={code}
              label=""
              size="small"
              sx={{ border: "1px solid #fbfbfb", borderRadius: "5px" }}
              disabled
            />
            <Tooltip title="Copy Code">
              <ContentCopyRoundedIcon onClick={copyToClipboard} />
            </Tooltip>
          </Box>
          <Box>
            <FormControl
              sx={{
                display: "flex",
                justifyContent: "start",
                columnGap: "13px",
                marginTop: "5px"
              }}
            >
              <FormLabel id="demo-row-radio-buttons-group-label">
                Select Players
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={player}
                onChange={handlePlayer}
              >
                <FormControlLabel value={4} control={<Radio />} label="4" />
                <FormControlLabel value={6} control={<Radio />} label="6" />
              </RadioGroup>

              <FormLabel id="demo-row-radio-buttons-group-label">
                Select Mode
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={mode}
                onChange={handleMode}
              >
                <FormControlLabel
                  value="Hide"
                  control={<Radio />}
                  label="Hide"
                />
                <FormControlLabel value="Cut" control={<Radio />} label="Cut" />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snack}
        onClose={handleSnack}
        // message="Code copy successfully"
        autoHideDuration={3000}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
