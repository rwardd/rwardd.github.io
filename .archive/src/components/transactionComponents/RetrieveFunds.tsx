import React, { FC, useContext, useState } from "react";
import { Button } from "grommet";
import { Bet } from "../../types";
import { BigNumber } from "ethers";
import { GlobalState } from "../../globalState";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../../constants";

interface RetrieveFundsProps {
  bet: Bet;
  refreshBets: () => void;
}

/**
 * NOTE: Caller must have filtered out payedOut bets
 */
const RetrieveFunds: FC<RetrieveFundsProps> = (props) => {
  const { bet, refreshBets } = props;
  const { payOut, betId, invalidated } = bet;
  const [error, setError] = useState<null | Error>(null);
  const [status, setStatus] = useState("doing nothing");
  const { setTransactionError, bettingContract, setTxBeingSet } =
    useContext(GlobalState);

  const _retrieveFunds = async (betID: BigNumber) => {
    try {
      setTransactionError(undefined);

      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      }

      const tx = await bettingContract.retrieveFunds(betID);
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
    }
  };

  function getLabel(): string {
    if (invalidated) {
      return "Claim Refund";
    }
    if (payOut.gt(0)) {
      return "Claim Winnings";
    }
    if (payOut.isZero()) {
      return "In Progress";
    }

    return "Error";
  }

  async function claimWinnings(e: any) {
    e.preventDefault();
    setStatus("claiming");
    try {
      await _retrieveFunds(betId);
      refreshBets();
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setError(err);
        console.error(error);
      }
    }
  }

  return (
    <div>
      <Button
        primary
        label={status !== "claiming" ? getLabel() : "Claiming..."}
        disabled={payOut.isZero() || status === "claiming"}
        size='small'
        onClick={claimWinnings}
      />
    </div>
  );
};

export default RetrieveFunds;
