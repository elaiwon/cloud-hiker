import {DefaultAzureCredential} from '@azure/identity';
import {AZURE_CLOUD_SERVICES, PluginParams} from '../../types/interface';
import {CloudListGlobalConfig} from './types';
import {AZURE_SCHEMA} from '../core/schema';
import {getVirtualMachineList} from '../core/azure';

let credential: DefaultAzureCredential | null = null;

/**
 * List Azure Services.
 */
export const azureExecute = async (
  input: CloudListGlobalConfig & PluginParams
): Promise<PluginParams> => {
  const params = AZURE_SCHEMA.parse(input);

  if (!credential) {
    credential = new DefaultAzureCredential();
  }

  if (params['azure/service'] === AZURE_CLOUD_SERVICES.VIRTUAL_MACHINE) {
    const listName = `azure/${AZURE_CLOUD_SERVICES.VIRTUAL_MACHINE}-list`;

    return await {
      ...input,
      [listName]: await getVirtualMachineList(input['azure/subscription-id']),
    };
  }

  return input;
};
