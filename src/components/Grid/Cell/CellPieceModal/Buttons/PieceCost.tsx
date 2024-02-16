import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Stack } from "react-bootstrap";
import { useScore } from "src/contexts/ScoreContext";
import { GridEntry } from "src/modules/Grid/types";
import styles from "src/styles/style.module.scss";

type PieceCostPropsType = {
  cell: GridEntry;
};

const PieceCost: React.FC<PieceCostPropsType> = ({ cell }) => {
  const { score } = useScore();

  return (
    <Stack direction="horizontal" gap={1} className="px-2">
      <b>{cell.insideCell.upgradeCost[cell.insideCell.level]}</b>
      <FontAwesomeIcon
        icon={faCoins}
        color={cell.insideCell.upgradeCost[cell.insideCell.level] > score.gold ? styles.background : styles.main}
      />
    </Stack>
  );
};

export default PieceCost;