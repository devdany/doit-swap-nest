import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EthereumModule } from '../blockchain/ethereum/ethereum.module'
import { ethereumProviders } from '../blockchain/ethereum/ethereum.provider'
import { bscProviders } from '../blockchain/bsc/bsc.provider'
import { BscModule } from '../blockchain/bsc/bsc.module'
import { tokenProviders } from '../providers/token';
import { TokenService } from '../services/token';
import { ContractService } from '../services/contract'
import { ContractResolver } from '../resolvers/contract';
import { userWalletProviders } from '../providers/userWallet';
import { UserWalletService } from '../services/userWallet';
import { SwapHistoryService } from '../services/swapHistory'
import { swapHistoryProviders } from '../providers/swapHistory'
import { SchedulerRegistry } from '@nestjs/schedule'
import { EtherscanService } from '../services/etherscan'
import { TransactionService } from '../services/transactionService'
import { transactionProviders } from '../providers/transaction'

@Module({
  imports: [DatabaseModule, EthereumModule, BscModule],
  providers: [
    TokenService,
    UserWalletService,
    ContractService,
    ContractResolver,
    SwapHistoryService,
    SchedulerRegistry,
    EtherscanService,
    TransactionService,
    ...tokenProviders,
    ...userWalletProviders,
    ...ethereumProviders,
    ...bscProviders,
    ...swapHistoryProviders,
    ...transactionProviders,
  ],
})
export class ContractModule {}
