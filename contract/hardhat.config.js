require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/9VRqHHhTAZ_Yw_GM-JpeVQrU_A5pkrvr",
      accounts: ["0cb8aa4ff203eee33fd894bbc29a7cdbe56f2fd77eae7352ef5dc0b85b71290a"],
    },
  },
};