import {
  PluginInterface,
  PluginParams,
  CLOUD_VENDORS,
} from '../../types/interface';
import {CloudListGlobalConfig} from './types';
import {CLOUD_SCHEMA} from '../core/schema';
import {azureExecute} from './azure';

export const CloudList = (
  globalConfig: CloudListGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * List Cloud services.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return await Promise.all(
      inputs.map(async input => {
        const globalInput = Object.assign({}, globalConfig || {}, input);
        const params = CLOUD_SCHEMA.parse(globalInput);

        if (params['cloud/vendor'] === CLOUD_VENDORS.AZURE) {
          return await azureExecute(globalInput);
        }

        return input;
      })
    );
  };

  return {
    metadata,
    execute,
  };
};
