import React, { FC, useContext } from "react";
import { GlobalState } from "../../globalState";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../../constants";
import { Button } from "grommet";
import { BigNumber } from "ethers";

interface SetInvalidatedProps {
  fixtureID: BigNumber;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  refreshFixtureData: () => void;
}

const SetInvalidated: FC<SetInvalidatedProps> = (props) => {
  const { fixtureID, setShow, refreshFixtureData } = props;

  const { setTransactionError, bettingContract, setTxBeingSet } =
    useContext(GlobalState);

  const _setInvalidated = async (fixtureID: BigNumber) => {
    try {
      setTransactionError(undefined);

      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      }

      const tx = await bettingContract.setInvalidated(fixtureID);
      setTxBeingSet(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error("Caught error setting fixutre as invalidated ", error);
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
        label='Set Invalidated'
        onClick={() => _setInvalidated(fixtureID)}
        margin='xsmall'
      />
    </>
  );
};

export default SetInvalidated;
