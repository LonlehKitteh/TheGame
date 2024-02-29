import React, { useState, useContext, createContext, ReactElement, useCallback } from "react";
import options from "src/config.json";
import { GridEntry, PieceType } from "src/modules/Piece/types";
import { GameStats, GameType } from "src/modules/Game/types";
import { emptyCell } from "src/modules/Game/utils";
import { MatchingShape, findBiggestShapesInGrid } from "src/utils/findShapeIn2DArray";

export const initGameState: GameType = {
  gameOver: false,
  grid: Array(Math.pow(options.grid.defaultSize, 2))
    .fill(emptyCell)
    .map((emptyCell, id) => ({ ...emptyCell, insideCell: { ...emptyCell.insideCell, id: id } })),
  size: options.grid.defaultSize,
};

const checkCombos = (grid: GridEntry[], rule: GameStats) => {
  const foundPiece = options.pieces.types.find((piece) => piece.rule === rule);
  if (!foundPiece) return grid;
  const filteredGrid = grid.filter((entry) => entry.insideCell.rule === rule);

  const shapes = foundPiece.shapes
    .map((element) => {
      const shapeLength = element.shape.flat(1).reduce((acc, curr) => acc + curr, 0);
      if (shapeLength > filteredGrid.length) return [];
      return element.shape;
    })
    .filter((element) => element.flat(1).length !== 0 && element[0].length <= Math.sqrt(grid.length));

  shapes.sort((a, b) => {
    const lengthA = a.flat(1).reduce((acc, curr) => acc + curr, 0);
    const lengthB = b.flat(1).reduce((acc, curr) => acc + curr, 0);
    return lengthB - lengthA;
  });

  if (!shapes.length) return grid;

  const gridCells = grid.map((entry) => entry.insideCell);

  const foundShapes = findBiggestShapesInGrid(gridCells, shapes, rule);
  const results: MatchingShape[][] = [];
  foundShapes.forEach((shape) => {
    const result = [shape];
    foundShapes.forEach((element) => {
      if (new Set([...shape.ids, ...element.ids]).size === shape.ids.length + element.ids.length) result.push(element);
    });
    const isNewResult = results.every(
      (existingResult) => !existingResult.some((existingShape) => result.includes(existingShape))
    );
    if (isNewResult) results.push(result);
  });
  results.sort((a, b) => b.length - a.length);
  if (!results.length) return grid;

  grid.map((entry) => {
    entry.comboShape.shape = [];
  });

  results[0].forEach((foundShape) => {
    foundShape.ids.forEach((id) => {
      grid[id] = {
        ...grid[id],
        comboShape: {
          shape: foundShape.shape,
          ids: foundShape.ids,
        },
      };
    });
  });

  return grid;
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
        const foundIndex = prev.grid.findIndex((entry) => entry.ref === cell.ref);
        const newGrid = [...prev.grid];
        newGrid[foundIndex] = {
          ...newGrid[foundIndex],
          insideCell: { ...piece, id: foundIndex },
          isEmpty: false,
          animate: "active",
        };

        const updatedGrid = checkCombos(newGrid, piece.rule);

        return {
          ...prev,
          grid: updatedGrid,
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
    const { defaultSize, gridUpgrades } = options.grid;

    if (game.size === defaultSize + gridUpgrades.length) return;

    setGame((prev) => {
      const newTable = new Array(Math.pow(prev.size + 1, 2))
        .fill(emptyCell)
        .map((emptyCell, id) => ({ ...emptyCell, insideCell: { ...emptyCell.insideCell, id: id } }));

      for (let i = 0; i < prev.grid.length; i++) {
        newTable[i] = prev.grid[i];
      }

      return {
        ...prev,
        grid: newTable,
        size: prev.size + 1,
      };
    });
  }, [game, setGame]);

  const levelUp = useCallback(
    (cell: GridEntry) => {
      setGame((prev) => {
        const updatedGrid = prev.grid.map((gridCell) => {
          if (gridCell.insideCell.id === cell.insideCell.id) {
            return {
              ...gridCell,
              insideCell: {
                ...gridCell.insideCell,
                level: gridCell.insideCell.level + 1,
              },
            };
          }
          return gridCell;
        });
        return { ...prev, grid: updatedGrid };
      });
    },
    [setGame]
  );

  const destroyPiece = useCallback(
    (cell: GridEntry) => {
      setGame((prev) => {
        const updatedGrid = prev.grid.map((gridCell) => {
          if (gridCell.ref === cell.ref) {
            return {
              ...gridCell,
              isDestroyed: true,
            };
          }
          return gridCell;
        });

        return { ...prev, grid: updatedGrid };
      });
    },
    [setGame]
  );

  const repairPiece = useCallback(
    (cell: GridEntry) => {
      setGame((prev) => {
        const updatedGrid = prev.grid.map((gridCell) => {
          if (gridCell.insideCell.id === cell.insideCell.id) {
            return {
              ...gridCell,
              isDestroyed: false,
            };
          }
          return gridCell;
        });

        return { ...prev, grid: updatedGrid };
      });
    },
    [setGame]
  );

  return {
    game,
    gameLoseEvent,
    resizeGrid,
    defineRefForCells,
    addPieceToCell,
    levelUp,
    destroyPiece,
    repairPiece,
  };
};

const initContextState: ReturnType<typeof useGameContext> = {
  game: initGameState,
  gameLoseEvent: () => {},
  resizeGrid: () => {},
  defineRefForCells: () => {},
  addPieceToCell: () => {},
  levelUp: () => {},
  destroyPiece: () => {},
  repairPiece: () => {},
};

export const GameContext = createContext(initContextState);

type ChildrenType = {
  children?: ReactElement | null;
};

export const GameProvider = ({ children, ...initState }: ChildrenType & GameType) => {
  return <GameContext.Provider value={useGameContext(initState)}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const { game, gameLoseEvent, resizeGrid, defineRefForCells, addPieceToCell, levelUp, destroyPiece, repairPiece } =
    useContext(GameContext);

  return {
    game,
    gameLoseEvent,
    resizeGrid,
    defineRefForCells,
    addPieceToCell,
    levelUp,
    destroyPiece,
    repairPiece,
  };
};
