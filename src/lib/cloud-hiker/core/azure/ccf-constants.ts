export const AZURE_PUE = 1.185;

const US_NERC_REGIONS_EMISSIONS_FACTORS: {
  [nercRegion: string]: number;
} = {
  RFC: 0.000410608,
  SERC: 0.000379069,
  WECC: 0.000322167,
  MRO: 0.000426254,
  TRE: 0.000373231,
};

export const AZURE_EMISSIONS: {[k: string]: number} = {
  australiacentral: 0.00079,
  australiacentral2: 0.00079,
  australiaeast: 0.00079,
  australiasoutheast: 0.00096,
  brazilsouth: 0.0000617,
  canadacentral: 0.00012,
  canadaeast: 0.00012,
  centralindia: 0.0007082,
  centralus: US_NERC_REGIONS_EMISSIONS_FACTORS.MRO,
  centraluseuap: US_NERC_REGIONS_EMISSIONS_FACTORS.MRO,
  eastasia: 0.00071,
  eastus: US_NERC_REGIONS_EMISSIONS_FACTORS.SERC,
  eastus2: US_NERC_REGIONS_EMISSIONS_FACTORS.SERC,
  eastus2euap: US_NERC_REGIONS_EMISSIONS_FACTORS.SERC,
  francecentral: 0.00005128,
  francesouth: 0.00005128,
  japaneast: 0.0004658,
  japanwest: 0.0004658,
  koreacentral: 0.0004156,
  koreasouth: 0.0004156,
  northcentralus: US_NERC_REGIONS_EMISSIONS_FACTORS.RFC,
  northeurope: 0.0002786,
  southafricanorth: 0.0009006,
  southcentralus: US_NERC_REGIONS_EMISSIONS_FACTORS.TRE,
  southeastasia: 0.000408,
  southindia: 0.0007082,
  uaecentral: 0.0004041,
  uaenorth: 0.0004041,
  uksouth: 0.000225,
  ukwest: 0.000225,
  westcentralus: US_NERC_REGIONS_EMISSIONS_FACTORS.WECC,
  westindia: 0.0007082,
  westus: US_NERC_REGIONS_EMISSIONS_FACTORS.WECC,
  westus2: US_NERC_REGIONS_EMISSIONS_FACTORS.WECC,
  brazilsoutheast: 0.0000617,
  eastusstg: US_NERC_REGIONS_EMISSIONS_FACTORS.SERC,
  germanynorth: 0.00033866,
  germanywestcentral: 0.00033866,
  jioindiacentral: 0.0007082,
  jioindiawest: 0.0007082,
  norwayeast: 0.00000762,
  norwaywest: 0.00000762,
  qatarcentral: 0.0004041,
  southafricawest: 0.0009006,
  southcentralusstg: US_NERC_REGIONS_EMISSIONS_FACTORS.TRE,
  swedencentral: 0.00000567,
  swedensouth: 0.00000567,
  switzerlandnorth: 0.00001152,
  switzerlandwest: 0.00001152,
  westus3: US_NERC_REGIONS_EMISSIONS_FACTORS.WECC,
  unknown: 0.0003512799615,
};
