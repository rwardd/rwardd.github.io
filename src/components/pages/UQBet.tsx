import React, { FC, useContext, useState } from "react";
import { GlobalState } from "../../globalState";
import { COLORS } from "../../theme";
import { ConnectWallet } from "../utils/ConnectWallet";
import Header from "../Header";
import { NoWalletDetected } from "../utils/NoWalletDetected";
import { Navigate } from "react-router-dom";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../../contracts/BetContract.json";
import contractAddress from "../../contracts/contract-address.json";
import UQBetDashboard from "../UQBetDashboard";
import { Web3Provider } from "@ethersproject/providers";

// This is the Hardhat Network id, you might change it in the hardhat.config.js.
// If you are using MetaMask, be sure to change the Network id to 1337.
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
export const HARDHAT_NETWORK_ID = "1337";

const UQBet: FC = () => {
  const {
    setNetworkError,
    selectedAddress,
    networkError,
    setSelectedAddress,
    setBalance,
    setContract,
    resetState,
  } = useContext(GlobalState);

  let _pollDataInterval: any;
  let _provider: Web3Provider;
  const [_contractOwner, _setContractOwner] = useState();

  /**
   * Function defintions
   */

  // This method checks if Metamask selected network is Localhost:8545
  function _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError("Please connect Metamask to Localhost:8545");

    return false;
  }

  async function _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    _provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    let contract = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      _provider.getSigner(0)
    );

    setContract(contract);
    _setContractOwner((await contract.owner()).toLowerCase());
  }

  async function _updateEthBalance(userAddress: string) {
    const balance = ethers.utils.formatEther(
      await _provider.getBalance(userAddress)
    );

    // Limit to two decimal places
    setBalance(Number(balance).toFixed(2));
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  function _startPollingData(userAddress: string) {
    _pollDataInterval = setInterval(() => _updateEthBalance(userAddress), 1000);

    // We run it once immediately so we don't have to wait for it
    _updateEthBalance(userAddress);
  }

  function _stopPollingData() {
    clearInterval(_pollDataInterval);
    _pollDataInterval = undefined;
  }

  function _initialize(userAddress: string) {
    // First we initialize ethers
    _initializeEthers();

    // Then we store the user's address in the component's state
    setSelectedAddress(userAddress);

    // Start polling the users eth balance
    _startPollingData(userAddress);
  }

  // This method just clears part of the state.
  function _dismissNetworkError() {
    setNetworkError(undefined);
  }

  // This method is run when the user clicks the Connect. It connects the
  // dapp to the user's wallet, and initializes it.
  async function _connectWallet() {
    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [accountAddy] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!_checkNetwork()) {
      return;
    }

    _initialize(accountAddy);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", (newAddress: any) => {
      _stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (resetState) {
        resetState();
      }

      document.location.replace("/");
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", () => {
      _stopPollingData();
      if (resetState) {
        return resetState();
      }
    });
  }

  /**
   * Return statements
   */

  document.body.style.backgroundColor = COLORS.purple;

  // Ethereum wallets inject the window.ethereum object. If it hasn't been
  // injected, we instruct the user to install MetaMask.
  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  // The next thing we need to do, is to ask the user to connect their wallet.
  // When the wallet gets connected, we are going to save the users's address
  // in the component's state. So, if it hasn't been saved yet, we have
  // to show the ConnectWallet component.
  //
  // Note that we pass it a callback that is going to be called when the user
  // clicks a button. This callback just calls the _connectWallet method.
  if (!selectedAddress) {
    return (
      <ConnectWallet
        connectWallet={() => _connectWallet()}
        networkError={networkError}
        dismiss={() => _dismissNetworkError()}
      />
    );
  }

  // Connected address is owner of the contract.
  if (selectedAddress === _contractOwner) {
    return (
      <>
        <Navigate to='/admin' />
      </>
    );
  }

  return (
    <>
      <Header />
      <UQBetDashboard />
    </>
  );
};

export default UQBet;
