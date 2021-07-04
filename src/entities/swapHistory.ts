import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { TokenEntity } from './token'
import { UserWalletEntity } from './userWallet'

export enum SwapResult {
  BURNNING='BURNNING',
  MINTTING='MINTTING',
  FAIL='FAIL',
  SUCCESS='SUCCESS',
}

registerEnumType(SwapResult, {
  name: 'SwapResult'
})


@ObjectType('SwapHistory')
@Entity({
  name: 'SwapHistory',
})
export class SwapHistoryEntity extends BaseEntity {
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
  @Column()
  transaction: string;

  @Field(() => UserWalletEntity)
  @JoinColumn()
  @ManyToOne(() => UserWalletEntity, (user) => user.swapHistories, {
    cascade: true,
  })
  user: UserWalletEntity

  @Field()
  @Column({
    type: 'float'
  })
  amount: number

  @Field(() => TokenEntity)
  @JoinColumn()
  @ManyToOne(() => TokenEntity, {
    cascade: true
  })
  from: TokenEntity

  @Field(() => TokenEntity)
  @JoinColumn()
  @ManyToOne(() => TokenEntity, {
    cascade: true
  })
  to: TokenEntity

  @Field(() => SwapResult)
  @Column({
    type: 'enum',
    enum: SwapResult
  })
  result: SwapResult
}
