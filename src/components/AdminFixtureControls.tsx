import React, { FC, useState } from "react";
import { Button } from "grommet";
import { Fixture } from "../types";
import SetResultModal from "./ConfirmResultModal";

interface AdminFixtureControlProps {
  fixture: Fixture;
  refreshFixtureData: () => void;
}

const AdmimFixtureControls: FC<AdminFixtureControlProps> = (props) => {
  const { fixture, refreshFixtureData } = props;
  const [showModal, setShowModal] = useState(false);

  function getLabel(): string {
    if (fixture.active) {
      return "Set Result";
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
    <div>
      <Button
        primary
        label={getLabel()}
        disabled={!fixture.active}
        size='small'
        onClick={() => setShowModal(true)}
      />
      {fixture.active && (
        <SetResultModal
          setShow={setShowModal}
          show={showModal}
          fixture={fixture}
          refreshFixtureData={refreshFixtureData}
        />
      )}
    </div>
  );
};

export default AdmimFixtureControls;
