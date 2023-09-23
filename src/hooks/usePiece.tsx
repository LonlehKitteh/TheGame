import { useState, useRef, useCallback, useEffect } from "react";
import { PieceType, useGame } from "../contexts/GameContext";
import { useScore } from "../contexts/ScoreContext";
import {
  defaultTile,
  findNearestCell,
  calcCenterPoint,
  possibleToSell,
} from "../modules/Piece/utils";

export const usePiece = (piece: PieceType) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const [tile, setTile] = useState(defaultTile);
  const { game, addPieceToCell } = useGame();
  const { addSomeGold } = useScore();

  const handleDragStart = useCallback(() => {
    setTile((prev) => ({
      ...prev,
      startingPosition: calcCenterPoint(pieceRef),
      animate: "active",
    }));
  }, [tile]);

  const handleDragEnd = useCallback(
    (event: PointerEvent) => {
      const nearestCell = findNearestCell(game, event, tile);

      if (!nearestCell) {
        if (possibleToSell(game, event)) {
          sellPiece();
          return;
        }

        setTile((prev) => ({
          ...prev,
          animate: "return",
        }));
        return;
      }

      setTile((prev) => ({
        ...prev,
        animate: "drag",
        nearestCell: nearestCell.cell,
        vector: nearestCell.vector,
      }));
    },
    [tile]
  );

  const hidePiece = () => {
    if (tile.animate !== "drag") return;
    addPieceToCell(tile.nearestCell, piece);
    setTile((prev) => ({ ...prev, animate: "inactive" }));
  };

  const sellPiece = () => {
    addSomeGold(piece.sell);
    setTile((prev) => ({ ...prev, animate: "sell" }));
  };

  // useEffect(() => {
  //   console.log(tile.animate);
  // }, [tile]);

  return { tile, pieceRef, handleDragEnd, handleDragStart, hidePiece };
};

export default usePiece;
