import {ethers} from 'ethers';
import * as fs from 'fs/promises';

import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  uniqueRpcUrl: process.env['UNIQUE_RPC_URL'],
  walletPrivateKey: process.env['WALLET_PRIVATE_KEY'],
};
console.log('config', config);

const basePath = './files';

export async function deployContract() {
  const abiFilename = `${basePath}/abi.json`;
  const bytecodeFilename = `${basePath}/bytecode.txt`;

  const provider = ethers.getDefaultProvider(config.uniqueRpcUrl);
  const signer = new ethers.Wallet(config.walletPrivateKey, provider);

  const abi = JSON.parse((await fs.readFile(abiFilename)).toString());
  const bytecode = (await fs.readFile(bytecodeFilename)).toString();

  const MarketFactory = new ethers.ContractFactory(abi, bytecode, signer);

  const market = await MarketFactory.deploy(10, {
    gasLimit: 1000000,
  });

  const { target } = await market.deployed();

  return target;
}

deployContract();
