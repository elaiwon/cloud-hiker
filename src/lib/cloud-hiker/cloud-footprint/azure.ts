import {
  AZURE_CCF_SERVICE_TYPE,
  AZURE_CLOUD_SERVICES,
  PluginParams,
} from '../../types/interface';
import {CloudFootprintGlobalConfig} from './types';
import {AZURE_SERVICE_SCHEMA, AZURE_SERVICE_SCHEMA_TYPE} from '../core/schema';
import {AZURE_VM} from '../core/azure/virtual-machines';
import {AZURE_EMISSIONS, AZURE_PUE} from '../core/azure/ccf-constants';

const defaultConfig = {
  'azure/pue': AZURE_PUE,
  'cpu/expected-lifespan': 4 * 24 * 365,
};

const inferInstanceType = (input: AZURE_SERVICE_SCHEMA_TYPE): string => {
  switch (input['azure/service']) {
    case AZURE_CLOUD_SERVICES.VIRTUAL_MACHINE:
      return input['azure/instance-type'];
  }
};

/**
 * Computes the processor energy consumption for a single input
 * (power * duration * PUE) / (seconds in an hour) / 1000 [kWh]
 */
const computeProcessorEnergy = (input: PluginParams): number => {
  const vmList: {[k: string]: any} = Object.values(AZURE_VM).reduce(
    (acc, item) => Object.assign(acc, item),
    {}
  );
  const vm = vmList[input.instanceType];

  if (!vm) return 0;

  const power = vm.minWatts + (input.cpu / 100) * (vm.maxWatts - vm.minWatts);

  // As more services are added, look into CCF implementation
  const replicationFactor = 1;

  return (power * input.duration * input.pue * replicationFactor) / 3600 / 1000;
};

/**
 * Computes the carbon emission for a single input
 * (energy * emission_factor) [gCO2e]
 */
const computeEmission = (input: PluginParams): number => {
  const emissionFactor =
    AZURE_EMISSIONS[input.region] || AZURE_EMISSIONS.Unknown;

  return input.energy * emissionFactor;
};

/**
 * Calculates the embodied emissions for a given input.
 * M = TE * (TR/EL) * (RR/TR) [gCO2e]
 * Where:
 * TE = Total Embodied Emissions, the sum of Life Cycle Assessment(LCA) emissions for all hardware components
 * TR = Time Reserved, the length of time the hardware is reserved for use by the software
 * EL = Expected Lifespan, the anticipated time that the equipment will be installed
 * RR = Resources Reserved, the number of resources reserved for use by the software.
 * TR = Total Resources, the total number of resources available.
 */
const computeEmbodiedEmission = (input: PluginParams): number => {
  const vmList: {[k: string]: any} = Object.values(AZURE_VM).reduce(
    (acc, item) => Object.assign(acc, item),
    {}
  );
  const vm = vmList[input.instanceType];

  if (!vm) return 0;

  const scopeThreeEmissions = vm['embodied-co2e'];

  return (scopeThreeEmissions * input.duration) / input.expectedLifespan / 8760;
};

/**
 * List Azure Services.
 */
export const azureExecute = async (
  input: CloudFootprintGlobalConfig & PluginParams
): Promise<PluginParams> => {
  const globalInput = Object.assign({}, defaultConfig, input);
  const params = AZURE_SERVICE_SCHEMA.parse(globalInput);

  const serviceName = params['azure/service'];

  const output = {
    ...input,
  };

  if (AZURE_CCF_SERVICE_TYPE[serviceName]?.includes('compute')) {
    const instanceType = inferInstanceType(params);

    output['cpu/energy'] = computeProcessorEnergy({
      duration: params.duration,
      cpu: params['cpu/utilization'],
      instanceType,
      pue: params['azure/pue'],
    });

    output['cpu/energy/co2e'] = computeEmission({
      energy: output['cpu/energy'],
      region: params['azure/region'],
    });

    output['cpu/embodied/co2e'] = computeEmbodiedEmission({
      instanceType: params['azure/instance-type'],
      duration: params['duration'],
      expectedLifespan: params['cpu/expected-lifespan'],
    });
  }

  return output;
};
