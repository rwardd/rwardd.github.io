import React, { FC, useState } from "react";
import { Button } from "grommet";
import { Fixture } from "../types";
import PlaceBetModal from "./PlaceBetModal";

interface FixtureControlProps {
  fixture: Fixture;
  refreshBets: () => void;
}

const FixtureControls: FC<FixtureControlProps> = (props) => {
  const { fixture, refreshBets } = props;
  const [showModal, setShowModal] = useState(false);

  function getLabel(): string {
    if (fixture.active) {
      return "Place bet";
    }
    if (fixture.invalidated) {
      return "Invalidated";
    }
    if (!fixture.active) {
      return `${fixture.winner} won`;
    }

    return "Error";
  }

  return (
    <>
      <Button
        primary
        label={getLabel()}
        disabled={!fixture.active}
        size='small'
        onClick={() => setShowModal(true)}
      />
      {fixture.active && (
        <PlaceBetModal
          setShow={setShowModal}
          show={showModal}
          fixture={fixture}
          refreshBets={refreshBets}
        />
      )}
    </>
  );
};

export default FixtureControls;
