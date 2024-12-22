import React, { FC, useContext, useState } from "react";
import { Button } from "grommet";
import { GlobalState } from "../../globalState";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../../constants";

interface TakeEarningsProps {
  style?: React.CSSProperties;
}

const TakeEarnings: FC<TakeEarningsProps> = (props) => {
  const { setTransactionError, bettingContract, setTxBeingSet } =
    useContext(GlobalState);
  const { style } = props;
  const [error, setError] = useState<null | Error>(null);
  const [status, setStatus] = useState("typing");

  const _drainContract = async () => {
    try {
      setTransactionError(undefined);

      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      }

      const tx = await bettingContract.takeEarnings();
      setTxBeingSet(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error("Caught error trying to take earnings ", error);
      setTransactionError(error);
    } finally {
      setTxBeingSet(undefined);
    }
  };

  async function takeEarnings(e: any) {
    e.preventDefault();
    setStatus("draining...");
    try {
      await _drainContract();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setError(err);
        console.error(status);
        console.error(error);
      }
    }
  }

  return (
    <Button
      primary
      label="Take Earnings"
      style={style}
      onClick={takeEarnings}
    />
  );
};

export default TakeEarnings;
