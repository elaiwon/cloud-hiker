import {z} from 'zod';
import {
  CLOUD_VENDORS,
  AWS_CLOUD_SERVICES,
  AZURE_CLOUD_SERVICES,
  GCP_CLOUD_SERVICES,
} from '../../types/interface';
import {AZURE_VM_ENUM} from '../core/azure/virtual-machines';
import {REGIONS} from './azure/regions';

export const CLOUD_SCHEMA = z.object({
  'cloud/vendor': z.nativeEnum(CLOUD_VENDORS),
});

export type CLOUD_SCHEMA_TYPE = z.infer<typeof CLOUD_SCHEMA>;

export const AWS_SCHEMA = z.object({
  'cloud/vendor': z.enum([CLOUD_VENDORS.AWS]),
  'aws/service': z.nativeEnum(AWS_CLOUD_SERVICES),
});

export type AWS_SCHEMA_TYPE = z.infer<typeof AWS_SCHEMA>;

export const AZURE_SCHEMA = z.object({
  'cloud/vendor': z.enum([CLOUD_VENDORS.AZURE]),
  'azure/service': z.nativeEnum(AZURE_CLOUD_SERVICES),
  'azure/subscription-id': z.string(),
});

export type AZURE_SCHEMA_TYPE = z.infer<typeof AZURE_SCHEMA>;

const AZURE_VIRTUAL_MACHINE_SCHEMA = z.object({
  'azure/service': z.enum([AZURE_CLOUD_SERVICES.VIRTUAL_MACHINE]),
  'cloud/vendor': z.enum([CLOUD_VENDORS.AZURE]),
  duration: z.number().gt(0),
  'azure/instance-type': z.nativeEnum(AZURE_VM_ENUM),
  'cpu/utilization': z.number().gte(0),
  'azure/pue': z.number().gte(1),
  'azure/region': z.nativeEnum(REGIONS),
  'cpu/expected-lifespan': z.number().gt(0),
});

export const AZURE_SERVICE_SCHEMA = z.discriminatedUnion('azure/service', [
  AZURE_VIRTUAL_MACHINE_SCHEMA,
]);

export type AZURE_SERVICE_SCHEMA_TYPE = z.infer<typeof AZURE_SERVICE_SCHEMA>;

export const AZURE_RESOURCE_SCHEMA = z.object({
  'cloud/vendor': z.enum([CLOUD_VENDORS.AZURE]),
  'azure/service': z.nativeEnum(AZURE_CLOUD_SERVICES),
  'azure/resource-id': z.string(),
  'azure/instance-type': z.string(),
  'azure/granularity': z.string(),
  'start-time': z.date(),
  'end-time': z.date(),
});

export type AZURE_RESOURCE_SCHEMA_TYPE = z.infer<typeof AZURE_RESOURCE_SCHEMA>;

export const GCP_SCHEMA = z.object({
  'cloud/vendor': z.enum([CLOUD_VENDORS.GCP]),
  'gcp/service': z.nativeEnum(GCP_CLOUD_SERVICES),
});

export type GCP_SCHEMA_TYPE = z.infer<typeof GCP_SCHEMA>;
