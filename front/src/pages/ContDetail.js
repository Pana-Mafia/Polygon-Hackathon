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
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [tmpCommits, setTmpCommits] = useState([]);

  useEffect(() => {
    const getBranches = async () => {
      const tmpData = await fetchBranches();
      const data = await tmpData.data.map(async (item, index) => {
        const tmpSpeCommi = fetchSpecificCommits(item?.name);
        item.relatedCommits = tmpSpeCommi?.data;
        return item;
      });
      console.log(data);
      setBranches(data);
      return data;
    };

    getBranches();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);
  // useEffect(() => {
  //   let data = branches.map(async (item, index) => {
  //     const tmpSpeCommi = await fetchSpecificCommits(item?.name);
  //     item.relatedCommits = tmpSpeCommi?.data;
  //     console.log(item);
  //     return item;
  //   });
  //   setBranches(data); // and then update the state
  //   console.log(data);
  // }, [setBranches]);

  const branchesAndCommits = branches.map((item, index) => {
    return (
      <Box
        key={index}
        className="column"
        sx={{ width: 500, mx: 2, p: 2, backgroundColor: "rgb(240,240,240)" }}
      >
        <Button variant="contained">{item?.name}</Button>

        <Chip sx={{ width: 150, mt: 3.5 }} label="リンク" color="primary" />
        <a href={item?.commit?.url} target="_blank">
          Full JSON
        </a>

        <Chip sx={{ width: 150, mt: 3.5 }} label="ブランチ名" color="primary" />
        <p>{item?.name}</p>

        <Chip sx={{ width: 150, mt: 3.5 }} label="ID" color="primary" />
        <p>{item?.commit?.sha}</p>

        <Chip
          sx={{ width: 150, mt: 3.5 }}
          label="結びつくコミット"
          color="primary"
        />
        <p>{JSON.stringify(item)}</p>
      </Box>
    );
  });

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
