import { Connection } from 'typeorm';
import { Transaction } from '../entities/transaction';
import {
  Repository,
  Connection as ConnectionKeyStore,
} from '../injectKeyStore';

export const transactionProviders = [
  {
    provide: Repository.TRANSACTION_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(Transaction),
    inject: [ConnectionKeyStore.DATABASE_CONNECTION],
  },
];
