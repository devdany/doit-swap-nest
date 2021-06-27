import { Resolver, Query } from '@nestjs/graphql';
import { TokenService } from '../services/token';
import { TokenEntity } from '../entities/token';
import { IsNull, Not } from "typeorm";

@Resolver()
export class TokenResolver {
  constructor(private tokenService: TokenService) {}

  @Query(() => [TokenEntity])
  async swapableTokens() {
    const tokens = await this.tokenService.findAll(['swapables'], { isAbleToBeSwapped: null });
    return tokens
  }

  @Query(() => [TokenEntity])
  async isAbleToBeSwapedTokens() {
    const tokens = await this.tokenService.findAll(['isAbleToBeSwapped'], { isAbleToBeSwapped: Not(IsNull()) });
    return tokens
  }
}
