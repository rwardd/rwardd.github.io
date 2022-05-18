import { ethers } from "ethers";
import React, { ReactNode, useState } from "react";

// This is our global state

export const GlobalState = React.createContext<Partial<IGlobalState>>({});

export interface IGlobalState {
  // The user's address
  selectedAddress: string | undefined;
  setSelectedAddress: any;
  // The user's ethereum balance
  balance: any;
  setBalance: any;
  // The ID about transactions being sent
  txBeingSent: any;
  setTxBeingSet: any;
  // Any possible transaction error
  transactionError: any;
  setTransactionError: any;
  // Any network error
  networkError: any;
  setNetworkError: any;
  // The betting Contract
  bettingContract: ethers.Contract | undefined;
  setContract: any;
  // Function to reset state
  resetState: () => void;
}

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = (
  props
) => {
  const { children } = props;

  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [txBeingSent, setTxBeingSet] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);
  const [bettingContract, setContract] = useState(undefined);

  function resetState() {
    setSelectedAddress(undefined);
    setBalance(undefined);
    setTxBeingSet(undefined);
    setTransactionError(undefined);
    setNetworkError(undefined);
    setContract(undefined);
  }

  const initialState: IGlobalState = {
    selectedAddress,
    setSelectedAddress,
    balance,
    setBalance,
    txBeingSent,
    setTxBeingSet,
    transactionError,
    setTransactionError,
    networkError,
    setNetworkError,
    bettingContract,
    setContract,
    resetState,
  };

  return (
    <GlobalState.Provider value={initialState}>{children}</GlobalState.Provider>
  );
};
