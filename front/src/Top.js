// 各種インポート
import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import walletConnect from "./components/WalletConnect";
import checkIfWalletIsConnected from "./components/CheckIfWalletIsConnected";
import { fetchBranches, fetchCommits } from "./api-clients/index";

function Top() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [commits, setCommits] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const getBranches = async () => {
      const data = await fetchBranches();
      setBranches(data.data);
      return data.data;
    };
    const getCommits = async () => {
      const data = await fetchCommits();
      setCommits(data.data);
      return data.data;
    };

    getBranches();
    getCommits();

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
      {/* <p>{commits}</p>
      <p>{branches}</p> */}
    </div>
  );
}

export default Top;
