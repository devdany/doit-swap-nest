import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { SwapHistoryEntity } from './swapHistory'

@ObjectType('UserWallet')
@Entity({
  name: 'UserWallet',
})
export class UserWalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt?: Date;

  @Field()
  @Column({
    type: 'datetime',
    nullable: true,
  })
  deletedAt?: Date;

  @Field()
  @Column({
    unique: true
  })
  address: string;

  @Field(() => [SwapHistoryEntity])
  @OneToMany(() => SwapHistoryEntity, (swapHistory) => swapHistory.user)
  swapHistories: SwapHistoryEntity[]
}
