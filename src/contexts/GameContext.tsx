import React, {
  useState,
  useContext,
  createContext,
  ReactElement,
  useCallback,
} from "react";
import options from "../config.json";
import { GridEntry, PieceType } from "../modules/Piece/types";
import { GameType } from "../modules/Game/types";
import { useScore } from "./ScoreContext";

export const emptyPiece: PieceType = {
  description: "",
  buy: 0,
  rule: "",
  level: 0,
  uses: 0,
  id: 0,
  activators: {
    multiplier: 0,
    flatIncome: 0,
  },
};

export const emptyCell: GridEntry = {
  insideCell: emptyPiece,
  ref: null,
  isEmpty: true,
  animate: "inactive",
};

export const initGameState: GameType = {
  gameOver: false,
  grid: Array(Math.pow(options.grid.defaultSize, 2)).fill(emptyCell),
  size: options.grid.defaultSize,
};

const useGameContext = (defaultGame: GameType) => {
  const [game, setGame] = useState(defaultGame);

  const gameLoseEvent = useCallback(() => {
    setGame((prev) => ({
      ...prev,
      gameOver: true,
    }));
  }, [setGame]);

  const addPieceToCell = useCallback(
    (cell: GridEntry, piece: PieceType) => {
      setGame((prev) => {
        const foundIndex = prev.grid.findIndex(
          (entry) => entry.ref === cell.ref
        );
        const newGrid = [...prev.grid];
        newGrid[foundIndex] = {
          ...newGrid[foundIndex],
          insideCell: piece,
          isEmpty: false,
          animate: "active",
        };

        return {
          ...prev,
          grid: newGrid,
        };
      });
    },
    [setGame]
  );

  const defineRefForCells = useCallback(
    (newRefs: HTMLCollection) => {
      setGame((prev) => {
        const newGrid = prev.grid.map((entry, index) => ({
          ...entry,
          ref: newRefs[index] as HTMLDivElement,
        }));

        return {
          ...prev,
          grid: newGrid,
        };
      });
    },
    [setGame]
  );

  const resizeGrid = useCallback(() => {
    if (game.size === options.grid.maxSize) return;

    setGame((prev) => {
      const newTable = new Array(Math.pow(prev.size + 1, 2)).fill(emptyCell);

      for (let i = 0; i < prev.grid.length; i++) {
        newTable[i] = prev.grid[i];
      }

      return {
        ...prev,
        grid: newTable,
        size: prev.size + 1,
      };
    });
  }, [game, options.grid.maxSize, setGame]);

  return {
    game,
    gameLoseEvent,
    resizeGrid,
    defineRefForCells,
    addPieceToCell,
  };
};

const initContextState: ReturnType<typeof useGameContext> = {
  game: initGameState,
  gameLoseEvent: () => {},
  resizeGrid: () => {},
  defineRefForCells: () => {},
  addPieceToCell: () => {},
};

export const GameContext = createContext(initContextState);

type ChildrenType = {
  children?: ReactElement | null;
};

export const GameProvider = ({
  children,
  ...initState
}: ChildrenType & GameType) => {
  return (
    <GameContext.Provider value={useGameContext(initState)}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const { game, gameLoseEvent, resizeGrid, defineRefForCells, addPieceToCell } =
    useContext(GameContext);

  return {
    game,
    gameLoseEvent,
    resizeGrid,
    defineRefForCells,
    addPieceToCell,
  };
};
