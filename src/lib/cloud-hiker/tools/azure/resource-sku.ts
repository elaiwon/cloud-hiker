import {ComputeManagementClient} from '@azure/arm-compute';
import {DefaultAzureCredential} from '@azure/identity';
import * as fs from 'fs';

const subscriptionId = 'cd7cfbf1-34b5-4e8a-87cf-3499ca8366c7';

const client = new ComputeManagementClient(
  new DefaultAzureCredential(),
  subscriptionId
);

(async function () {
  const data: {[k: string]: {[k: string]: any}} = {};
  const vmList: string[] = [];

  const embodied = fs
    .readFileSync(
      `${__dirname}/../../../../../src/lib/cloud-hiker/tools/azure/coefficients-azure-embodied.csv`,
      'ascii'
    )
    .split('\n')
    .map(l => l.split(','));

  const use = fs
    .readFileSync(
      `${__dirname}/../../../../../src/lib/cloud-hiker/tools/azure/coefficients-azure-use.csv`,
      'ascii'
    )
    .split('\n')
    .map(l => l.split(','));

  const getWatts = (
    processors: string[],
    index: number
  ): [n: number, b: boolean] => {
    if (processors.includes('Unknown') || processors.length === 0) {
      const res = use
        .slice(1)
        .reduce(
          (acc, it) => acc + (it.length > 1 ? parseFloat(it[index]) : 0),
          0
        );

      return [res / (use.length - 2), true];
    }

    return [
      processors.reduce((acc, it) => {
        const p = use.find(f => f[1] === it);

        if (!p) return acc;

        return acc + parseFloat(p[index]);
      }, 0) / processors.length,
      false,
    ];
  };

  const regions: string[] = [];

  for await (const item of client.resourceSkus.list()) {
    item.locations?.forEach(l => {
      const name = l.toLowerCase();

      if (!regions.includes(name)) regions.push(name);
    });

    if (item.resourceType === 'virtualMachines') {
      const name: string = item.name as string;
      const family: string = item.family as string;

      if (vmList.indexOf(name) < 0) {
        vmList.push(name);

        if (!data[family]) data[family] = {};

        const ccfData = embodied.filter(
          e =>
            e[2] &&
            e[2].toLowerCase().replace(/ /g, '_') ===
              item.size?.toLocaleLowerCase()
        );

        const co2e = ccfData.length
          ? ccfData.reduce((a, b) => a + parseFloat(b[8]), 0) / ccfData.length
          : 0;
        const co2eEmpty = co2e ? false : true;

        const tier = item.tier || '';
        const size = item.size || '';
        const vCpusCapability = item.capabilities?.find(
          c => c.name === 'vCPUsAvailable'
        )?.value;
        const vCpus = vCpusCapability ? parseInt(vCpusCapability) : 0;
        const memoryCapability = item.capabilities?.find(
          c => c.name === 'MemoryGB'
        )?.value;
        const memory = memoryCapability ? parseInt(memoryCapability) : 0;
        const [minWatts, wattsAveraged] = getWatts(
          ccfData.map(d => d[3]),
          2
        );
        const [maxWatts] = getWatts(
          ccfData.map(d => d[3]),
          3
        );

        data[family][name] = {
          tier,
          size,
          vCpus,
          memory,
          'embodied-co2e': co2e,
          minWatts: minWatts * vCpus,
          maxWatts: maxWatts * vCpus,
          co2eEmpty,
          wattsAveraged,
        };
      }
    }
  }

  Object.keys(data).forEach(fName => {
    const maxVCpus = Object.keys(data[fName]).reduce((acc, item) => {
      const vCpus = data[fName][item].vCpus as number;

      return Math.max(acc, vCpus);
    }, 0);

    Object.keys(data[fName]).forEach(item => {
      data[fName][item]['embodied-co2e'] *= data[fName][item].vCpus / maxVCpus;
    });
  });

  const familyEnum = Object.keys(data)
    .map(l => {
      const name = l.toUpperCase().replace(/[ -]/g, '_');

      return `  ${name} = '${l}',`;
    })
    .join('\n');

  const vmEnum = vmList
    .map(item => {
      const name = item.toUpperCase().replace(/-/g, '_');

      return `  ${name} = '${item}',`;
    })
    .join('\n');

  const vm = Object.keys(data)
    .map(fam => {
      const famName = fam.toUpperCase().replace(/[ -]/g, '_');
      const famList = Object.keys(data[fam])
        .map(item => {
          const name = item.toUpperCase().replace(/-/g, '_');
          const size = data[fam][item].size;
          const vCpus = data[fam][item].vCpus;
          const memory = data[fam][item].memory;
          const co2e = data[fam][item]['embodied-co2e'];
          const minWatts = data[fam][item].minWatts;
          const maxWatts = data[fam][item].maxWatts;
          const co2eEmpty = data[fam][item].co2eEmpty;
          const wattsAveraged = data[fam][item].wattsAveraged;

          return `    [AZURE_VM_ENUM.${name}]: {
      size: '${size}',
      vCPU: ${vCpus},
      memory: ${memory},
      'embodied-co2e': ${co2e},
      minWatts: ${minWatts},
      maxWatts: ${maxWatts},
      co2eEmpty: ${co2eEmpty},
      wattsAveraged: ${wattsAveraged},
    },`;
        })
        .join('\n');

      return `  [AZURE_VM_FAMILY_ENUM.${famName}]: {\n${famList}\n  },`;
    })
    .join('\n');

  const output = `export enum AZURE_VM_FAMILY_ENUM {
${familyEnum}
};

export enum AZURE_VM_ENUM {
${vmEnum}
};

export const AZURE_VM = {
${vm}
};
  `;

  fs.writeFileSync(
    `${__dirname}/../../../../../src/lib/cloud-hiker/core/azure/virtual-machines.ts`,
    output
  );

  const regionsOutput = `export enum REGIONS {
${regions.map(r => `  ${r.toUpperCase()} = '${r}',`).join('\n')}
}
`;

  fs.writeFileSync(
    `${__dirname}/../../../../../src/lib/cloud-hiker/core/azure/regions.ts`,
    regionsOutput
  );
})();
