import React from "react";
import { Stack } from "react-bootstrap";
import "../../../styles/shop.scss";
import RandomPieceGen from "../Piece/RandomPieceGen";
import Market from "./Market";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarBattery } from "@fortawesome/free-solid-svg-icons";

const Shop: React.FC = () => {
  return (
    <Stack direction="vertical" className="shop justify-content-between h-100">
      <Stack
        className="p-3 devider justify-content-center align-items-center"
        style={{ flex: 0, position: "relative" }}
      >
        <div className="generator">
          <FontAwesomeIcon icon={faCarBattery} size="2x" color="white" />
        </div>
      </Stack>
      <RandomPieceGen />
      <Market />
    </Stack>
  );
};

export default Shop;
