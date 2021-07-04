import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


export enum Type {
  BURN='BURN',
  MINT='MINT',
}

@Entity({
  name: 'Transaction',
})
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  deletedAt?: Date;

  @Column()
  transactionId: string;

  @Column()
  from: string;

  @Column()
  tokenAddress: string;
  
  @Column()
  isError: string;

  @Column()
  type: Type;
}
