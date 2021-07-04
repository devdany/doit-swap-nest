import { Injectable, Inject } from '@nestjs/common';
import Web3 from 'web3'
import { TokenEntity } from '../entities/token';
import { Connection, Repository as RepositoryStore } from '../injectKeyStore';
import { Network } from '../entities/token'
import { Transaction } from './etherscan'
import { Repository } from 'typeorm';
import { Transaction as TransactionEntity, Type } from '../entities/transaction';
import { SwapHistoryEntity, SwapResult } from '../entities/swapHistory';


const Tx = require("ethereumjs-tx").Transaction
const Common = require('ethereumjs-common').default;

const bigint = require('big-integer');

@Injectable()
export class ContractService {
  constructor(
    @Inject(Connection.ETHEREUM_CONNECTION)
    private ethereumClient: Web3,

    @Inject(Connection.BSC_CONNECTION)
    private bscClient: Web3,

    @Inject(RepositoryStore.TRANSACTION_REPOSITORY)
    private transactionRepository: Repository<TransactionEntity>,

    @Inject(RepositoryStore.SWAP_HISTORY_REPOSITORY)
    private swapHistoryRepository: Repository<SwapHistoryEntity>,
  ) {}

  private getBlockchainNetwork(network: Network){
    if (network === Network.ETHEREUM) {
      return this.ethereumClient
    } else if (network === Network.BSC) {
      return this.bscClient
    }
  }

  async getTokenBalance(token: TokenEntity, accountAddress: string): Promise<number> {
    const tokenAbi = token.abi as any
    const blockchainClient = this.getBlockchainNetwork(token.network)
    const tokenInstance = new blockchainClient.eth.Contract(JSON.parse(tokenAbi), token.address);
    const result = await tokenInstance.methods.balanceOf(accountAddress).call()
    const bigBalance = bigint(result)
    const decimal = bigint(10).pow(token.decimal)
    const balance = Number(bigBalance.divide(decimal));
    return balance;
  }

  async mint(token: TokenEntity, accountAddress: string, bigAmount: string, historyId: number): Promise<boolean> {
    const tokenAbi = JSON.parse(token.abi) as any
    const blockchainClient = this.getBlockchainNetwork(token.network)
    const hexPrivateKey = Buffer.from(process.env.BDOI_HOLDER_PRIVATE_KEY, 'hex')
    const tokenInstance = new blockchainClient.eth.Contract(tokenAbi, token.address);
    const data = tokenInstance.methods.mintToken(accountAddress, bigAmount).encodeABI();
    
    const gasPrice = await blockchainClient.eth.getGasPrice();
    const gasPriceHex = blockchainClient.utils.toHex(gasPrice);
    const gasLimitHex = blockchainClient.utils.toHex(3000000);
    
    const count = await blockchainClient.eth.getTransactionCount(process.env.BDOI_HOLDER_ADDRESS);
    const chainId = await blockchainClient.eth.getChainId()

    const rawTransaction = {
      from: process.env.BDOI_HOLDER_ADDRESS,
      nonce: blockchainClient.utils.toHex(count),
      gasPrice: gasPriceHex,
      gasLimit: gasLimitHex,
      to: token.address,
      value: '0x0',
      data: data,
      chainId: chainId
    };

    const chain = Common.forCustomChain(
      'mainnet',{
        name: 'bnb',
        networkId: chainId,
        chainId: chainId
      },
      'petersburg'
    )
  

    const tx = new Tx(rawTransaction, { common: chain });

    tx.sign(hexPrivateKey);
    const serializedTx = tx.serialize();
    blockchainClient.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', (hash) => {
        this.swapHistoryRepository.update(historyId, {
          result: SwapResult.MINTTING
        })
      })
      .on('receipt', (receipt) => {
        this.transactionRepository.create({
          transactionId: receipt.transactionHash,
          from: receipt.from,
          tokenAddress: receipt.to,
          isError: receipt.status ? '0' : '1',
          type: Type.MINT
        }).save()

        this.swapHistoryRepository.update(historyId, {
          result: receipt.status ? SwapResult.SUCCESS : SwapResult.FAIL
       })
      })

    return true;
    
  }

  async decodeParameter(transactionData: Transaction, abi: any, token: TokenEntity, funcSimpleAbi: string): Promise<any> {
    const input = transactionData.input;
    const types = abi.inputs.map(x=>x.internalType);
    const names = abi.inputs.map(x=>x.name);

    const blockchainClient = this.getBlockchainNetwork(token.network) 

    const signature = blockchainClient.eth.abi.encodeFunctionSignature(funcSimpleAbi)
    const signedData = "0x"+input.replace(signature,"");

    const r = blockchainClient.eth.abi.decodeParameters(types, signedData);
    const dic = {}
    for(let i = 0; i < names.length; i++){
        dic[names[i]] = r[i];
    }
    return dic
  }
}