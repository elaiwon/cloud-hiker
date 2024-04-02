import {PluginInterface, PluginParams} from '../../types/interface';
import {TREES_FLIGHTS_PHONES_SCHEMA} from './schema';
import {TreesGlobalConfig} from './types';

const defaultConfig = {
  'trees-conversion': 16.5337915448 / 1000,
  'flights-conversion': 1.2345679 / 1000,
  'phones-conversion': 121643 / 1000,
};

export const TreesFlightsPhones = (
  globalConfig: TreesGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Convert co2e to trees, flights, phones.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return await Promise.all(
      inputs.map(async input => {
        const globalInput = Object.assign(
          {},
          defaultConfig,
          globalConfig || {},
          input
        );
        const params = TREES_FLIGHTS_PHONES_SCHEMA.parse(globalInput);
        const co2e = params.co2e;
        const treesConversion = params['trees-conversion'];
        const flightsConversion = params['flights-conversion'];
        const phonesConversion = params['phones-conversion'];

        return {
          ...input,
          trees: co2e * treesConversion,
          flights: co2e * flightsConversion,
          phones: co2e * phonesConversion,
        };
      })
    );
  };

  return {
    metadata,
    execute,
  };
};
