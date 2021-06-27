import { Injectable, Inject } from '@nestjs/common';
import { TokenEntity } from '../entities/token';
import { UserWalletEntity } from '../entities/userWallet';
import { Repository } from 'typeorm';
import { SwapHistoryEntity, SwapResult } from '../entities/swapHistory';
import { Repository as RepositoryKeyStore } from '../injectKeyStore';

@Injectable()
export class SwapHistoryService {
  constructor(
    @Inject(RepositoryKeyStore.SWAP_HISTORY_REPOSITORY)
    private swapHistoryRepository: Repository<SwapHistoryEntity>,
  ) {}

  async findHistoriesOfUserWallet(userWalletId: number, relations?: string[]): Promise<SwapHistoryEntity[]> {
    return this.swapHistoryRepository.find({
      where: {
        user: {
          id: userWalletId
        }
      },
      order: {
        id: 'DESC',
      },
      relations,
    });
  }

  async createHistory(transaction: string, userWallet: UserWalletEntity, amount: number, from: TokenEntity, to: TokenEntity, result: SwapResult ): Promise<SwapHistoryEntity> {
    return this.swapHistoryRepository.create({
      transaction,
      user: userWallet,
      amount,
      from,
      to,
      result
    }).save()
  }
}