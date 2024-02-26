import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useGame } from "src/contexts/GameContext";
import { useScore } from "src/contexts/ScoreContext";
import options from "src/config.json";
import { Button, Stack } from "react-bootstrap";
import ResizePrice from "./ResizePrice";
import styles from "src/styles/style.module.scss";
import { motion } from "framer-motion";
import { buttonVariants } from "src/components/Grid/Cell/CellPieceModal/Buttons/Buttons";

const ResizeGridButton: React.FC = () => {
  const { game, resizeGrid } = useGame();
  const { score, removeSomeGold, currentGameSpeed } = useScore();
  const { defaultSize, gridUpgrades } = options.grid;

  /**
   * Function is used to change size of grid.
   * @returns {void}
   */
  const resizeGridHandler = (): void => {
    if (Math.sqrt(game.grid.length) === defaultSize + gridUpgrades.length) return;

    const upgradeCost = gridUpgrades[Math.sqrt(game.grid.length) - defaultSize];

    if (upgradeCost.cost <= score.gold) {
      removeSomeGold(upgradeCost.cost);
      resizeGrid();
      return;
    }
  };

  const isMaxed = Math.sqrt(game.grid.length) === defaultSize + gridUpgrades.length;
  const cost = gridUpgrades[Math.sqrt(game.grid.length) - defaultSize].cost;

  return (
    <Stack
      direction="horizontal"
      style={{ backgroundColor: styles.toExpensive, borderRadius: "0.375rem", maxHeight: "46px" }}
    >
      {!isMaxed && <ResizePrice price={cost} />}
      <motion.div
        whileTap={cost > score.gold ? buttonVariants.reject : buttonVariants.success}
        transition={{
          duration: currentGameSpeed({ devider: 6000 }),
          ease: "easeInOut",
        }}
      >
        <Button variant="main" onClick={resizeGridHandler} disabled={isMaxed}>
          <Stack gap={3} direction="horizontal">
            <FontAwesomeIcon icon={faCirclePlus} />
            <b className="text text-uppercase">{isMaxed ? "Max Cells" : "Add Cells"}</b>
          </Stack>
        </Button>
      </motion.div>
    </Stack>
  );
};

export default ResizeGridButton;
