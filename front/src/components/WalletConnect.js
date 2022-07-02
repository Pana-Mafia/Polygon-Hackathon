import React, { useEffect, useState } from "react";
const connectWallet = async () => {
    const { ethereum } = window;
    // setMineStatus("connecting");

    if (!ethereum) {
        alert(
            "Metamaskがインストールされていないようです🥺スマホでご利用の方は、Metamaskアプリ内ブラウザからご利用ください🙇‍♂️"
        );
    }

    try {
        const network = await ethereum.request({ method: "eth_chainId" });

        if (network.toString() === "0x4") {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Found an account! Address: ", accounts[0]);
            // setMetamaskError(null);
            // setCurrentAccount(accounts[0]);
            // setMineStatus("ok");
        } else {
            alert(
                "Rinkeby testnetとは異なるネットワークに接続されているようです🥺Rinkeby testnetに切り替えてリトライしてください🙇‍♂️"
            );
            // setMetamaskError(true);
            // setMineStatus("e");
        }
    } catch (err) {
        console.log(err);
        // setMineStatus("e");
    }
};

export default connectWallet;