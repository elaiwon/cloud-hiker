import {z} from 'zod';

export const TREES_FLIGHTS_PHONES_SCHEMA = z.object({
  'trees-conversion': z.number().gt(0),
  'flights-conversion': z.number().gt(0),
  'phones-conversion': z.number().gt(0),
  co2e: z.number().gte(0),
});

export type TREES_FLIGHTS_PHONES_SCHEMA_TYPE = z.infer<
  typeof TREES_FLIGHTS_PHONES_SCHEMA
>;
