import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserWalletModule } from './modules/userWallet';
import { ContractModule } from './modules/contract'
import { TokenModule } from './modules/token'
import { SwapHistoryModule } from './modules/swapHistory'
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionModule } from './modules/transaction'

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gpl',
      subscriptions: {
        path: '/subscriptions'
      }
    }),
    UserWalletModule,
    ContractModule,
    TokenModule,
    SwapHistoryModule,
    TransactionModule,
    ConfigModule.forRoot({}),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
