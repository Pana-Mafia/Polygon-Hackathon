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

import abi from "../utils/CreateNFT.json";

function ContDetail() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [branches, setBranches] = useState([]);
  const [relatedCommits, setRelatedCommits] = useState([]);
  const [commits, setCommits] = useState([]);
  const [tmpCommits, setTmpCommits] = useState([]);
  const [yuCommits, setYuCommits] = useState([]);
  const [ytCommits, setYtCommits] = useState([]);

  const [totalYTCommitsArr, setTotalYTCommitsArr] = useState([]);
  const [totalYUCommitsArr, setTotalYUCommitsArr] = useState([]);

  // アドレス
  const [addressValue, setAddressValue] = useState("");
  // ユーザー一覧
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // コントラクトとの通信用
  const contractAddress = "0xC838ACc05a7Bc08054995b4e51DD92481cf86550"
  // ABIの参照
  const ContractABI = abi.abi;

  const createNFT = async (a, b, c, d) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const createContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );

        // トランザクションへの書き込み
        const createTxn = await createContract.writeNFT(
          a,
          b,
          "0x3a0bE810754f7f7D04fCA10E2C11E93ebb5BF19e"
        );
        await createTxn.wait();
        // 2回目
        const createTxn2 = await createContract.writeNFT(
          c,
          d,
          "0x3a0bE810754f7f7D04fCA10E2C11E93ebb5BF19e"
        );
        await createTxn2.wait();

        console.log("Mined -- ", createTxn2.hash);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      if (error.toString().match(/string/)) {
        alert("エラーです🥺フォームが空欄の可能性があります。ご確認ください🙇‍♂️");
      } else {
        if (error.toString().match(/decimal/)) {
          alert(
            "エラーです🥺「報酬」欄は数字になっていますか…？ご確認ください🙇‍♂️"
          );
        } else {
          if (error.toString().match(/object/)) {
            console.log(error);
          } else {
            alert(
              `エラーです🥺記入内容を確認してみてください。例：「報酬」欄は数字になっていますか…？
              ▼今回のエラーメッセージ
            ${error}`
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    const getBranches = async () => {
      const branchesData = await fetchBranches();
      const relatedCommitsData = await Promise.all(
        branchesData.data.map(async (item, index) => {
          const tmpSpeCommi = await fetchSpecificCommits(item?.name);
          if (item.name === "main" || item.name === "master") {
            console.log(item)
            totalYTCommitsArr = tmpSpeCommi.data[index].filter(
              (relatedCommitsItem) => relatedCommitsItem?.author?.login === "ystgs"
            );
            totalYUCommitsArr = tmpSpeCommi.data[index].filter(
              (relatedCommitsItem) => relatedCommitsItem?.author?.login === "gtyuki83"
            );
          }
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
    let newRelatedCommitsArr = relatedCommits[index].filter(
      (relatedCommitsItem) =>
        relatedCommitsItem?.commit?.committer?.name !== "GitHub"
      // &&
      // relatedCommitsItem?.sha === item?.commit?.sha
    );
    // let totalYTCommitsArr = [];
    // let totalYUCommitsArr = [];
    // if (item.name === "main" || item.name === "master") {
    //   totalYTCommitsArr = newRelatedCommitsArr.filter(
    //     (relatedCommitsItem) => relatedCommitsItem?.author?.login === "ystgs"
    //   );
    //   totalYUCommitsArr = newRelatedCommitsArr.filter(
    //     (relatedCommitsItem) => relatedCommitsItem?.author?.login === "gtyuki83"
    //   );
    // }
    // それぞれのcommitにおけるパーセンテージを算出
    // setYtCommits(Math.round(totalYTCommitsArr?.length / (totalYTCommitsArr?.length + totalYUCommitsArr?.length) * 100 * 10) / 10);
    // setYuCommits(Math.round(totalYUCommitsArr?.length / (totalYTCommitsArr?.length + totalYUCommitsArr?.length) * 100 * 10) / 10);

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
        <Button disableRipple variant="contained">
          {item?.name}
        </Button>

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
              ystgs: {totalYTCommitsArr?.length}({Math.round(totalYTCommitsArr?.length / (totalYTCommitsArr?.length + totalYUCommitsArr?.length) * 100 * 10) / 10}%)
            </Typography>
            <Typography variant="body2" color="text.primary">
              gtyuki83: {totalYUCommitsArr?.length}({Math.round(totalYUCommitsArr?.length / (totalYTCommitsArr?.length + totalYUCommitsArr?.length) * 100 * 10) / 10}%)
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
        {/* <textarea
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
        </button> */}

        <button
          className="submitButton"
          onClick={() => {
            createNFT(
              yuCommits,
              50,
              ytCommits,
              50,
            );
          }}
        >
          NFTを発行する
        </button>
        <br />
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
