import {ComputeManagementClient} from '@azure/arm-compute';
import {DefaultAzureCredential} from '@azure/identity';

let credential: DefaultAzureCredential | null = null;

export const getVirtualMachines = async (subscriptionId: string) => {
  if (!credential) {
    credential = new DefaultAzureCredential();
  }

  const computeClient = new ComputeManagementClient(credential, subscriptionId);
  const list = [];

  for await (const item of computeClient.virtualMachines.listAll()) {
    list.push({
      id: item.id,
      name: item.name,
      vmSize: item.hardwareProfile?.vmSize,
    });
  }

  return list;
};

export default {getVirtualMachines};
