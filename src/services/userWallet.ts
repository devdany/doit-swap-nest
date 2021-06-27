import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserWalletEntity } from '../entities/userWallet';
import { CreateUserInput } from '../schemas/inputs/createUserInput';
import { Repository as RepositoryKeyStore } from '../injectKeyStore';

@Injectable()
export class UserWalletService {
  constructor(
    @Inject(RepositoryKeyStore.USER_REPOSITORY)
    private userWalletRepository: Repository<UserWalletEntity>,
  ) {}

  async findWallet(address: string, relations?: string[]): Promise<UserWalletEntity> {
    return this.userWalletRepository.findOne({
      where: {
        address
      },
      relations,
    });
  }

  async createOneUserWallet(address: string): Promise<UserWalletEntity> {
    return this.userWalletRepository.create({
      address
    }).save()
  }
}
