import React, { FC, useContext } from "react";
import { GlobalState } from "../../globalState";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../../constants";
import { Button } from "grommet";
import { BigNumber } from "ethers";

interface SetWinnerProps {
  team: string;
  fixtureID: BigNumber;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  refreshFixtureData: () => void;
}

const SetWinner: FC<SetWinnerProps> = (props) => {
  const { team, fixtureID, setShow, refreshFixtureData } = props;

  const { setTransactionError, bettingContract, setTxBeingSet } =
    useContext(GlobalState);

  const _setWinner = async (fixtureID: BigNumber, winner: string) => {
    try {
      setTransactionError(undefined);

      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      }

      const tx = await bettingContract.setWinner(fixtureID, winner);
      setTxBeingSet(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error("Caught error setting winner ", error);
      setTransactionError(error);
    } finally {
      setTxBeingSet(undefined);
      setShow(false);
      refreshFixtureData();
    }
  };

  return (
    <>
      <Button
        primary
        label={`Set winner as ${team}`}
        onClick={() => _setWinner(fixtureID, team)}
        margin='xsmall'
      />
    </>
  );
};

export default SetWinner;
