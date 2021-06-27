import { createConnection } from 'typeorm';
import { Connection } from '../injectKeyStore';

export const databaseProviders = [
  {
    provide: Connection.DATABASE_CONNECTION,
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        entities: [__dirname + '/../entities/*{.ts,.js}'],
        synchronize: true,
      }),
  },
];
