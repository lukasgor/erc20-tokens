import Web3 from 'web3';

const nodeUrl =
  'wss://speedy-nodes-nyc.moralis.io/cbe0af7fd302df1cd2a2544e/eth/ropsten/ws';

const provider = new Web3.providers.WebsocketProvider(nodeUrl);
const web3 = new Web3(provider);

export default web3;
