import {DefaultAzureCredential} from '@azure/identity';
import {ComputeManagementClient} from '@azure/arm-compute';
import {MetricsQueryClient} from '@azure/monitor-query';
import {PluginParams} from '../../../types/interface';

let credential: DefaultAzureCredential | null = null;

const addMonths = (timestamp: Date, months: number) => {
  const date = new Date(timestamp.getTime());
  const d = date.getUTCDate();

  date.setUTCMonth(date.getUTCMonth() + +months);

  if (date.getUTCDate() !== d) {
    date.setUTCDate(0);
  }

  return date;
};

const addDays = (timestamp: Date, days: number) => {
  const date = new Date(timestamp.getTime() + days * 24 * 60 * 60 * 1000);

  return date;
};

const addHours = (timestamp: Date, hours: number) => {
  const date = new Date(timestamp.getTime() + hours * 60 * 60 * 1000);

  return date;
};

const addMinutes = (timestamp: Date, minutes: number) => {
  const date = new Date(timestamp.getTime() + minutes * 60 * 1000);

  return date;
};

const addSeconds = (timestamp: Date, seconds: number) => {
  const date = new Date(timestamp.getTime() + seconds * 1000);

  return date;
};

const convertInteger = (num: string | undefined) => (num ? parseInt(num) : 0);

const getDuration = (timestamp: Date, granularity: string): number => {
  const match =
    /P(?!$)((?<years>\d+)Y){0,1}((?<months>\d+)M){0,1}((?<days>\d+)D){0,1}(T((?<hours>\d+)H){0,1}((?<minutes>\d+)M){0,1}((?<seconds>\d+)S){0,1}){0,1}/gm.exec(
      granularity
    );
  const dateYears = addMonths(
    timestamp,
    12 * convertInteger(match?.groups?.years)
  );
  const dateMonths = addMonths(
    dateYears,
    convertInteger(match?.groups?.months)
  );
  const dateDays = addDays(dateMonths, convertInteger(match?.groups?.days));
  const dateHours = addHours(dateDays, convertInteger(match?.groups?.hours));
  const dateMinutes = addMinutes(
    dateHours,
    convertInteger(match?.groups?.minutes)
  );
  const dateSeconds = addSeconds(
    dateMinutes,
    convertInteger(match?.groups?.seconds)
  );

  return (dateSeconds.getTime() - timestamp.getTime()) / 3600000;
};

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
  startTime: Date,
  endTime: Date,
  granularity: string
): Promise<PluginParams[]> => {
  if (!credential) {
    credential = new DefaultAzureCredential();
  }

  const metricsClient = new MetricsQueryClient(credential);

  const response = await metricsClient.queryResource(
    resourceId,
    ['Percentage CPU'],
    {
      granularity,
      timespan: {
        startTime: startTime,
        endTime: endTime,
      },
    }
  );

  const data = response.metrics[0].timeseries[0].data?.map(d => {
    return {
      timestamp: d.timeStamp,
      duration: getDuration(d.timeStamp, granularity),
      'cpu/utilization': d.average || 0,
    };
  });

  return data || [];
};

export default {getVirtualMachineList, getVirtualMachineUsage};
