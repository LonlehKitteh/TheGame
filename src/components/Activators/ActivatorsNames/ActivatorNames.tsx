import React from "react";
import { Stack } from "react-bootstrap";
import { ActivatorsType } from "src/modules/Score/types";
import ActivatorName from "./ActivatorName";
import { GameStats } from "src/modules/Game/rules";

type ActivatorNamesPropsType = {
  activators: ActivatorsType;
  destroyChance: number[];
};

const ActivatorNames: React.FC<ActivatorNamesPropsType> = ({ activators }) => {
  return (
    <Stack direction="vertical">
      {Object.keys(activators).map((activator) => (
        <ActivatorName key={activator} activator={activator as GameStats} />
      ))}
      <ActivatorName activator="destroyChance" />
    </Stack>
  );
};

export default ActivatorNames;
