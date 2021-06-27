import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserWalletService } from '../services/userWallet';
import { TokenService } from '../services/token';
import { ContractService } from '../services/contract'
import { UserToken } from '../schemas/outputs/userToken'
import { SwapHistoryEntity, SwapResult } from '../entities/swapHistory'
import { SwapHistoryService } from '../services/swapHistory'
import { PubSub } from 'graphql-subscriptions'
const pubSub = new PubSub();

@Resolver()
export class ContractResolver {
  constructor(
    private userWalletService: UserWalletService,
    private tokenService: TokenService,
    private contractService: ContractService,
    private swapHistoryService: SwapHistoryService
  ) {}

  @Query(() => UserToken)
  async tokenBalance(@Args('address') address: string, @Args('tokenId') tokenId: number): Promise<UserToken> {
    let wallet = await this.userWalletService.findWallet(address);
    if (!wallet) {
      wallet = await this.userWalletService.createOneUserWallet(address)
    }
    const token = await this.tokenService.findToken(tokenId);
    const banalce = await this.contractService.getTokenBalance(token, address)
    return {
      userWallet: wallet,
      token: token,
      balance: banalce,
    };
  }

  @Mutation(() => SwapHistoryEntity)
  async swapToken(
    @Args('fromTokenId') fromTokenId: number,
    @Args('toTokenId') toTokenId: number,
    @Args('amount') amount: number,
    @Args('address') address: string
  ) {
    const userWallet = await this.userWalletService.findWallet(address);
    if (!userWallet) {
      throw Error('Wallet address is wrong')
    }

    const from = await this.tokenService.findToken(fromTokenId)
    const to = await this.tokenService.findToken(toTokenId)

    if (!from || !to) {
      throw Error('Token information is wrong')
    }

    // swap function
    const burnResult = await this.contractService.burnBalance(from, address, amount)

    if (!burnResult) {
      throw Error('Token burn transaction is fail')
    }

    const mintResult = await this.contractService.mintBalance(to, address, amount)

    let swapResult: SwapResult
    if (!mintResult || !mintResult.result) {
      swapResult = SwapResult.FAIL
    } else {
      swapResult = SwapResult.PENDING
    }

    const createdSwapHistory = await this.swapHistoryService.createHistory(mintResult.transactionId, userWallet, amount, from, to, swapResult)
    const handledSwapHistory = {
      ...createdSwapHistory,
      from: from,
      to: to,
      user: userWallet
    }
    return handledSwapHistory
  }
}
