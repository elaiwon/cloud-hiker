import {AZURE_CLOUD_SERVICES, PluginParams} from '../../types/interface';
import {CloudUsageGlobalConfig} from './types';
import {AZURE_RESOURCE_SCHEMA} from '../core/schema';
import {getVirtualMachineUsage} from '../core/azure';

const defaultConfig = {
  'azure/granularity': 'PT1H',
};

/**
 * List Azure Services.
 */
export const azureExecute = async (
  input: CloudUsageGlobalConfig & PluginParams
): Promise<PluginParams[]> => {
  const config = Object.assign({}, defaultConfig, input);
  const params = AZURE_RESOURCE_SCHEMA.parse(config);

  if (params['azure/service'] === AZURE_CLOUD_SERVICES.VIRTUAL_MACHINE) {
    const resourceId = params['azure/resource-id'];
    const startTime = params['start-time'];
    const endTime = params['end-time'];
    const granularity = params['azure/granularity'];

    return await getVirtualMachineUsage(
      resourceId,
      startTime,
      endTime,
      granularity
    );
  }

  return [];
};
