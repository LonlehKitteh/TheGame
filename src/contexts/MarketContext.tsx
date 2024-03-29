import React, { useState, useContext, createContext, ReactElement, useCallback, useEffect } from "react";
import { PieceType } from "src/modules/Piece/types";
import options from "src/config.json";
import { ScoreType } from "src/modules/Score/types";
import { useScore } from "./ScoreContext";

export type ActiveStateType = "Market" | "Upgrades";

type MarketContentType = {
  pieces: PieceType[];
  activeState: ActiveStateType;
};

export const initMarketState: MarketContentType = {
  pieces: options.pieces.types as unknown as PieceType[],
  activeState: "Market",
};

const useMarketContext = (defaultMarketState: MarketContentType) => {
  const [marketContent, setMarketContent] = useState(defaultMarketState);

  const changeMarketState = useCallback(
    (newPieceState: PieceType) => {
      setMarketContent((prev) => {
        const updatedMarket = [...prev.pieces];
        const index = updatedMarket.findIndex((piece) => piece.rule === newPieceState.rule);

        if (index !== -1) updatedMarket[index] = newPieceState;

        return { ...prev, pieces: updatedMarket };
      });
    },
    [setMarketContent]
  );

  const changeActiveState = useCallback(
    (newActivetate: ActiveStateType) => setMarketContent((prev) => ({ ...prev, activeState: newActivetate })),
    [setMarketContent]
  );

  const changePrices = useCallback(
    (score: ScoreType) => {
      setMarketContent((prev) => ({
        ...prev,
        pieces: prev.pieces.map((piece) => ({
          ...piece,
          upgradeCost: options.pieces.types
            .find((element) => element.rule === piece.rule)!
            .upgradeCost.map((cost) => Math.round(cost * (1 - score.gameStats.discount))),
        })),
      }));
    },
    [setMarketContent]
  );

  return { changeActiveState, changeMarketState, marketContent, changePrices };
};

const initContextState: ReturnType<typeof useMarketContext> = {
  marketContent: initMarketState,
  changeActiveState: () => {},
  changeMarketState: () => {},
  changePrices: () => {},
};

export const MarketContext = createContext(initContextState);

type ChildrenType = {
  children?: ReactElement | null;
};

export const MarketProvider = ({ children, ...initState }: ChildrenType & MarketContentType) => {
  const { score } = useScore();
  const { changePrices, ...contextValue } = useMarketContext(initState);

  useEffect(() => changePrices(score), [score.gameStats.discount]);

  return <MarketContext.Provider value={{ ...contextValue, changePrices }}>{children}</MarketContext.Provider>;
};

export const useMarket = () => {
  const { changeActiveState, changeMarketState, marketContent } = useContext(MarketContext);

  return {
    changeActiveState,
    changeMarketState,
    marketContent,
  };
};
