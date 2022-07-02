// 各種インポート
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import logo from './logo.svg';
import './App.css';

import walletConnect from "./components/WalletConnect";
import checkIfWalletIsConnected from "./components/CheckIfWalletIsConnected";

function Top() {

  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button className="waveButton" onClick={walletConnect}>
          Connect Wallet
        </button>
      </header>
    </div>
  );
}

export default Top;
