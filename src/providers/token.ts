import { Connection } from 'typeorm';
import { TokenEntity } from '../entities/token';
import {
  Repository,
  Connection as ConnectionKeyStore,
} from '../injectKeyStore';

export const tokenProviders = [
  {
    provide: Repository.TOKEN_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(TokenEntity),
    inject: [ConnectionKeyStore.DATABASE_CONNECTION],
  },
];
