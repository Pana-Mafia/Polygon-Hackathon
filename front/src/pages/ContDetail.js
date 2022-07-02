// 各種インポート
import { ethers } from "ethers";
import React, { useEffect, useState, useCallback } from "react";
import { Card, Box, Button, Chip } from "@mui/material";

import "../styles/index.css";
// import "../styles/index.styl";
import walletConnect from "../components/WalletConnect";
import addWallet from "../components/AddWallet";
import viewMember from "../components/viewMember";
import checkIfWalletIsConnected from "../components/CheckIfWalletIsConnected";
import {
  fetchBranches,
  fetchCommits,
  fetchSpecificCommits,
} from "../api-clients/index";

// Firebase関係
import { onSnapshot } from "firebase/firestore";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../components/Firebase";

function ContDetail() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [branches, setBranches] = useState([]);
  const [relatedCommits, setRelatedCommits] = useState([]);
  const [commits, setCommits] = useState([]);
  const [tmpCommits, setTmpCommits] = useState([]);

  // アドレス
  const [addressValue, setAddressValue] = useState("");
  // ユーザー一覧
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

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
      viewMember(value);
    })

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  useEffect(() => {
    const usersCollectionRef = collection(firebaseFirestore, "wallet");
    // リアタイ更新
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsub;
  }, []);

  const getAllUsers = async () => {
    const userCleaned = users.map((user) => {
      return {
        address: user.address
      };
    });
    setAllUsers(userCleaned);
  };


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
        <p>{JSON.stringify(relatedCommits)}</p>
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
        <br />
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
    </div >
  );
}

export default ContDetail;
