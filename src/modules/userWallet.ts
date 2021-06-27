import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userWalletProviders } from '../providers/userWallet';
import { UserWalletService } from '../services/userWallet';
import { UserWalletResolver } from '../resolvers/userWallet';

@Module({
  imports: [DatabaseModule],
  providers: [UserWalletService, UserWalletResolver, ...userWalletProviders],
})
export class UserWalletModule {}
