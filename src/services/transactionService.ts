import { Injectable, Inject } from '@nestjs/common';
import { TokenEntity } from '../entities/token';
import { UserWalletEntity } from '../entities/userWallet';
import { Repository } from 'typeorm';
import { Transaction, Type } from '../entities/transaction';
import { Repository as RepositoryKeyStore } from '../injectKeyStore';

type createTransactionInput = {
  transactionId: string
  from: string
  tokenAddress: string
  isError: string
  type: Type
}

@Injectable()
export class TransactionService {
  constructor(
    @Inject(RepositoryKeyStore.TRANSACTION_REPOSITORY)
    private transactionRespository: Repository<Transaction>,
  ) {}

  async findTransaction(userWalletAddress: string, transactionId: string): Promise<Transaction> {
    return this.transactionRespository.findOne({
      where: {
        from: userWalletAddress,
        transactionId
      }
    })
  }

  async createTransaction(input: createTransactionInput) {
    return this.transactionRespository.create({
      transactionId: input.transactionId,
      from: input.from,
      tokenAddress: input.tokenAddress,
      isError: input.isError,
      type: input.type
    }).save()
  }
}