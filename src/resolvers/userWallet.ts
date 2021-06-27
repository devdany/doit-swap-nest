import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserWalletService } from '../services/userWallet';
import { UserWalletEntity } from '../entities/userWallet';

@Resolver()
export class UserWalletResolver {
  constructor(private userWalletService: UserWalletService) {}

  @Query(() => UserWalletEntity)
  async userWallet(@Args('address') address: string) {
    return await this.userWalletService.findWallet(address);
  }

  @Mutation(() => UserWalletEntity)
  async connectWallet(@Args('address') address: string) {
    const existWallet = await this.userWalletService.findWallet(address)
    if (existWallet) {
      return existWallet
    }

    const userWallet = await this.userWalletService.createOneUserWallet(address);
    return {
      ...userWallet,
    };
  }
}
