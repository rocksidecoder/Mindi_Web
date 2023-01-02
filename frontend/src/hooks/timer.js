import { useState } from "react";

let intervalId = null;
const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isTimeEnd, setIsTimeEnd] = useState(false);

  const resetTimer = () => {
    clearInterval(intervalId);
    setIsTimeEnd(false);
    setTime(20);
    startTimer(20);
  };

  const startTimer = (timerValue) => {
    let currTime = timerValue;

    intervalId = setInterval(() => {
      if (currTime > 0) {
        currTime--;
        setTime(currTime);
      } else {
        setIsTimeEnd(true);
        clearInterval(intervalId);
      }
    }, 1000);
  };

  return {
    time,
    isTimeEnd,
    startTimer,
    resetTimer
  };
};

export default useTimer;
