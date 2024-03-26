import {DefaultAzureCredential} from '@azure/identity';
import {ComputeManagementClient} from '@azure/arm-compute';
import {MetricsQueryClient} from '@azure/monitor-query';
import {PluginParams} from '../../../types/interface';

let credential: DefaultAzureCredential | null = null;

export const getVirtualMachineList = async (subscriptionId: string) => {
  if (!credential) {
    credential = new DefaultAzureCredential();
  }

  const computeClient = new ComputeManagementClient(credential, subscriptionId);
  const list = [];

  for await (const item of computeClient.virtualMachines.listAll()) {
    list.push({
      'azure/resource-id': item.id,
      name: item.name,
      'azure/instance-type': item.hardwareProfile?.vmSize,
    });
  }

  return list;
};

export const getVirtualMachineUsage = async (
  resourceId: string,
  startTime: string,
  endTime: string
): Promise<PluginParams[]> => {
  if (!credential) {
    credential = new DefaultAzureCredential();
  }

  const metricsClient = new MetricsQueryClient(credential);

  const response = await metricsClient.queryResource(
    resourceId,
    ['Percentage CPU'],
    {
      granularity: 'PT1H',
      timespan: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    }
  );

  const data = response.metrics[0].timeseries[0].data?.map(d => {
    return {
      timestamp: d.timeStamp,
      'cpu/utlization': d.average || 0,
    };
  });

  return data || [];
};

export default {getVirtualMachineList, getVirtualMachineUsage};
