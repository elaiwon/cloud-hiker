import * as fs from 'fs';

const AZURE_TO_CCF: {[k: string]: string} = {
  AustraliaCentral: 'AP_AUSTRALIA_CENTRAL',
  AustraliaCentral2: 'AP_AUSTRALIA_CENTRAL2',
  australiaeast: 'AP_AUSTRALIA_EAST',
  australiasoutheast: 'AP_AUSTRALIA_SOUTH_EAST',
  brazilsouth: 'BRAZIL_SOUTH',
  CanadaCentral: 'US_CANADA_CENTRAL',
  CanadaEast: 'US_CANADA_EAST',
  CentralIndia: 'IN_CENTRAL',
  centralus: 'US_NERC_REGIONS_EMISSIONS_FACTORS.MRO',
  CentralUSEUAP: 'US_NERC_REGIONS_EMISSIONS_FACTORS.MRO',
  eastasia: 'ASIA_EAST',
  eastus: 'US_NERC_REGIONS_EMISSIONS_FACTORS.SERC',
  eastus2: 'US_NERC_REGIONS_EMISSIONS_FACTORS.SERC',
  EastUS2EUAP: 'US_NERC_REGIONS_EMISSIONS_FACTORS.SERC',
  FranceCentral: 'EU_FRANCE_CENTRAL',
  FranceSouth: 'EU_FRANCE_SOUTH',
  japaneast: 'AP_JAPAN_EAST',
  japanwest: 'AP_JAPAN_WEST',
  KoreaCentral: 'AP_KOREA',
  KoreaSouth: 'AP_KOREA_SOUTH',
  northcentralus: 'US_NERC_REGIONS_EMISSIONS_FACTORS.RFC',
  northeurope: 'EU_NORTH',
  SouthAfricaNorth: 'AF_SOUTH_AFRICA_NORTH',
  southcentralus: 'US_NERC_REGIONS_EMISSIONS_FACTORS.TRE',
  southeastasia: 'ASIA_SOUTH_EAST',
  SouthIndia: 'IN_SOUTH',
  UAECentral: 'ME_UAE_CENTRAL',
  UAENorth: 'ME_UAE_NORTH',
  uksouth: 'UK_SOUTH',
  ukwest: 'UK_WEST',
  westcentralus: 'US_NERC_REGIONS_EMISSIONS_FACTORS.WECC',
  WestIndia: 'IN_WEST',
  westus: 'US_NERC_REGIONS_EMISSIONS_FACTORS.WECC',
  westus2: 'US_NERC_REGIONS_EMISSIONS_FACTORS.WECC',
  BrazilSoutheast: 'BRAZIL_SOUTH_EAST',
  EastUSSTG: 'US_NERC_REGIONS_EMISSIONS_FACTORS.SERC',
  GermanyNorth: 'EU_GERMANY_NORTH',
  GermanyWestCentral: 'EU_GERMANY_WESTCENTRAL',
  // Israel Central has no info on the CCF code
  //IsraelCentral: 'UNKNOWN',
  // Italy North has no info on the CCF code
  //ItalyNorth: 'UNKNOWN',
  JioIndiaCentral: 'IN_JIO_CENTRAL',
  JioIndiaWest: 'IN_JIO_WEST',
  // Malaysia South has no info on the CCF code
  //MalaysiaSouth: 'UNKNOWN',
  // Mexico Central has no info on the CCF code
  //MexicoCentral: 'UNKNOWN',
  NorwayEast: 'EU_NORWAY_EAST',
  NorwayWest: 'EU_NORWAY_WEST',
  // Poland Central has no info on the CCF code
  //PolandCentral: 'UNKNOWN',
  QatarCentral: 'ME_UAE_CENTRAL',
  SouthAfricaWest: 'AF_SOUTH_AFRICA_WEST',
  SouthCentralUSSTG: 'US_NERC_REGIONS_EMISSIONS_FACTORS.TRE',
  // Spain Central has no info on the CCF code
  //SpainCentral: 'UNKNOWN',
  SwedenCentral: 'EU_SWEDEN_CENTRAL',
  SwedenSouth: 'EU_SWEDEN_CENTRAL',
  SwitzerlandNorth: 'EU_SWITZERLAND_NORTH',
  SwitzerlandWest: 'EU_SWITZERLAND_WEST',
  // Taiwan North and North West have no info on the CCF code
  //TaiwanNorth: 'UNKNOWN',
  //TaiwanNorthwest: 'UNKNOWN',
  WestUS3: 'US_NERC_REGIONS_EMISSIONS_FACTORS.WECC',
  Unknown: 'UNKNOWN',
};

const getPUE = () => {
  const path = `${__dirname}/../../../../../node_modules/@cloud-carbon-footprint/azure/src/domain/AzureFootprintEstimationConstants.ts`;

  const file = fs.readFileSync(path, 'ascii');

  const match = file.match(/PUE_AVG: (.*),/);

  if (!match) throw new Error('Error on getPUE');

  return match[1];
};

export const getNercRegions = () => {
  const path = `${__dirname}/../../../../../node_modules/@cloud-carbon-footprint/core/src/FootprintEstimationConstants.ts`;

  const file = fs.readFileSync(path, 'ascii');

  const re = /(const US_NERC_REGIONS_EMISSIONS_FACTORS[^}]*} = {[^}]*})/m;

  const match = file.match(re);

  if (!match) throw new Error('Error on getNercRegions');

  return match[1];
};

const getEmissions = () => {
  const path = `${__dirname}/../../../../../node_modules/@cloud-carbon-footprint/azure/src/domain/AzureFootprintEstimationConstants.ts`;

  const file = fs.readFileSync(path, 'ascii');

  const re =
    /export const AZURE_EMISSIONS_FACTORS_METRIC_TON_PER_KWH: CloudConstantsEmissionsFactors =\s+({[^}]*})/m;

  const match = file.match(re);

  if (!match) throw new Error('Error on getEmissions');

  const match2 = match[1].match(/\[AZURE_REGIONS\..*\.name\]: .*,/g)?.map(l => {
    const m = /(\[AZURE_REGIONS\.(.*)\.name\]: (.*),)*/.exec(l);
    if (!m) return null;

    return [m[2], m[3]];
  });

  return Object.keys(AZURE_TO_CCF)
    .map(r => {
      const v = AZURE_TO_CCF[r];
      const name = r.toLowerCase();

      if (v.includes('US_NERC_REGIONS_EMISSIONS_FACTORS')) {
        return `  ${name}: ${v},`;
      }

      const mapped = match2?.find(l => l?.[0] === v);

      return `  ${name}: ${mapped?.[1]},`;
    })
    .join('\n');
};

const pue = getPUE();
const nercRegions = getNercRegions();
const emissions = getEmissions();

const output = `export const AZURE_PUE = ${pue};

${nercRegions};

export const AZURE_EMISSIONS: {[k: string]: number} = {
${emissions}
};
`;

fs.writeFileSync(
  `${__dirname}/../../../../../src/lib/cloud-hiker/core/azure/ccf-constants.ts`,
  output
);
