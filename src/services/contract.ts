import { Injectable, Inject } from '@nestjs/common';
import Web3 from 'web3'
import { TokenEntity } from '../entities/token';
import { Connection } from '../injectKeyStore';
import { Network } from '../entities/token'

const bigint = require('big-integer');

type MintResult = {
  transactionId: string
  result: boolean
}

@Injectable()
export class ContractService {
  constructor(
    @Inject(Connection.ETHEREUM_CONNECTION)
    private ethereumClient: Web3,

    @Inject(Connection.BSC_CONNECTION)
    private bscClient: Web3
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

  async burnBalance(token: TokenEntity, accountAddress: string, amount: number): Promise<boolean> {
    try {
      return true
    } catch {
      return false
    }
  }

  async mintBalance(token: TokenEntity, accountAddress: string, amount: number): Promise<MintResult> {
    let transactionId = ''
    try {
      // swap action
      transactionId = 'abcdef'
      return {
        transactionId,
        result: true
      }
    } catch {
      return {
        transactionId,
        result: false,
      } 
    }
  }
}