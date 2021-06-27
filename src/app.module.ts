import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserWalletModule } from './modules/userWallet';
import { ContractModule } from './modules/contract'
import { TokenModule } from './modules/token'
import { SwapHistoryModule } from './modules/swapHistory'

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
    ConfigModule.forRoot({})
  ],
})
export class AppModule {}
