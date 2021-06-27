import { ObjectType, Field } from '@nestjs/graphql';
import { UserWalletEntity } from '../../entities/userWallet'
import { TokenEntity } from '../../entities/token'

@ObjectType()
export class UserToken {
  @Field(() => UserWalletEntity)
  userWallet: UserWalletEntity;

  @Field(() => TokenEntity)
  token: TokenEntity;

  @Field()
  balance: number;
}
