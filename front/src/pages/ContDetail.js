// 各種インポート
import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";

import logo from "../assets/logo.svg";
import "../styles/App.css";
import walletConnect from "../components/WalletConnect";
import checkIfWalletIsConnected from "../components/CheckIfWalletIsConnected";
import { fetchBranches, fetchCommits } from "../api-clients/index";

function ContDetail() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [branches, setBranches] = useState([""]);
  const [commits, setCommits] = useState([""]);

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

  const branchItems = branches.map((item, index) => (
    <div key={index}>
      <p>{JSON.stringify(item?.name)}</p>
      <p>{JSON.stringify(item)}</p>
      <p>{JSON.stringify(item?.commit?.sha)}</p>
    </div>
  ));

  const commitsItems = commits.map((item, index) => (
    <div key={index}>
      <p>{JSON.stringify(item?.sha)}</p>
      <p>{JSON.stringify(item?.commit?.author)}</p>
    </div>
  ));

  return (
    <div className="App">
      <button className="waveButton" onClick={walletConnect}>
        Connect Wallet
      </button>
      <div>{branchItems}</div>
      <div>{commitsItems}</div>
    </div>
  );
}

export default ContDetail;
