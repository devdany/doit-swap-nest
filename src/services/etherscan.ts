import { Injectable } from '@nestjs/common';
import axios from 'axios'

export type Transaction = {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string 
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  isError: string
  txreceipt_status: string
  input: string
  contractAddress: string 
  cumulativeGasUsed: string
  gasUsed: string
  confirmations: string
}

const BURN_FUNC_ENCODED = '0x4296';

@Injectable()
export class EtherscanService {
  async getTransaction(transactionId: string, tokenAddress: string): Promise<Transaction | undefined> {
    const result = await axios.get(`${process.env.ETHERSCAN_API_URL}?module=account&action=txlist&address=${tokenAddress}&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`)
    let transactions = result?.data?.result as Transaction[]
    if (!transactions) {
      return
    }
    const targetTransaction = transactions.find((transaction) => {
      return transaction.hash === transactionId
    })
    return targetTransaction
  }
}