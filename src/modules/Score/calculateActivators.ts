import { checkCombos } from "../Game/checkCombos";
import { GameStats } from "../Game/types";
import { GridEntry } from "../Grid/types";
import { GameStatsType } from "./types";
import options from "src/config.json";

const calculateActivators = (grid: GridEntry[]) => {
  const activators = grid.map(({ insideCell, isDestroyed }) => {
    if (isDestroyed) return {} as GameStatsType;

    const activators = insideCell.activators;
    const result = {} as GameStatsType;

    for (const key in activators) {
      const activator = key as Exclude<GameStats, "default">;
      result[activator] = (activators[activator] || [])[insideCell.level - 1];
    }
    return result;
  });

  grid.forEach((entry) => {
    entry.insideCell.comboShape = [];
  });

  const rules = grid.map((entry) => entry.insideCell.rule);
  const uniqueRules = new Set(rules);

  const sumsOfActivators: GameStatsType = { ...options.score.gameStats };

  for (const obj of activators) {
    for (const key in obj) {
      const activator = key as Exclude<GameStats, "default">;
      sumsOfActivators[activator] = (sumsOfActivators[activator] || 0) + obj[activator];
    }
  }

  uniqueRules.forEach((rule) => {
    if (rule === "default") return;
    const combos = checkCombos(grid, rule);

    combos.results.forEach((result) => {
      result.ids.forEach((id, index) => {
        const shape = result.shape.map((row) => {
          return row.map((col) => {
            return { value: col, id: col === 1 ? id : -1 };
          });
        });
        grid[id].insideCell.comboShape = shape;
      });
    });

    for (const activatorKey of Object.keys(combos.activators).filter((key) => key !== "default")) {
      const activator = activatorKey as keyof typeof combos.activators;
      sumsOfActivators[activator] += combos.activators[activator];
    }
  });
  return sumsOfActivators;
};
export { calculateActivators };
