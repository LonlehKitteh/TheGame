import { GameType, PieceType, emptyCell } from "../../contexts/GameContext";
import { Cords, NearestCellType, TileType } from "./types";
import options from "../../config.json";

const defaultCords: Cords = { x: 0, y: 0 };

const defaultTile: TileType = {
  nearestCell: emptyCell,
  startingPosition: defaultCords,
  vector: defaultCords,
  animate: "active",
  isDropped: false,
};

// Piece variables
const pieceVariants = {
  initial: { scale: 0 },
  active: { scale: 1, rotate: 0 },
  drag: { scale: 0, rotate: 270 },
  return: {
    scale: 1,
    rotate: 0,
  },
  sell: {
    scale: 0,
    rotate: 45,
    radius: "50%",
  },
  inactive: { scale: 0 },
};

const pieceTransition = {
  duration: 0.7,
  ease: "anticipate",
};

/**
 * Finds the nearest empty cell in the game grid to a given event position.
 *
 * @param {GameType} game - The game instance.
 * @param {PointerEvent} event - The pointer event containing the position.
 * @param {TileType} tile - The tile to find the nearest cell for.
 * @returns {NearestCellType} An object containing the nearest empty cell, its distance, and vector.
 */
const findNearestCell = (
  game: GameType,
  event: PointerEvent,
  tile: TileType
): NearestCellType => {
  return game.grid
    .filter((cell) => cell.isEmpty)
    .map((cell) => {
      if (!cell.ref)
        return { cell: emptyCell, distance: 0, vector: defaultCords };

      const centerPoint = calcCenterPoint(cell.ref);

      return {
        cell: cell,
        distance: Math.sqrt(
          Math.pow(centerPoint.x - event.x, 2) +
            Math.pow(centerPoint.y - event.y, 2)
        ),
        vector: {
          x: centerPoint.x - tile.startingPosition.x,
          y: centerPoint.y - tile.startingPosition.y,
        },
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .filter((cell) => cell.distance < options.grid.maxDragDistance)[0];
};

const possibleToSell = (game: GameType, event: PointerEvent): boolean => {
  if (!game.trashCan) return false;
  const trashCanPos = calcCenterPoint(game.trashCan);

  return [trashCanPos.x - event.x, trashCanPos.y - event.y].every(
    (e) => Math.abs(e) < options.grid.maxTrashDistance
  );
};

/**
 * Calculates center point of an HTML element.
 *
 * @param {React.RefObject<HTMLDivElement>} ref - The reference to the HTML element.
 * @returns {Cords} An object representing the x and y coordinates of center.
 */
const calcCenterPoint = (ref: React.RefObject<HTMLDivElement>): Cords => {
  const rect = ref.current?.getBoundingClientRect();

  let position = defaultCords;
  if (rect)
    position = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };

  return position;
};

/**
 * Generates random Piece from an array of Pieces.
 *
 * @returns {PieceType} Random Piece object.
 */
const generateRandomPiece = (): PieceType => {
  return options.pieces.types[
    Math.floor(Math.random() * options.pieces.types.length)
  ];
};

export {
  calcCenterPoint,
  findNearestCell,
  defaultTile,
  generateRandomPiece,
  pieceTransition,
  pieceVariants,
  possibleToSell,
};
