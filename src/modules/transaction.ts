import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { transactionProviders } from '../providers/transaction';
import { TransactionService } from '../services/transactionService';


@Module({
  imports: [DatabaseModule],
  providers: [TransactionService, ...transactionProviders],
})
export class TransactionModule {}
