import { Backdrop, Button, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Card from "./card";
import { cardsArray, newCardsArray, selectedHukam } from "../../utils/allCards";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {
  assignTurn,
  distributedCard,
  playerPositions,
  selectRandomDrawCard,
  tableCardPositions,
  toastTypes
} from "../../utils/helper";
import { userContext } from "../../context/userContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../context/socketContext";
import authAxios from "../../http/authAxios";
import toastMessage from "../../utils/toast";
import backgroundImg from "../../assets/cards/background.svg";
import blankImg from "../../assets/card-symbols/Blank.svg";
import useTimer from "../../hooks/timer";

const ShowCard = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { loginDetail } = useContext(userContext);
  const { socket } = useContext(SocketContext);
  const [allCard, setAllCard] = useState([]);
  const [isStart, setIsStart] = useState(false);
  const [userPositions, setUserPositions] = useState([]);
  const [host, setHost] = useState("");
  const { state } = useLocation();
  const [userGamePosition, setUserGamePosition] = useState([]);
  const [teamOne, setTeamOne] = useState([]);
  const [teamTwo, setTeamTwo] = useState([]);
  const [turn, setTurn] = useState();
  const [table, setTable] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const [currentDrawCard, setCurrentDrawCard] = useState("");
  const [hukam, setHukam] = useState("");
  const [isDrawAvailable, setIsDrawAvailable] = useState(false);
  const [teamsData, setTeamsData] = useState({
    team1: null,
    team2: null
  });
  const [backdrop, setBackdrop] = useState(false);
  const [winMsg, setWinMsg] = useState("");
  const { time, isTimeEnd, startTimer, resetTimer } = useTimer();

  const isShowBtnEnable =
    table.length != userGamePosition.length &&
    !isDrawAvailable &&
    turn === loginDetail.username &&
    currentDrawCard &&
    !hukam &&
    state.mode === "Hide";

  //set the player postion style according to total players
  const dropPosition =
    state?.totalPlayers === 4
      ? playerPositions.filter(
          (_ele, index) => !["3", "5"].includes(String(index + 1))
        )
      : playerPositions;

  //set the table card postion style according to total players
  const setTableCardPosition =
    state?.totalPlayers === 4
      ? tableCardPositions.filter(
          (_ele, index) => !["3", "5"].includes(String(index + 1))
        )
      : tableCardPositions;

  // find the loginUserPosition for set table cards
  const loginUserPosition = userGamePosition.length
    ? userGamePosition.find((ele) => ele.username === loginDetail.username)
    : null;

  useEffect(() => {
    // broadcast user postion message in room
    socket.on("broadCast:room", ({ message, user, data }) => {
      data?.length && setUserPositions(data);
      if (data?.length) {
        const team = makingTeam(data);
        setTeamOne(team[0]);
        setTeamTwo(team[1]);
      }
      // toastMessage(`${user || ""} ${message}`, toastTypes.success);
    });

    // for sorting the user
    socket.on("sorting:backUser", ({ data, start, timer }) => {
      // toastMessage(`${data.playerTurn} turn!`, toastTypes.success);
      const res = sortingUser(data.players);
      setIsStart(start);
      const team = makingTeam(res);
      setTeamOne(team[0]);
      setTeamTwo(team[1]);
      setTurn(data.playerTurn);
      setUserGamePosition(res);

      // start timer
      if (timer) startTimer(20);
    });

    //send the game detail
    socket.emit(
      "initial:gameDetail",
      { roomId: id, username: userInfo.username },
      (res) => {
        const response = sortingUser(res.cards);
        setIsStart(res.start);
        const team = makingTeam(response);
        setTeamOne(team[0]);
        setTeamTwo(team[1]);
        setTurn(res.turn);
        setUserGamePosition(response);
        setHukam(res.hukam);
        setTeamsData(res.teams);
        if (res.table?.length) {
          const drawCard = res.table[0].card
            .split("/src/assets/cards/")[1]
            .split(".")[0];
          setCurrentDrawCard(drawCard);

          const data = getCardTablePosition(res.table, response);
          setTable(data);
        } else {
          setTable([]);
          setCurrentDrawCard("");
        }
      }
    );

    // solve later ......
    socket.on("response:initialGameDetail", (res) => {
      console.log("response:initialGameDetail ====>", res);
    });

    // set the turn of user
    socket.on("response:handleTurn", (data) => {
      const res = sortingUser(data.data.players);
      setIsStart(data.start);
      const team = makingTeam(res);
      setTeamOne(team[0]);
      setTeamTwo(team[1]);
      setTurn(data.data.playerTurn);
      setUserGamePosition(res);
      setHukam(data.data.hukam);
      setTeamsData(data.data.teams);
      if (!data.data.table.length && data.winner) {
        setBackdrop(true);
        setWinMsg(`${data.winner.toUpperCase()} WIN GAME`);
        // toastMessage(`${data.winner} is win the game!`, toastTypes.success);
        setTimeout(() => {
          setBackdrop(false);
          navigate("/home", {
            replace: true
          });
        }, 4000);
      }
      if (data.data.table?.length) {
        const drawCard = data.data.table[0].card
          .split("/src/assets/cards/")[1]
          .split(".")[0];
        setCurrentDrawCard(drawCard);
        const resData = getCardTablePosition(data.data.table, res);
        setTable(resData);
      } else {
        setTable([]);
        setCurrentDrawCard("");
      }
      // reset timer
      resetTimer();
    });

    socket.on("response:showHukam", (data) => {
      const res = sortingUser(data.data.players);
      const team = makingTeam(res);
      setIsStart(true);
      setTeamOne(team[0]);
      setTeamTwo(team[1]);
      setTurn(data.data.playerTurn);
      setUserGamePosition(res);
      setHukam(data.data.hukam);
    });
  }, []);

  useEffect(() => {
    getPositions();
    setAllCard(cardsArray);
  }, []);

  // get the postions of all players
  const getPositions = async () => {
    try {
      const res = await authAxios.get(`/game/${id}`);
      setUserPositions(res.data.gameData?.players);
      const team = makingTeam(res.data.gameData?.players);
      setTeamOne(team[0]);
      setTeamTwo(team[1]);
      setHost(res.data.gameData?.host);
    } catch (error) {
      console.log(error);
    }
  };

  //select random draw card if isTimeEnd
  useEffect(() => {
    if (isTimeEnd && loginDetail.username === turn) {
      const currUserCards = userGamePosition.find(
        (i) => i.username === loginDetail.username
      );

      const resCard = selectRandomDrawCard(
        currUserCards.cards,
        currentDrawCard,
        hukam,
        isDrawAvailable
      );

      // show hukam when isTimeEnd
      if (isShowBtnEnable) {
        handleShowHukam();
        handleTurnClick(resCard);
      } else handleTurnClick(resCard);
    }
  }, [isTimeEnd, turn]);

  // start the game
  const handleStart = async () => {
    const res = distributedCard(allCard, state.totalPlayers);

    // assign random turn
    socket.emit(
      "assign:randomTurn",
      {
        roomId: id,
        cardData: assignTurn(newCardsArray, state.totalPlayers),
        timer: false
      },
      (res) => {}
    );

    // distribute cards
    setTimeout(() => {
      socket.emit(
        "sorting:sendUser",
        { roomId: id, cardData: res, timer: true },
        (res) => {
          console.log(res);
        }
      );
    }, 5000);
  };

  // assign the player position
  const assignPosition = (position) => {
    try {
      socket.emit(
        "assign:position",
        {
          roomId: id,
          position,
          userId: loginDetail._id,
          username: loginDetail.username
        },
        (res) => {
          setUserPositions(res.gameData.players);
          const team = makingTeam(res.gameData.players);
          setTeamOne(team[0]);
          setTeamTwo(team[1]);
          setHost(res.gameData.host);
        }
      );
    } catch (error) {
      console.log(error);
    }
    getPositions();
  };

  // sorting the user
  function sortingUser(data) {
    let login = JSON.parse(localStorage.getItem("user-info"));
    let loginUserPosition = data?.find((ele) => login._id === ele.user);

    let nextUserPosition = loginUserPosition?.position;
    const ans = [];

    data?.forEach(() => {
      nextUserPosition =
        nextUserPosition > state.totalPlayers ? 1 : nextUserPosition;
      if (state.totalPlayers >= nextUserPosition) {
        ans.push(data.find((ele) => ele.position == nextUserPosition));
      }
      nextUserPosition++;
    });
    return ans;
  }

  // making team
  const makingTeam = (user) => {
    let team1 = [];
    let team2 = [];

    for (let i = 1; i <= user?.length; i++) {
      if (user[i - 1]?.position % 2 !== 0) team1.push(user[i - 1]?.username);
      else team2.push(user[i - 1]?.username);
    }
    return [team1, team2];
  };

  // handle turn click
  function handleTurnClick(card) {
    const isCut =
      state.mode === "Cut" && !hukam && currentDrawCard && !isDrawAvailable;

    setTimeout(() => {
      socket.emit(
        "handle:turn",
        { roomId: id, turn, card, teamOne, teamTwo, isCut },
        (res) => {
          const response = sortingUser(res.data.players);
          setIsStart(res.start);
          const team = makingTeam(response);
          setTeamOne(team[0]);
          setTeamTwo(team[1]);
          setUserGamePosition(response);
          setTurn(res.data.playerTurn);
          setHukam(res.data.hukam);
          setTeamsData(res.data.teams);
          if (res.data.table?.length) {
            const drawCard = res.data.table[0].card
              .split("/src/assets/cards/")[1]
              .split(".")[0];
            setCurrentDrawCard(drawCard);
            const resData = getCardTablePosition(res.data.table, response);
            setTable(resData);
          } else {
            setTable([]);
            setCurrentDrawCard("");
          }
        }
      );
    }, 1500);
  }

  //set position of table card to all users
  const getCardTablePosition = (data, players) => {
    const userLoginInfo = JSON.parse(localStorage.getItem("user-info"));
    const ans = [];
    let current = players.find(
      (item) => item.username === userLoginInfo.username
    )?.position;

    data.forEach((item) => {
      let counter = 0;
      let curr = current;
      while (curr !== item.position) {
        if (curr === state.totalPlayers) {
          curr = 1;
          counter++;
        } else {
          curr++;
          counter++;
        }
      }
      ans.push({ ...item, style: counter });
    });
    return ans;
  };

  function handleShowHukam() {
    socket.emit("show:hukam", { roomId: id }, (data) => {
      const res = sortingUser(data.data.players);
      const team = makingTeam(res);
      setIsStart(true);
      setTeamOne(team[0]);
      setTeamTwo(team[1]);
      setTurn(data.data.playerTurn);
      setUserGamePosition(res);
      setHukam(data.data.hukam);
    });
  }

  //check draw card is available or not
  const checkIsDrawAvailable = (isDrawAvailable) => {
    setIsDrawAvailable(isDrawAvailable);
  };

  return (
    <div
      className="cardTable"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end"
      }}
    >
      <Paper
        elevation={20}
        sx={{
          position: "absolute",
          top: "26px",
          left: "25px",
          height: "150px",
          width: "230px"
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "16px",
            textTransform: "uppercase",
            marginTop: "10px"
          }}
        >
          Game Mode : {state.mode}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px"
          }}
        >
          <ul style={{ borderRight: "1px solid", paddingRight: "25px" }}>
            <div style={{ paddingBottom: "5px", fontWeight: "bold" }}>
              Team 1 &nbsp;&nbsp;
              <span
                style={{
                  height: "25px",
                  width: "24px",
                  fontSize: "12px",
                  fontWeight: "1000",
                  borderRadius: "50%",
                  background: "#5a4545",
                  color: "white",
                  padding: "5px 8px 5px"
                }}
              >
                {teamsData?.team1?.hands || 0}
              </span>
            </div>
            {teamOne.map((ele) => (
              <li style={{ listStyle: "none" }} key={ele}>
                {ele}
              </li>
            ))}

            {teamsData?.team1?.mindi.map((i) => (
              <img
                src={selectedHukam[i]}
                style={{ height: "13px", width: "13px", margin: "3px" }}
              />
            ))}
          </ul>
          <ul>
            <div style={{ paddingBottom: "5px", fontWeight: "bold" }}>
              Team 2 &nbsp;&nbsp;
              <span
                style={{
                  height: "25px",
                  width: "24px",
                  fontSize: "12px",
                  fontWeight: "1000",
                  borderRadius: "50%",
                  background: "#5a4545",
                  color: "white",
                  padding: "5px 8px 5px"
                }}
              >
                {teamsData?.team2?.hands || 0}
              </span>
            </div>
            {teamTwo.map((ele) => (
              <li style={{ listStyle: "none" }} key={ele}>
                {ele}
              </li>
            ))}
            {teamsData?.team2?.mindi.map((i) => (
              <img
                src={selectedHukam[i]}
                style={{ height: "13px", width: "13px", margin: "3px" }}
              />
            ))}
          </ul>
        </div>
      </Paper>

      {state.mode === "Hide" && isStart ? (
        <div
          style={{
            width: "75px",
            height: "110px",
            position: "absolute",
            top: "50px",
            left: "265px"
          }}
        >
          {!hukam ? (
            <img
              src={backgroundImg}
              style={{ height: "100%", width: "100%" }}
            />
          ) : (
            <div
              style={{ position: "relative", height: "100%", width: "100%" }}
            >
              <img src={blankImg} style={{ height: "100%", width: "100%" }} />
              <img
                src={selectedHukam[hukam]}
                style={{
                  height: "40px",
                  width: "40px",
                  position: "absolute",
                  right: "50%",
                  transform: "translate(50% , 50%)",
                  bottom: "50%"
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            width: "75px",
            height: "110px",
            position: "absolute",
            top: "50px",
            left: "265px"
          }}
        >
          {hukam && (
            <div
              style={{ position: "relative", height: "100%", width: "100%" }}
            >
              <img src={blankImg} style={{ height: "100%", width: "100%" }} />
              <img
                src={selectedHukam[hukam]}
                style={{
                  height: "40px",
                  width: "40px",
                  position: "absolute",
                  right: "50%",
                  transform: "translate(50% , 50%)",
                  bottom: "50%"
                }}
              />
            </div>
          )}
        </div>
      )}

      {loginDetail.username === turn && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            fontSize: "25px",
            textTransform: "uppercase",
            color: "greenyellow"
          }}
        >
          Your Turn
        </div>
      )}

      {/* display timer */}
      {isStart && (
        <div
          style={{
            display: " flex",
            alignItems: "center",
            justifyContent: "center",
            position: " absolute",
            top: " 10px",
            right: " 110px",
            height: " 60px",
            width: " 60px",
            border:
              time <= 5
                ? "4px solid rgb(231 70 70)"
                : "4px solid rgb(205, 231, 185)",
            borderRadius: "40px",
            color: "#241c22",
            fontWeight: "600",
            fontSize: "20px"
          }}
        >
          {time}
        </div>
      )}

      {!isStart
        ? dropPosition.map((ele, i) => (
            <div style={ele.style} key={i + 1}>
              {userPositions?.find((ele) => ele.position === i + 1) ? (
                <div onClick={(e) => e.stopPropagation()}>
                  {
                    userPositions?.find((ele) => ele.position === i + 1)
                      .username
                  }
                </div>
              ) : (
                <ControlPointIcon
                  sx={{ color: "#0b990b", fontSize: "35px" }}
                  onClick={() => assignPosition(i + 1)}
                />
              )}
            </div>
          ))
        : userGamePosition.map((ele, index) => {
            return (
              <div
                style={{
                  ...dropPosition[index].style,
                  backgroundColor:
                    turn === ele.username ? "lightblue" : "white",
                  boxShadow:
                    turn === ele.username
                      ? "0px 10px 13px -6px rgb(0 0 0 / 20%), 0px 20px 31px 3px rgb(0 0 0 / 14%), 0px 8px 38px 7px rgb(0 0 0 / 12%)"
                      : "none"
                }}
                key={index + 1}
              >
                {ele.cards.length === 1 && !hukam ? (
                  <Card allCard={ele.cards} />
                ) : (
                  index === 0 && (
                    <Card
                      allCard={ele.cards}
                      isTurn={turn === ele.username}
                      hukam={hukam}
                      handleTurnClick={handleTurnClick}
                      currentDrawCard={currentDrawCard}
                      checkIsDrawAvailable={checkIsDrawAvailable}
                      mode={state.mode}
                    />
                  )
                )}
                <div>
                  {/* display user name */}
                  {(ele.cards.length !== 1 || hukam) &&
                    index !== 0 &&
                    ele.username}
                </div>
              </div>
            );
          })}

      <div className="table">
        {table?.length
          ? table.map((ele, index) => {
              return (
                <div
                  key={ele.player}
                  style={
                    setTableCardPosition[
                      loginUserPosition.position === ele.position
                        ? 0
                        : ele.style
                    ]
                  }
                >
                  <img
                    src={ele.card}
                    style={{
                      width: "100%",
                      height: "100%"
                    }}
                  />
                </div>
              );
            })
          : ""}
      </div>

      {!isStart && loginDetail.username === host && (
        <Button
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)"
          }}
          disabled={userPositions.length != state.totalPlayers}
          variant="contained"
          onClick={handleStart}
        >
          Start
        </Button>
      )}

      {table.length != userGamePosition.length &&
      !isDrawAvailable &&
      turn === loginDetail.username &&
      currentDrawCard
        ? !hukam &&
          state.mode === "Hide" && (
            <Button
              sx={{
                position: "absolute",
                bottom: "18%",
                right: "200px"
              }}
              variant="contained"
              onClick={handleShowHukam}
            >
              Show
            </Button>
          )
        : ""}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <p style={{ color: "#a3ff85", fontSize: "110px", fontWeight: "500" }}>
          {} WIN GAME
        </p>
      </Backdrop>
    </div>
  );
};

export default ShowCard;
