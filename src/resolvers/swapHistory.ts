import { Resolver, Query, Args, Subscription, Mutation } from '@nestjs/graphql';
import { SwapHistoryService } from '../services/swapHistory';
import { SwapHistoryEntity } from '../entities/swapHistory';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class SwapHistoryResolver {
  constructor(
    private swapHistoryService: SwapHistoryService,
  ) {}

  @Query(() => [SwapHistoryEntity])
  async swapHistories(@Args('userWalletId') userWalletId: number) {
    const swapHistories = await this.swapHistoryService.findHistoriesOfUserWallet(userWalletId, ['from', 'to', 'user']);
    return swapHistories
  }

  @Subscription(() => SwapHistoryEntity, {
    filter: (payload, variables) =>
      payload.swapHistoryList.user.id === variables.userWalletId,
  })
  async swapHistoryList(@Args('userWalletId') userWalletId: number) {
    return pubSub.asyncIterator('swapHistoryList');
  } 
}
