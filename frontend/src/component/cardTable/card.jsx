import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const hoverStyle = {
  borderRadius: "4px",
  width: "50px",
  transform: "translateY(-30px)",
  zIndex: -1
};

const Card = ({
  allCard,
  isTurn,
  hukam,
  handleTurnClick,
  currentDrawCard,
  checkIsDrawAvailable,
  mode
}) => {
  const [hover, setHover] = useState(null);
  const [selectedCard, setSelectedCard] = useState({
    isClick: false,
    card: ""
  });

  const isDrawAvailable = allCard?.some((i) => {
    return (
      i.split("/src/assets/cards/")[1].split(".")[0][0] == currentDrawCard?.[0]
    );
  });

  const selectDrawCard = (val) => {
    if (isTurn) {
      if (!currentDrawCard) {
        return true;
      } else {
        if (!isDrawAvailable) return mode === "Cut" ? true : !!hukam;

        return (
          val.split("/src/assets/cards/")[1].split(".")[0][0] ===
          currentDrawCard[0]
        );
      }
    }
    return false;
  };

  useEffect(() => {
    if (checkIsDrawAvailable) {
      checkIsDrawAvailable(isDrawAvailable);
    }
  }, [isDrawAvailable]);

  return (
    <div style={{ display: "flex", marginRight: "35px" }}>
      {allCard.map((val, index) => (
        <motion.div
          key={index}
          elevation={3}
          style={{
            borderRadius: "4px",
            width: "50px"
          }}
          animate={
            selectedCard.isClick && val === selectedCard.card
              ? {
                  x: 80,
                  y: -245,
                  rotate: 180,
                  scale: 0.7
                  // transform: "translate(-50%, -50%)",
                  // position: "absolute",
                  // right: "50%",
                  // top: "-230px"
                }
              : ""
          }
          initial={{
            // opacity: isTurn ? 1 : 0.5,
            userSelect: selectDrawCard(val) ? "unset" : "none"
            // y: 750
          }}
          transition={{
            type: "spring",
            bounce: 0.15
          }}
          onClick={() => {
            if (selectDrawCard(val)) {
              setSelectedCard({ isClick: true, card: val });
              handleTurnClick(val);
            }
          }}
        >
          <img
            src={val}
            onMouseEnter={() => {
              selectDrawCard(val) && setHover(index);
            }}
            onMouseLeave={() => setHover(null)}
            style={{
              userSelect: selectDrawCard(val) ? "unset" : "none",
              boxShadow:
                "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
              borderRadius: "12px",
              height: "100%",
              maxHeight: "220px",
              transform: hover === index ? "translateY(-25px)" : "none"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Card;
