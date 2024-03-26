import {z} from 'zod';

import {
  CLOUD_VENDORS,
  AWS_CLOUD_SERVICES,
  AZURE_CLOUD_SERVICES,
  GCP_CLOUD_SERVICES,
} from '../../types/interface';

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
