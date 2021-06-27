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

@Module({
  imports: [DatabaseModule, EthereumModule, BscModule],
  providers: [
    TokenService,
    UserWalletService,
    ContractService,
    ContractResolver,
    SwapHistoryService,
    ...tokenProviders,
    ...userWalletProviders,
    ...ethereumProviders,
    ...bscProviders,
    ...swapHistoryProviders
  ],
})
export class ContractModule {}
