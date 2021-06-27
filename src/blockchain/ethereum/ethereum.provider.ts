const Web3 = require('web3');
import { Connection } from '../../injectKeyStore';

export const ethereumProviders = [
  {
    provide: Connection.ETHEREUM_CONNECTION,
    useFactory: () => {
      const web3 = new Web3(new Web3.providers.HttpProvider(
        process.env.ETHEREUM_PROVIDER_URL
      ));
      return web3
    }      
  },
];
