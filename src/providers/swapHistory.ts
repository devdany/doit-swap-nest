import { Connection } from 'typeorm';
import { SwapHistoryEntity } from '../entities/swapHistory';
import {
  Repository,
  Connection as ConnectionKeyStore,
} from '../injectKeyStore';

export const swapHistoryProviders = [
  {
    provide: Repository.SWAP_HISTORY_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(SwapHistoryEntity),
    inject: [ConnectionKeyStore.DATABASE_CONNECTION],
  },
];
