import { Connection } from 'typeorm';
import { UserWalletEntity } from '../entities/userWallet';
import {
  Repository,
  Connection as ConnectionKeyStore,
} from '../injectKeyStore';

export const userWalletProviders = [
  {
    provide: Repository.USER_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(UserWalletEntity),
    inject: [ConnectionKeyStore.DATABASE_CONNECTION],
  },
];
