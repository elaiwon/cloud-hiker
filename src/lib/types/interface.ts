export type PluginParams = Record<string, any>;

export type PluginInterface = {
  execute: (
    inputs: PluginParams[],
    config?: Record<string, any>
  ) => Promise<PluginParams[]>;
  metadata: {
    kind: string;
  };
  [key: string]: any;
};

export enum CLOUD_VENDORS {
  AWS = 'aws',
  AZURE = 'azure',
  GCP = 'gcp',
}

export enum AWS_CLOUD_SERVICES {
  VIRTUAL_MACHINE = 'virtual-machine',
}

export enum AZURE_CLOUD_SERVICES {
  VIRTUAL_MACHINE = 'virtual-machine',
}

export enum GCP_CLOUD_SERVICES {
  VIRTUAL_MACHINE = 'virtual-machine',
}
