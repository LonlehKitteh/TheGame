import React, { useEffect, useState } from "react";
import Piece from "./Piece";
import options from "../../config.json";
import { PieceType } from "../../contexts/GameContext";

const pieces: PieceType[] = [
  { name: "1", sell: 100 },
  { name: "2", sell: 200 },
];

const generateRandomPiece = () => {
  return pieces[Math.floor(Math.random() * pieces.length)];
};

const RandomPieceGen: React.FC = () => {
  const [time, setTime] = useState(options.tiles.pieceCycleTime);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    interval = setInterval(() => {
      setTime((prev) =>
        prev - options.time.defaultTimeTick * 1000 < 0
          ? options.tiles.pieceCycleTime
          : prev - options.time.defaultTimeTick * 1000
      );
    }, options.time.defaultTimeTick * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="random-component-gen">
      <div>{time}</div>
      {time > 0 && <Piece piece={generateRandomPiece()} />}
    </div>
  );
};

export default RandomPieceGen;
