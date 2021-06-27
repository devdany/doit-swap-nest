const Web3 = require('web3');
import { Connection } from '../../injectKeyStore';

export const bscProviders = [
  {
    provide: Connection.BSC_CONNECTION,
    useFactory: () => {
      const web3 = new Web3(new Web3.providers.HttpProvider(
        process.env.BSC_PROVIDER_URL
      ));
      return web3
    }      
  },
];
