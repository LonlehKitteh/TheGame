import React, { useEffect, useRef } from "react";
import { GridEntry, useGame } from "../contexts/GameContext";

interface CellProps {
  cell: GridEntry;
  index: number;
}

const Cell: React.FC<CellProps> = ({ cell, index }): JSX.Element => {
  const { addRefToCell } = useGame();
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addRefToCell(cellRef, index);
  }, []);

  return (
    <div className="cell" ref={cellRef}>
      <div>{cell.name}</div>
    </div>
  );
};

export default Cell;
