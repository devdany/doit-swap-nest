import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { SwapHistoryEntity } from './swapHistory'


export enum Network {
  ETHEREUM='Ethereum',
  BSC='BSC',
}

registerEnumType(Network, {
  name: 'Network'
})


@ObjectType('Token')
@Entity({
  name: 'Token',
})
export class TokenEntity extends BaseEntity {
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
  name: string;

  @Field()
  @Column()
  address: string;

  @Field(() => Network)
  @Column({
    type: 'enum',
    enum: Network
  })
  network: Network;

  @Field()
  @Column({
    type: 'text'
  })
  abi: string;

  @Field()
  @Column()
  decimal: number;

  @Field(() => TokenEntity)
  @JoinColumn()
  @ManyToOne(() => TokenEntity, token => token.swapables, {
    cascade: true
  })
  isAbleToBeSwapped: TokenEntity

  @Field(() => [TokenEntity])
  @OneToMany(() => TokenEntity, token => token.isAbleToBeSwapped)
  swapables: TokenEntity[]

  @OneToMany(() => SwapHistoryEntity, (swapHistory) => swapHistory.from)
  burned: SwapHistoryEntity[]

  @OneToMany(() => SwapHistoryEntity, (swapHistory) => swapHistory.to)
  generated: SwapHistoryEntity[]
}
