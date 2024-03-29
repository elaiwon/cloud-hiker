import {
  PluginInterface,
  PluginParams,
  CLOUD_VENDORS,
} from '../../types/interface';
import {CloudUsageGlobalConfig} from './types';
import {CLOUD_SCHEMA} from '../core/schema';
import {azureExecute} from './azure';

export const CloudUsage = (
  globalConfig: CloudUsageGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * List Cloud services.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    if (inputs.length === 0) return [];

    // Use only the first input
    const input = inputs[0];
    const globalInput = Object.assign({}, globalConfig || {}, input);
    const params = CLOUD_SCHEMA.parse(globalInput);

    if (params['cloud/vendor'] === CLOUD_VENDORS.AZURE) {
      const list = await azureExecute(globalInput);

      if (list.length > 0) {
        return list.map(item => {
          return {
            ...item,
            ...input,
          };
        });
      }
    }

    return inputs;
  };

  return {
    metadata,
    execute,
  };
};
