import authAxios from "../http/authAxios";

export const baseUrl =
  import.meta.env.VITE_MODE === "development"
    ? "http://192.168.0.72:4001"
    : "https://type-shop.herokuapp.com";

export const toastTypes = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
  default: "default"
};

export const useAuth = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const res = authAxios.get("/auth/authUser", {
        headers: {
          Authorization: token
        }
      });
      console.log("res === ", res);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

export const useRoomAuth = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));

    const res = await authAxios.get("/auth/authUser", {
      headers: {
        Authorization: userInfo.token
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};

// set all players postions css
export const playerPositions = [
  {
    style: {
      height: "80px",
      width: "80px",
      border: "2px solid white",
      position: "absolute",
      bottom: "80px",
      right: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "azure",
      borderRadius: "15px",
      transform: "translateX(50%)"
    }
  },
  {
    style: {
      height: "80px",
      width: "80px",
      border: "2px solid white",
      position: "absolute",
      left: "280px",
      top: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "azure",
      borderRadius: "15px",
      transform: "translateY(-50%)"
    }
  },
  {
    style: {
      height: "80px",
      width: "80px",
      border: "2px solid white",
      position: "absolute",
      left: "490px",
      top: "125px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "azure",
      borderRadius: "15px"
    }
  },
  {
    style: {
      height: "80px",
      width: "80px",
      border: "2px solid white",
      position: "absolute",
      top: "80px",
      right: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "azure",
      borderRadius: "15px",
      transform: "translateX(50%)"
    }
  },
  {
    style: {
      height: "80px",
      width: "80px",
      border: "2px solid white",
      position: "absolute",
      right: "490px",
      top: "125px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "azure",
      borderRadius: "15px"
    }
  },
  {
    style: {
      height: "80px",
      width: "80px",
      border: "2px solid white",
      position: "absolute",
      right: "280px",
      top: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "azure",
      borderRadius: "15px",
      transform: "translateY(-50%)"
    }
  }
];

function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export function distributedCard(array, players) {
  const removeCards = ["F2", "L2", "K2", "C2"];
  if (players == 6) {
    array = array.filter((ele) => !removeCards.some((i) => ele.includes(i)));
  }

  const arr1 = shuffle(array);
  const ans = [];
  const cards = arr1.length / players;
  for (let index = 0; index < players; index++) {
    ans.push(arr1.slice((index + 1 - 1) * cards, (index + 1) * cards));
  }
  return ans;
}

export function assignTurn(cardsArray, players) {
  const ans = [];
  for (let i = 0; i < players; i++) {
    const randomIndex = Math.floor(Math.random() * cardsArray.length - 1) + 1;
    ans.push(cardsArray[randomIndex]);
    cardsArray.splice(randomIndex, 1);
  }
  return ans;
}

export const tableCardPositions = [
  {
    width: "85px",
    height: "125px",
    border: "2px solid black",
    position: "absolute",
    bottom: "0"
  },
  {
    width: "85px",
    height: "125px",
    border: "2px solid black",
    position: "absolute",
    left: "25px",
    transform: "rotate(90deg)"
  },
  {
    width: "85px",
    height: "125px",
    border: "2px solid black",
    position: "absolute",
    left: "148px",
    transform: "rotate(140deg)",
    top: "10px"
  },
  {
    width: "85px",
    height: "125px",
    border: "2px solid black",
    position: "absolute",
    top: "0"
  },
  {
    width: "85px",
    height: "125px",
    border: "2px solid black",
    position: "absolute",
    right: "148px",
    transform: "rotate(-140deg)",
    top: "10px"
  },

  {
    width: "85px",
    height: "125px",
    border: "2px solid black",
    position: "absolute",
    right: "25px",
    transform: "rotate(90deg)"
  }
];
