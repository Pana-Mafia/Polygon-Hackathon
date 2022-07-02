// 各種インポート
import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Box,
  Button,
  Chip,
  Avatar,
  CardHeader,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import "../styles/index.css";
// import "../styles/index.styl";
import walletConnect from "../components/WalletConnect";
import addWallet from "../components/AddWallet";
import checkIfWalletIsConnected from "../components/CheckIfWalletIsConnected";
import {
  fetchBranches,
  fetchCommits,
  fetchSpecificCommits,
} from "../api-clients/index";

function ContDetail() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [branches, setBranches] = useState([]);
  const [relatedCommits, setRelatedCommits] = useState([]);
  const [commits, setCommits] = useState([]);
  const [tmpCommits, setTmpCommits] = useState([]);

  // アドレス
  const [addressValue, setAddressValue] = useState("");

  useEffect(() => {
    const getBranches = async () => {
      const branchesData = await fetchBranches();
      const relatedCommitsData = await Promise.all(
        branchesData.data.map(async (item, index) => {
          const tmpSpeCommi = await fetchSpecificCommits(item?.name);
          return tmpSpeCommi.data;
        })
      );
      setBranches(branchesData.data);
      setRelatedCommits(relatedCommitsData);
      return null;
    };

    getBranches();

    checkIfWalletIsConnected().then(function (value) {
      setCurrentAccount(value);
    });

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  const branchesAndCommits = branches.map((item, index) => {
    let newRelatedCommitsArr = relatedCommits[index].filter(
      (relatedCommitsItem) =>
        relatedCommitsItem?.commit?.committer?.name !== "GitHub"
      // &&
      // relatedCommitsItem?.sha === item?.commit?.sha
    );
    let totalYTCommitsArr = [];
    let totalYUCommitsArr = [];
    if (item.name === "main" || item.name === "master") {
      totalYTCommitsArr = newRelatedCommitsArr.filter(
        (relatedCommitsItem) => relatedCommitsItem?.author?.login === "ystgs"
      );
      totalYUCommitsArr = newRelatedCommitsArr.filter(
        (relatedCommitsItem) => relatedCommitsItem?.author?.login === "gtyuki83"
      );
    }
    const relatedCommitsArr = newRelatedCommitsArr.map(
      (relatedCommitsArrItem, index) => {
        console.log(relatedCommitsArrItem);
        return (
          <Card key={index} sx={{ my: 1 }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{}}
                  alt="avatar"
                  src={relatedCommitsArrItem?.committer?.avatar_url}
                />
              }
              title={relatedCommitsArrItem?.author?.login}
              subheader={relatedCommitsArrItem?.commit?.committer?.date}
            />
            <CardContent>
              <Typography variant="body2" color="text.primary">
                {relatedCommitsArrItem?.commit?.message}
              </Typography>
            </CardContent>
          </Card>
        );
      }
    );
    return (
      <Box
        key={index}
        className="column"
        sx={{
          width: 700,
          mx: 2,
          p: 2,
          backgroundColor: "rgb(240,240,240)",
        }}
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

        {item.name === "main" || item.name === "master" ? (
          <div>
            <Chip
              sx={{ width: 150, mt: 3.5 }}
              label="貢献Commit数"
              color="primary"
            />
            <Typography variant="body2" color="text.primary">
              ystgs: {totalYTCommitsArr?.length}
            </Typography>
            <Typography variant="body2" color="text.primary">
              gtyuki83: {totalYUCommitsArr?.length}
            </Typography>
          </div>
        ) : null}

        <Chip
          sx={{ width: 150, mt: 3.5 }}
          label="結びつくコミット"
          color="primary"
        />
        {relatedCommitsArr}
      </Box>
    );
  });

  return (
    <div className="cont-detail-wrapper">
      <Box sx={{ p: 2 }}>
        <button className="waveBtn" onClick={walletConnect}>
          Connect Wallet
        </button>
        <br />
        <textarea
          name="messageArea"
          className="form"
          placeholder="成果物のリンクを添付"
          type="text"
          id="riward"
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
        />
        <br />
        <button
          className="submitButton"
          onClick={() => {
            addWallet(currentAccount);
          }}
        >
          タスクを作成する
        </button>
      </Box>
      <div
        className="row"
        style={{
          overflowX: "scroll",
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
