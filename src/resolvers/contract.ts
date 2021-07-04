import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserWalletService } from '../services/userWallet';
import { TokenService } from '../services/token';
import { ContractService } from '../services/contract'
import { UserToken } from '../schemas/outputs/userToken'
import { SwapHistoryEntity, SwapResult } from '../entities/swapHistory'
import { SwapHistoryService } from '../services/swapHistory'
import { SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { EtherscanService } from '../services/etherscan'
import { CronJob } from 'cron';
import { TransactionService } from '../services/transactionService';
import { Type } from '../entities/transaction'
const bigint = require('big-integer');

@Resolver()
export class ContractResolver {
  constructor(
    private userWalletService: UserWalletService,
    private tokenService: TokenService,
    private contractService: ContractService,
    private swapHistoryService: SwapHistoryService,
    private schedulerRegistry: SchedulerRegistry,
    private etherscanService: EtherscanService,
    private transactionService: TransactionService
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

  @Mutation(() => Boolean)
  async registerBrunTransactionChecker(
    @Args('userWalletAddress') userWalletAddress: string,
    @Args('tokenAddress') tokenAddress: string,
    @Args('mintTokenAddress') mintTokenAddress: string,
    @Args('transactionId') transactionId: string
  ) {
    const jobId = transactionId
    // 같은 트랜잭션을 서치중인 다른 스케줄러가 있다? 이건 뭔가 문제가 있는것.
    const isSameSwap = this.schedulerRegistry.doesExists('cron', jobId)
    if (isSameSwap) {
      return false
    }

    let cnt = 0;
    this.schedulerRegistry.addCronJob(jobId, new CronJob(CronExpression.EVERY_MINUTE, async () => {
      // 해당 트랜잭션이 처리되었는지 스케줄링 시작!
      cnt += 1;
      // 10분이상 처리가 안되면 그냥 날림
      if (cnt > 10) {
        // job 종료
        const job = this.schedulerRegistry.getCronJob(jobId)
        job.stop();
        this.schedulerRegistry.deleteCronJob(jobId)
      }

      const burnTransaction = await this.etherscanService.getTransaction(transactionId, tokenAddress)

      if (!burnTransaction) {
        return
      }

      const transactionOnDatabase = await this.transactionService.findTransaction(userWalletAddress, burnTransaction.hash)

      if (transactionOnDatabase) {
        return
      }

      if (burnTransaction.isError === '0') {
        // 정상처리 된 경우
        await this.transactionService.createTransaction({
          from: userWalletAddress,
          tokenAddress,
          isError: '0',
          transactionId: burnTransaction.hash,
          type: Type.BURN
        })

        const token = await this.tokenService.findByAddress(tokenAddress)
        const abi = JSON.parse(token.abi) as any[]
        const burnAbi = abi.find((attr) => attr.name === 'burn')
        const decodedParameter = await this.contractService.decodeParameter(burnTransaction, burnAbi, token, 'burn(uint256)')
        const mintToken = await this.tokenService.findByAddress(mintTokenAddress);
        const userWallet = await this.userWalletService.findWallet(userWalletAddress)

        const bigAmount = bigint(decodedParameter.amount)
        const decimal = bigint(10).pow(token.decimal)

        const amount = Number(bigAmount.divide(decimal));
        const estimatedFee = amount * (10 / 100)

        const applyEstimatedFee = amount - estimatedFee;
        const bitApplyEstimatedFee = bigint(applyEstimatedFee)
        const mintAmount = decimal.multiply(bitApplyEstimatedFee).toString()

        const createdHistory = await this.swapHistoryService.createHistory(transactionId, userWallet, applyEstimatedFee, token, mintToken, SwapResult.BURNNING)
        this.contractService.mint(mintToken, userWalletAddress, mintAmount, createdHistory.id);
        
      } else {
        // 실패처리
        await this.transactionService.createTransaction({
          from: userWalletAddress,
          tokenAddress,
          isError: '1',
          transactionId: burnTransaction.hash,
          type: Type.BURN
        })
      }

      // job 종료
      const job = this.schedulerRegistry.getCronJob(jobId)
      job.stop();
      this.schedulerRegistry.deleteCronJob(jobId)
    }));
    this.schedulerRegistry.getCronJob(jobId).start();
    return true;
  }

  @Mutation(() => SwapHistoryEntity)
  async swapToken(
    @Args('fromTokenId') fromTokenId: number,
    @Args('toTokenId') toTokenId: number,
    @Args('amount') amount: number,
    @Args('address') address: string,
    @Args('transactionId') transactionId: string
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

    const createdSwapHistory = await this.swapHistoryService.createHistory(transactionId, userWallet, amount, from, to, SwapResult.BURNNING)
    const handledSwapHistory = {
      ...createdSwapHistory,
      from: from,
      to: to,
      user: userWallet
    }
    return handledSwapHistory
  }
}
