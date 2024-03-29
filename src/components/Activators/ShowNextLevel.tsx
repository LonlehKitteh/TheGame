import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ActivatorsScales from "./ActivatorsScales/ActivatorsScales";
import { ActivatorsType } from "src/modules/Score/types";
import { motion } from "framer-motion";
import { useCell } from "src/contexts/CellContext";
import { useScore } from "src/contexts/ScoreContext";

const variants = {
  active: {
    scale: 1,
    x: 0,
  },
  inactive: {
    scale: 0,
    x: -50,
  },
};

type ShowNextLevelPropsType = {
  activators: ActivatorsType;
  level: number;
  show: boolean;
  destroyChance: number[];
};

const ShowNextLevel: React.FC<ShowNextLevelPropsType> = ({ destroyChance, activators, show, level }) => {
  const { cell } = useCell();
  const { score } = useScore();

  if (cell.insideCell.level === cell.insideCell.upgradeCost.length) return;
  return (
    <React.Fragment>
      <motion.div
        style={{ flex: 1, display: "flex" }}
        className="justify-content-center"
        initial="inactive"
        animate={show ? "active" : "inactive"}
        variants={variants}
        transition={{
          duration: score.speed.pieceTransition,
          ease: "anticipate",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeftLong} />
      </motion.div>
      <ActivatorsScales activators={activators} show={show} level={level} destroyChance={destroyChance} />
    </React.Fragment>
  );
};

export default ShowNextLevel;
