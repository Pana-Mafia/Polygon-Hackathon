// 各種インポート
import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import { Card, Box, Button, Chip } from "@mui/material";

import "../styles/index.css";
// import "../styles/index.styl";
import walletConnect from "../components/WalletConnect";
import checkIfWalletIsConnected from "../components/CheckIfWalletIsConnected";
import {
  fetchBranches,
  fetchCommits,
  fetchSpecificCommits,
} from "../api-clients/index";

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

  const branchesAndCommits = branches.map((item, index) => {
    return (
      <Box
        key={index}
        className="column"
        sx={{ width: 500, mx: 2, px: 2, backgroundColor: "rgb(240,240,240)" }}
      >
        <Button variant="contained">{item?.name}</Button>

        <Chip sx={{ width: 150, mt: 3.5 }} label="リンク" color="secondary" />
        <a href={item?.commit?.url} target="_blank">
          Full JSON
        </a>

        <Chip
          sx={{ width: 150, mt: 3.5 }}
          label="ブランチ名"
          color="secondary"
        />
        <p>{item?.name}</p>

        <Chip sx={{ width: 150, mt: 3.5 }} label="ID" color="secondary" />
        <p>{item?.commit?.sha}</p>

        <Chip
          sx={{ width: 150, mt: 3.5 }}
          label="結びつくコミット"
          color="secondary"
        />
      </Box>
    );
  });

  const commitsItems = commits.map((item, index) => (
    <div key={index}>
      <p>{JSON.stringify(item?.sha)}</p>
      <p>{JSON.stringify(item?.commit?.author)}</p>
    </div>
  ));

  return (
    <div className="cont-detail-wrapper">
      <Box sx={{ p: 2 }}>
        <button className="waveBtn" onClick={walletConnect}>
          Connect Wallet
        </button>
      </Box>
      <div
        className="row"
        style={{
          overflowX: "scroll",
          overflowY: "scroll",
          height: "100%",
          width: "100%",
        }}
      >
        {branchesAndCommits}
      </div>
    </div>
  );
}

export default ContDetail;
