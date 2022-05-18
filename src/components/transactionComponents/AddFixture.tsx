import React, { FC, useContext, useState } from "react";
import { GlobalState } from "../../globalState";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../../constants";
import { Box, Button, DateInput, Form, FormField, TextInput} from "grommet";

const AddFixture: FC = () => {
  const { setTransactionError, bettingContract, setTxBeingSet } =
    useContext(GlobalState);

  const [awayTeam, setAwayTeam] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<null | Error>(null);
  const [status, setStatus] = useState("typing");

  const _addFixture = async (home: string, away: string, date: string) => {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      setTransactionError(undefined);
      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      if (!bettingContract) {
        throw new Error("Betting Contract not available");
      }
      const tx = await bettingContract.addFixture(home, away, date);
      setTxBeingSet(tx.hash);
      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();
      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }
      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      // await this._updateBalance();
    } catch (error: any) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error("Caught error sending add fixture transaction: ", error);
      setTransactionError(error);
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      setTxBeingSet(undefined);
    }
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await _addFixture(homeTeam, awayTeam, date);
      setStatus("success");
      resetForm();
    } catch (err) {
      setStatus("typing");
      if (err instanceof Error) {
        setError(err);
      }
    }
  }

  function isFormEmpty(): boolean {
    if (date.length === 0 || awayTeam.length === 0 || homeTeam.length === 0) {
      return true;
    }

    return false;
  }

  function resetForm(): void {
    setAwayTeam("");
    setHomeTeam("");
    setDate("");
  }

  return (
    <>
      <Form onSubmit={handleSubmit} onReset={resetForm}>
        <FormField label='Home team' type='text'>
          <TextInput
            placeholder='Home team'
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
          />
        </FormField>
        <FormField label='Away team' type='text'>
          <TextInput
            placeholder='Away team'
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
          />
        </FormField>
        <FormField label='Date' type='date'>
          <DateInput
            format='dd/mm/yyyy'
            value={date}
            onChange={({ value }) =>
              setDate(new Date(value.toString()).toLocaleDateString())
            }
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
        {error !== null && <p className='Error'>{error.message}</p>}
      </Form>
    </>
  );
};

export default AddFixture;