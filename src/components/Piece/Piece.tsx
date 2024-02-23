import React from "react";
import { motion } from "framer-motion";
import { gridVariants } from "src/modules/Grid/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import options from "src/config.json";
import { useScore } from "src/contexts/ScoreContext";
import { piecesIcons } from "src/modules/Piece/statsIcons";
import { useCell } from "src/contexts/CellContext";
import { PieceType } from "src/modules/Piece/types";
import { emptyCell, emptyPiece } from "src/modules/Game/utils";

type PiecePropsType = {
  piece?: PieceType;
  show?: boolean;
};

const Piece: React.FC<PiecePropsType> = ({ piece = emptyPiece, show = false }) => {
  const { currentGameSpeed } = useScore();
  const { cell } = useCell();

  const motionProps = {
    initial: "inactive",
    variants: gridVariants,
    transition: {
      duration: currentGameSpeed({
        defaultTimeTick: options.time.defaultPieceTransition,
        devider: 1000,
      }),
      ease: "anticipate",
    },
    animate: show ? "active" : cell !== emptyCell ? cell.animate : "inactive",
    className: `piece ${cell !== emptyCell ? cell.insideCell.rule : piece.rule}`,
  };

  return (
    <motion.div {...motionProps}>
      {(cell !== emptyCell && cell.insideCell.rule !== "default") || piece.rule !== "default" ? (
        <FontAwesomeIcon icon={piecesIcons[cell !== emptyCell ? cell.insideCell.rule : piece.rule]} size="3x" />
      ) : null}
    </motion.div>
  );
};

export default Piece;