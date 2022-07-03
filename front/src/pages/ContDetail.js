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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  LinearProgress,
  TextField,
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
  fetchPanaMafiaRepos,
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
  const [ourRepos, setOurRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState("");
  const [totalYTCommitsArr, setTotalYTCommitsArr] = useState([]);
  const [totalYTCommitsRate, setTotalYTCommitsRate] = useState(null);
  const [totalYUCommitsArr, setTotalYUCommitsArr] = useState([]);
  const [totalYUCommitsRate, setTotalYuCommitsRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // アドレス
  const [addressValue, setAddressValue] = useState("");
  // ユーザー一覧
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  // コントラクトとの通信用
  const contractAddress = "0x9d2123928514566BD2e0cfa9C541e4ac20298dFe";
  // ABIの参照
  const ContractABI = abi.abi;
  // コメント登録時状態変数
  const [commentToValue, setCommentToValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [commentYTArr, setCommentYTArr] = useState([]);
  const [commentYTRate, setCommentYTRate] = useState(null);
  const [commentYUArr, setCommentYUArr] = useState([]);
  const [commentYURate, setCommentYURate] = useState(null);
  // コメント表示
  const [specialThxArr, setSpecialThxArr] = useState([]);

  useEffect(() => {
    const getBranches = async () => {
      setIsLoading(true);
      const accesstokenRef = await collection(firebaseFirestore, "accesstoken");
      var arr = [];
      getDocs(query(accesstokenRef)).then(async (snapshot) => {
        snapshot.forEach((doc) => {
          arr.push(doc.data());
        });
        const repos = await fetchPanaMafiaRepos(arr[0]?.token);
        const branchesData = await fetchBranches(arr[0]?.token);
        const relatedCommitsData = await Promise.all(
          branchesData.data.map(async (item, index) => {
            let tmpSpeCommi = await fetchSpecificCommits(
              arr[0]?.token,
              item?.name
            );
            if (item.name === "main" || item.name === "master") {
              const YTs = tmpSpeCommi.data.filter(
                (relatedCommitsItem) =>
                  relatedCommitsItem?.author?.login === "ystgs"
              );
              setTotalYTCommitsArr(YTs);
              const YUs = tmpSpeCommi.data.filter(
                (relatedCommitsItem) =>
                  relatedCommitsItem?.author?.login === "gtyuki83"
              );
              setTotalYUCommitsArr(YUs);
              setTotalYTCommitsRate(
                Math.round(
                  (YTs?.length / (YTs?.length + YUs?.length)) * 100 * 10
                ) / 10
              );
              setTotalYuCommitsRate(
                Math.round(
                  (YUs?.length / (YTs?.length + YUs?.length)) * 100 * 10
                ) / 10
              );
            }
            return tmpSpeCommi.data;
          })
        );
        setOurRepos(repos.data);
        setBranches(branchesData.data);
        setRelatedCommits(relatedCommitsData);
        setIsLoading(false);
        return null;
      });
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
    const viewComment = async () => {
      const usersCommentsRef = collection(firebaseFirestore, "comment");
      var arr = [];
      getDocs(query(usersCommentsRef)).then((snapshot) => {
        snapshot.forEach((doc) => {
          // コメントを文字列に保存
          arr.push(doc.data());
          // setSpecialThxArr(doc.data().comment);
        });
      });
      console.log(arr);
      const YTs = arr.filter((item) => item?.to === "ystgs");
      setCommentYTArr(YTs);
      const YUs = arr.filter((item) => item?.to === "gtyuki83");
      setCommentYUArr(YUs);
      setCommentYTRate(
        Math.round((YTs?.length / (YTs?.length + YUs?.length)) * 100 * 10) / 10
      );
      setCommentYURate(
        Math.round((YUs?.length / (YTs?.length + YUs?.length)) * 100 * 10) / 10
      );
      setSpecialThxArr(arr);
    };

    viewComment();
    const usersCollectionRef = collection(firebaseFirestore, "wallet");
    // リアタイ更新
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsub;
  }, []);

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
  const addComment = async (to, comment) => {
    try {
      if (comment != "" && to != "") {
        const commentsRef = collection(firebaseFirestore, "comment");
        const newDoc = doc(commentsRef).id;
        const documentRef = await setDoc(doc(commentsRef, newDoc), {
          to: to,
          comment: comment,
          id: newDoc,
        });
      } else {
        alert("アドレスが空です🥺");
      }
    } catch (error) {}
  };

  const branchesAndCommits = branches.map((item, index) => {
    let newRelatedCommitsArr = relatedCommits[index].filter(
      (relatedCommitsItem) =>
        relatedCommitsItem?.commit?.committer?.name !== "GitHub"
      // &&
      // relatedCommitsItem?.sha === item?.commit?.sha
    );

    const relatedCommitsArr = newRelatedCommitsArr.map(
      (relatedCommitsArrItem, index) => {
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

        <Chip sx={{ width: 150, mt: 3.5 }} label="link" color="primary" />
        <a href={item?.commit?.url} target="_blank">
          Full JSON
        </a>

        <Chip
          sx={{ width: 150, mt: 3.5 }}
          label="branch name"
          color="primary"
        />
        <p>{item?.name}</p>

        <Chip sx={{ width: 150, mt: 3.5 }} label="ID" color="primary" />
        <p>{item?.commit?.sha}</p>

        {item.name === "main" || item.name === "master" ? (
          <div>
            <Chip
              sx={{ width: 200, mt: 3.5 }}
              label="contributed commit number"
              color="primary"
            />
            <Typography variant="body2" color="text.primary">
              ystgs: {totalYTCommitsArr?.length} ({totalYTCommitsRate}%)
            </Typography>
            <Typography variant="body2" color="text.primary">
              gtyuki83: {totalYUCommitsArr?.length} ({totalYUCommitsRate}%)
            </Typography>
          </div>
        ) : null}

        <Chip
          sx={{ width: 150, mt: 3.5 }}
          label="included commits"
          color="primary"
        />
        {relatedCommitsArr}
      </Box>
    );
  });

  return (
    <div className="cont-detail-wrapper">
      {isLoading ? (
        <div
          className="row justifyCenter alignCenter"
          style={{ height: "100vh" }}
        >
          <Stack sx={{ width: "50%", color: "grey.500" }} spacing={4}>
            <LinearProgress color="primary" />
            <LinearProgress color="primary" />
            <LinearProgress color="primary" />
          </Stack>
        </div>
      ) : (
        <div>
          <Box className="row" sx={{ p: 2 }}>
            <button
              className="waveBtn"
              style={{ marginRight: 16 }}
              onClick={walletConnect}
            >
              Connect Wallet
            </button>
            <button
              className="submitButton"
              style={{ marginRight: 16 }}
              onClick={() => {
                createNFT(yuCommits, 50, ytCommits, 50);
              }}
            >
              Mint NFT
            </button>
            <FormControl sx={{}} size="small">
              <InputLabel id="demo-select-small">Repository</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={currentRepo}
                label="Repository"
                onChange={(val) => setCurrentRepo}
                style={{ width: 160 }}
              >
                <MenuItem value={10}>Ten</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div
            className="row"
            style={{
              overflowX: "scroll",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              className="column"
              sx={{
                mx: 2,
                p: 2,
                backgroundColor: "rgb(240,240,240)",
              }}
            >
              <Button
                style={{ width: "400px" }}
                disableRipple
                variant="contained"
              >
                Special thanks
              </Button>

              <FormControl
                sx={{ mt: 3.5, backgroundColor: "white" }}
                size="small"
              >
                <InputLabel id="select-to">To</InputLabel>
                <Select
                  labelId="select-to"
                  id="select-to-select"
                  value={commentToValue}
                  label="To"
                  onChange={(e) => setCommentToValue(e.target.value)}
                >
                  <MenuItem value={"ystgs"}>ystgs</MenuItem>
                  <MenuItem value={"gtyuki83"}>gtyuki83</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ mt: 0.5, backgroundColor: "white" }}
                id="outlined-basic"
                label="thanks comment"
                variant="outlined"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <Button
                sx={{ mt: 0.5 }}
                variant="outlined"
                onClick={() => {
                  specialThxArr.push({
                    to: commentToValue,
                    comment: commentValue,
                  });
                  addComment(commentToValue, commentValue);
                  setCommentToValue("");
                  setCommentValue("");
                }}
              >
                Send
              </Button>

              <Chip
                sx={{ width: 150, mt: 3.5 }}
                label="Contributors"
                color="primary"
              />
              <Typography variant="body2" color="text.primary">
                gtyuki83
              </Typography>
              <Typography variant="body2" color="text.primary">
                ystgs
              </Typography>

              <Chip
                sx={{ width: 150, mt: 3.5 }}
                label="summary"
                color="primary"
              />
              <Typography variant="body2" color="text.primary">
                to ystgs: {commentYTArr?.length} ({commentYTRate}%)
              </Typography>
              <Typography variant="body2" color="text.primary">
                to gtyuki83: {commentYUArr?.length} ({commentYURate}%)
              </Typography>

              <Chip sx={{ width: 150, mt: 3.5 }} label="list" color="primary" />
              {specialThxArr.map((item, index) => {
                return (
                  <Card key={index} sx={{ my: 1 }}>
                    <CardHeader
                      // avatar={
                      //   <Avatar sx={{}} alt="avatar" src={item?.avatar_url} />
                      // }
                      title={"To: " + item?.to}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.primary">
                        {item.comment}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
            {branchesAndCommits}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContDetail;
