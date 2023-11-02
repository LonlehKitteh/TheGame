import React from "react";
import { motion } from "framer-motion";
import { pieceTransition } from "../../modules/Piece/utils";
import { GridEntry } from "../../modules/Piece/types";

interface CellProps {
  cell: GridEntry;
}

const variants = {
  active: {
    scale: 1,
    borderRadius: 10,
  },
  inactive: {
    scale: 0,
    borderRadius: 100,
  },
};

const Cell: React.FC<CellProps> = ({ cell }) => {
  return (
    <div className="cell">
      <motion.div
        className={cell.insideCell.rule}
        initial="initial"
        variants={variants}
        transition={pieceTransition}
        animate={cell.animate}
      />
    </div>
  );
};

export default Cell;
