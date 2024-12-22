import React, { FC, useContext, useState } from "react";
import { GlobalState } from "../../globalState";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../../constants";
import { Box, Button, Form, FormField, Select, TextInput } from "grommet";
import { BigNumber, ethers } from "ethers";

interface PlaceBetProps {
  home: string;
  away: string;
  fixtureID: BigNumber;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  refreshBets: () => void;
}

const PlaceBet: FC<PlaceBetProps> = (props) => {
  const { home, away, fixtureID, setShow, refreshBets } = props;

  const [winner, setWinner] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<null | Error>(null);
  const [status, setStatus] = useState("typing");

  const { setTransactionError, bettingContract, setTxBeingSet } =
    useContext(GlobalState);

  const _placeBet = async (
    fixtureID: BigNumber,
    team: string,
    amount: BigNumber
  ) => {
    try {
      setTransactionError(undefined);

      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      }

      const tx = await bettingContract.placeBet(fixtureID, team, amount, {
        value: amount,
      });
      setTxBeingSet(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error("Caught error trying to place bet ", error);
      setTransactionError(error);
    } finally {
      setTxBeingSet(undefined);
    }
  };

  function resetForm(): void {
    setWinner("");
    setAmount(0);
  }

  function isFormEmpty(): boolean {
    if (winner === "" || amount === 0) {
      return true;
    }

    return false;
  }

  async function submitBet(e: any) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await _placeBet(
        fixtureID,
        winner,
        ethers.utils.parseEther(amount.toString())
      );
      setStatus("success");
      setShow(false);
      refreshBets();
    } catch (err) {
      setStatus("typing");
      if (err instanceof Error) {
        setError(err);
        console.error(error);
      }
    }
  }

  return (
    <>
      <Form value={"Hello"} onReset={resetForm} onSubmit={submitBet}>
        <FormField label='To Win'>
          <Select
            options={[home, away]}
            value={winner}
            onChange={({ option }) => setWinner(option)}
          />
        </FormField>
        <FormField htmlFor='text-input-id' label='Amount (ETH)'>
          <TextInput
            value={amount}
            type='number'
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </FormField>
        <Box direction='row' gap='medium' margin={{ top: "medium" }}>
          <Button
            type='submit'
            primary
            label='Submit'
            disabled={isFormEmpty() || status === "submitting"}
          />
          <Button type='reset' label='Reset' />
        </Box>
      </Form>
    </>
  );
};

export default PlaceBet;
