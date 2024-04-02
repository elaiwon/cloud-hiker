# cloud-footprint

`cloud-footprint` is a plugin method which exposes an API for [IF](https://github.com/Green-Software-Foundation/if) to compute Energy and Carbon footprint for cloud services.

## Limitations

In its current version it only supports:
- Azure Services
  - Virtual Machines

## Usage

To run the `<CloudFooprint>`, an instance of `PluginInterface` must be created. Then, the plugin's `execute()` method can be called, passing required arguments to it.

This is how you could run the model in Typescript:

```typescript
async function runPlugin() {
  const newModel = await new CloudFooprint().configure({
    'start-time': '2024-03-15T09:00:00.000Z',
    'end-time': '2024-03-15T20:00:00.000Z',
    'cloud/vendor': 'azure',
    'azure/service': 'virtual-machine',
  });
  const usage = await newModel.calculate([
    {
      'timestamp': '2024-03-15T09:00:00.000Z',
      'duration': 3600,
      'cpu/utilization': 50,
      'azure/instance-type': 'Standard_B2s',
      'azure/region': 'uksouth',
    },
  ]);

  console.log(usage);
}

runPlugin();
```

### Parameters

- Target Cloud Vendor. One of [azure].
`cloud/vendor: azure`
  - Azure Service. One of [virtual-machine].
  `azure/service: virtual-machine`
    - Azure Region: One of [australiacentral, australiacentral2, australiaeast, australiasoutheast, brazilsouth, brazilsoutheast, canadacentral, canadaeast, centralindia, centralus, centraluseuap, eastasia, eastus, eastus2, eastus2euap, eastusstg, francecentral, francesouth, germanynorth, germanywestcentral, israelcentral, italynorth, japaneast, japanwest, jioindiacentral, jioindiawest, koreacentral, koreasouth, malaysiasouth, mexicocentral, northcentralus, northeurope, norwayeast, norwaywest, polandcentral, qatarcentral, southafricanorth, southafricawest, southcentralus, southcentralusstg, southeastasia, southindia, spaincentral, swedencentral, swedensouth, switzerlandnorth, switzerlandwest, taiwannorth, taiwannorthwest, uaecentral, uaenorth, uksouth, ukwest, westcentralus, westeurope, westindia, westus, westus2, westus3]
    `azure/region': uksouth`
    - Azure Power Usage Effectiveness (PUE).
    Default: 1.185
    `azure/granularity: 1.185`
    - Server Expected Lifespan (in hours).
    Default: 35040 (4 years)
    `cpu/expected-lifespan: 35040`
    - Instance Type. One of [A0, A1, A2, A3, A4, A1_v2, A2m_v2, A2_v2, A4m_v2, A4_v2, A5, A6, A7, A8m_v2, A8_v2, B12ms, B16als_v2, B16as_v2, B16ls_v2, B16ms, B16pls_v2, B16ps_v2, B16s_v2, B1ls, B1ms, B1s, B20ms, B2als_v2, B2as_v2, B2ats_v2, B2ls_v2, B2ms, B2pls_v2, B2ps_v2, B2pts_v2, B2s, B2s_v2, B2ts_v2, B32als_v2, B32as_v2, B32ls_v2, B32s_v2, B4als_v2, B4as_v2, B4ls_v2, B4ms, B4pls_v2, B4ps_v2, B4s_v2, B8als_v2, B8as_v2, B8ls_v2, B8ms, B8pls_v2, B8ps_v2, B8s_v2, D1, D11, D11_v2, D11_v2_Promo, D12, D12_v2, D12_v2_Promo, D13, D13_v2, D13_v2_Promo, D14, D14_v2, D14_v2_Promo, D15_v2, D16ads_v5, D16as_v4, D16as_v5, D16a_v4, D16ds_v4, D16ds_v5, D16d_v4, D16d_v5, D16lds_v5, D16ls_v5, D16pds_v5, D16plds_v5, D16pls_v5, D16ps_v5, D16s_v3, D16s_v4, D16s_v5, D16_v3, D16_v4, D16_v5, D1_v2, D2, D2ads_v5, D2as_v4, D2as_v5, D2a_v4, D2ds_v4, D2ds_v5, D2d_v4, D2d_v5, D2lds_v5, D2ls_v5, D2pds_v5, D2plds_v5, D2pls_v5, D2ps_v5, D2s_v3, D2s_v4, D2s_v5, D2_v2, D2_v2_Promo, D2_v3, D2_v4, D2_v5, D3, D32ads_v5, D32as_v4, D32as_v5, D32a_v4, D32ds_v4, D32ds_v5, D32d_v4, D32d_v5, D32lds_v5, D32ls_v5, D32pds_v5, D32plds_v5, D32pls_v5, D32ps_v5, D32s_v3, D32s_v4, D32s_v5, D32_v3, D32_v4, D32_v5, D3_v2, D3_v2_Promo, D4, D48ads_v5, D48as_v4, D48as_v5, D48a_v4, D48ds_v4, D48ds_v5, D48d_v4, D48d_v5, D48lds_v5, D48ls_v5, D48pds_v5, D48plds_v5, D48pls_v5, D48ps_v5, D48s_v3, D48s_v4, D48s_v5, D48_v3, D48_v4, D48_v5, D4ads_v5, D4as_v4, D4as_v5, D4a_v4, D4ds_v4, D4ds_v5, D4d_v4, D4d_v5, D4lds_v5, D4ls_v5, D4pds_v5, D4plds_v5, D4pls_v5, D4ps_v5, D4s_v3, D4s_v4, D4s_v5, D4_v2, D4_v2_Promo, D4_v3, D4_v4, D4_v5, D5_v2, D5_v2_Promo, D64ads_v5, D64as_v4, D64as_v5, D64a_v4, D64ds_v4, D64ds_v5, D64d_v4, D64d_v5, D64lds_v5, D64ls_v5, D64pds_v5, D64plds_v5, D64pls_v5, D64ps_v5, D64s_v3, D64s_v4, D64s_v5, D64_v3, D64_v4, D64_v5, D8ads_v5, D8as_v4, D8as_v5, D8a_v4, D8ds_v4, D8ds_v5, D8d_v4, D8d_v5, D8lds_v5, D8ls_v5, D8pds_v5, D8plds_v5, D8pls_v5, D8ps_v5, D8s_v3, D8s_v4, D8s_v5, D8_v3, D8_v4, D8_v5, D96ads_v5, D96as_v4, D96as_v5, D96a_v4, D96ds_v5, D96d_v5, D96lds_v5, D96ls_v5, D96s_v5, D96_v5, DC16ads_cc_v5, DC16ads_v5, DC16as_cc_v5, DC16as_v5, DC16ds_v3, DC16eds_v5, DC16es_v5, DC16s_v3, DC1ds_v3, DC1s_v2, DC1s_v3, DC24ds_v3, DC24s_v3, DC2ads_v5, DC2as_v5, DC2ds_v3, DC2eds_v5, DC2es_v5, DC2s_v2, DC2s_v3, DC32ads_cc_v5, DC32ads_v5, DC32as_cc_v5, DC32as_v5, DC32ds_v3, DC32eds_v5, DC32es_v5, DC32s_v3, DC48ads_cc_v5, DC48ads_v5, DC48as_cc_v5, DC48as_v5, DC48ds_v3, DC48eds_v5, DC48es_v5, DC48s_v3, DC4ads_cc_v5, DC4ads_v5, DC4as_cc_v5, DC4as_v5, DC4ds_v3, DC4eds_v5, DC4es_v5, DC4s_v2, DC4s_v3, DC64ads_cc_v5, DC64ads_v5, DC64as_cc_v5, DC64as_v5, DC64eds_v5, DC64es_v5, DC8ads_cc_v5, DC8ads_v5, DC8as_cc_v5, DC8as_v5, DC8ds_v3, DC8eds_v5, DC8es_v5, DC8s_v3, DC8_v2, DC96ads_cc_v5, DC96ads_v5, DC96as_cc_v5, DC96as_v5, DC96eds_v5, DC96es_v5, DS1, DS11, DS11-1_v2, DS11_v2, DS11_v2_Promo, DS12, DS12-1_v2, DS12-2_v2, DS12_v2, DS12_v2_Promo, DS13, DS13-2_v2, DS13-4_v2, DS13_v2, DS13_v2_Promo, DS14, DS14-4_v2, DS14-8_v2, DS14_v2, DS14_v2_Promo, DS15_v2, DS1_v2, DS2, DS2_v2, DS2_v2_Promo, DS3, DS3_v2, DS3_v2_Promo, DS4, DS4_v2, DS4_v2_Promo, DS5_v2, DS5_v2_Promo, E104ids_v5, E104id_v5, E104is_v5, E104i_v5, E112iads_v5, E112ias_v5, E112ibds_v5, E112ibs_v5, E16-4ads_v5, E16-4as_v4, E16-4as_v5, E16-4ds_v4, E16-4ds_v5, E16-4s_v3, E16-4s_v4, E16-4s_v5, E16-8ads_v5, E16-8as_v4, E16-8as_v5, E16-8ds_v4, E16-8ds_v5, E16-8s_v3, E16-8s_v4, E16-8s_v5, E16ads_v5, E16as_v4, E16as_v5, E16a_v4, E16bds_v5, E16bs_v5, E16ds_v4, E16ds_v5, E16d_v4, E16d_v5, E16pds_v5, E16ps_v5, E16s_v3, E16s_v4, E16s_v5, E16_v3, E16_v4, E16_v5, E20ads_v5, E20as_v4, E20as_v5, E20a_v4, E20ds_v4, E20ds_v5, E20d_v4, E20d_v5, E20pds_v5, E20ps_v5, E20s_v3, E20s_v4, E20s_v5, E20_v3, E20_v4, E20_v5, E2ads_v5, E2as_v4, E2as_v5, E2a_v4, E2bds_v5, E2bs_v5, E2ds_v4, E2ds_v5, E2d_v4, E2d_v5, E2pds_v5, E2ps_v5, E2s_v3, E2s_v4, E2s_v5, E2_v3, E2_v4, E2_v5, E32-16ads_v5, E32-16as_v4, E32-16as_v5, E32-16ds_v4, E32-16ds_v5, E32-16s_v3, E32-16s_v4, E32-16s_v5, E32-8ads_v5, E32-8as_v4, E32-8as_v5, E32-8ds_v4, E32-8ds_v5, E32-8s_v3, E32-8s_v4, E32-8s_v5, E32ads_v5, E32as_v4, E32as_v5, E32a_v4, E32bds_v5, E32bs_v5, E32ds_v4, E32ds_v5, E32d_v4, E32d_v5, E32pds_v5, E32ps_v5, E32s_v3, E32s_v4, E32s_v5, E32_v3, E32_v4, E32_v5, E4-2ads_v5, E4-2as_v4, E4-2as_v5, E4-2ds_v4, E4-2ds_v5, E4-2s_v3, E4-2s_v4, E4-2s_v5, E48ads_v5, E48as_v4, E48as_v5, E48a_v4, E48bds_v5, E48bs_v5, E48ds_v4, E48ds_v5, E48d_v4, E48d_v5, E48s_v3, E48s_v4, E48s_v5, E48_v3, E48_v4, E48_v5, E4ads_v5, E4as_v4, E4as_v5, E4a_v4, E4bds_v5, E4bs_v5, E4ds_v4, E4ds_v5, E4d_v4, E4d_v5, E4pds_v5, E4ps_v5, E4s_v3, E4s_v4, E4s_v5, E4_v3, E4_v4, E4_v5, E64-16ads_v5, E64-16as_v4, E64-16as_v5, E64-16ds_v4, E64-16ds_v5, E64-16s_v3, E64-16s_v4, E64-16s_v5, E64-32ads_v5, E64-32as_v4, E64-32as_v5, E64-32ds_v4, E64-32ds_v5, E64-32s_v3, E64-32s_v4, E64-32s_v5, E64ads_v5, E64as_v4, E64as_v5, E64a_v4, E64bds_v5, E64bs_v5, E64ds_v4, E64ds_v5, E64d_v4, E64d_v5, E64is_v3, E64i_v3, E64s_v3, E64s_v4, E64s_v5, E64_v3, E64_v4, E64_v5, E8-2ads_v5, E8-2as_v4, E8-2as_v5, E8-2ds_v4, E8-2ds_v5, E8-2s_v3, E8-2s_v4, E8-2s_v5, E8-4ads_v5, E8-4as_v4, E8-4as_v5, E8-4ds_v4, E8-4ds_v5, E8-4s_v3, E8-4s_v4, E8-4s_v5, E80ids_v4, E80is_v4, E8ads_v5, E8as_v4, E8as_v5, E8a_v4, E8bds_v5, E8bs_v5, E8ds_v4, E8ds_v5, E8d_v4, E8d_v5, E8pds_v5, E8ps_v5, E8s_v3, E8s_v4, E8s_v5, E8_v3, E8_v4, E8_v5, E96-24ads_v5, E96-24as_v4, E96-24as_v5, E96-24ds_v5, E96-24s_v5, E96-48ads_v5, E96-48as_v4, E96-48as_v5, E96-48ds_v5, E96-48s_v5, E96ads_v5, E96as_v4, E96as_v5, E96a_v4, E96bds_v5, E96bs_v5, E96ds_v5, E96d_v5, E96ias_v4, E96s_v5, E96_v5, EC128eds_v5, EC128es_v5, EC128ieds_v5, EC128ies_v5, EC16ads_cc_v5, EC16ads_v5, EC16as_cc_v5, EC16as_v5, EC16eds_v5, EC16es_v5, EC20ads_cc_v5, EC20ads_v5, EC20as_cc_v5, EC20as_v5, EC2ads_v5, EC2as_v5, EC2eds_v5, EC2es_v5, EC32ads_cc_v5, EC32ads_v5, EC32as_cc_v5, EC32as_v5, EC32eds_v5, EC32es_v5, EC48ads_cc_v5, EC48ads_v5, EC48as_cc_v5, EC48as_v5, EC48eds_v5, EC48es_v5, EC4ads_cc_v5, EC4ads_v5, EC4as_cc_v5, EC4as_v5, EC4eds_v5, EC4es_v5, EC64ads_cc_v5, EC64ads_v5, EC64as_cc_v5, EC64as_v5, EC64eds_v5, EC64es_v5, EC8ads_cc_v5, EC8ads_v5, EC8as_cc_v5, EC8as_v5, EC8eds_v5, EC8es_v5, EC96ads_cc_v5, EC96ads_v5, EC96as_cc_v5, EC96as_v5, EC96iads_v5, EC96ias_v5, F1, F16, F16s, F16s_v2, F1s, F2, F2s, F2s_v2, F32s_v2, F4, F48s_v2, F4s, F4s_v2, F64s_v2, F72s_v2, F8, F8s, F8s_v2, FX12mds, FX24mds, FX36mds, FX48mds, FX4mds, G1, G2, G3, G4, G5, GS1, GS2, GS3, GS4, GS4-4, GS4-8, GS5, GS5-16, GS5-8, HB120-16rs_v2, HB120-16rs_v3, HB120-32rs_v2, HB120-32rs_v3, HB120-64rs_v2, HB120-64rs_v3, HB120-96rs_v2, HB120-96rs_v3, HB120rs_v2, HB120rs_v3, HB176-144rs_v4, HB176-144s_v4, HB176-24rs_v4, HB176-24s_v4, HB176-48rs_v4, HB176-48s_v4, HB176-96rs_v4, HB176-96s_v4, HB176rs_v4, HB176s_v4, HB60-15rs, HB60-30rs, HB60-45rs, HB60rs, HC44-16rs, HC44-32rs, HC44rs, HX176-144rs, HX176-144s, HX176-24rs, HX176-24s, HX176-48rs, HX176-48s, HX176-96rs, HX176-96s, HX176rs, HX176s, L16as_v3, L16s, L16s_v2, L16s_v3, L32as_v3, L32s, L32s_v2, L32s_v3, L48as_v3, L48s_v2, L48s_v3, L4s, L64as_v3, L64s_v2, L64s_v3, L80as_v3, L80s_v2, L80s_v3, L8as_v3, L8s, L8s_v2, L8s_v3, M128, M128-32ms, M128-64ms, M128dms_v2, M128ds_v2, M128m, M128ms, M128ms_v2, M128s, M128s_v2, M12ds_v3, M12s_v3, M16-4ms, M16-8ms, M16ms, M176ds_3_v3, M176ds_4_v3, M176s_3_v3, M176s_4_v3, M192idms_v2, M192ids_v2, M192ims_v2, M192is_v2, M208ms_v2, M208s_v2, M24ds_v3, M24s_v3, M32-16ms, M32-8ms, M32dms_v2, M32ls, M32ms, M32ms_v2, M32ts, M416-208ms_v2, M416-208s_v2, M416ms_v2, M416s_8_v2, M416s_v2, M48ds_1_v3, M48s_1_v3, M64, M64-16ms, M64-32ms, M64dms_v2, M64ds_v2, M64ls, M64m, M64ms, M64ms_v2, M64s, M64s_v2, M8-2ms, M8-4ms, M8ms, M96ds_1_v3, M96ds_2_v3, M96s_1_v3, M96s_2_v3, NC12, NC12s_v3, NC12_Promo, NC16ads_A10_v4, NC16as_T4_v3, NC24, NC24ads_A100_v4, NC24r, NC24rs_v3, NC24r_Promo, NC24s_v3, NC24_Promo, NC32ads_A10_v4, NC40ads_H100_v5, NC48ads_A100_v4, NC4as_T4_v3, NC6, NC64as_T4_v3, NC6s_v3, NC6_Promo, NC80adis_H100_v5, NC8ads_A10_v4, NC8as_T4_v3, NC96ads_A100_v4, ND40rs_v2, ND40s_v3, ND96amsr_A100_v4, ND96asr_v4, ND96isr_H100_v5, ND96is_H100_v5, NG16ads_V620_v1, NG32adms_V620_v1, NG32ads_V620_v1, NG8ads_V620_v1, NP10s, NP20s, NP40s, NV12, NV12ads_A10_v5, NV12s_v2, NV12s_v3, NV12_Promo, NV16as_v4, NV18ads_A10_v5, NV24, NV24s_v2, NV24s_v3, NV24_Promo, NV32as_v4, NV36adms_A10_v5, NV36ads_A10_v5, NV48s_v3, NV4as_v4, NV6, NV6ads_A10_v5, NV6s_v2, NV6_Promo, NV72ads_A10_v5, NV8as_v4, PB6s]

## Testing model integration

### Using local links

For using locally developed model in `IF Framework` please follow these steps: 

1. On the root level of a locally developed model run `npm link`, which will create global package. It uses `package.json` file's `name` field as a package name. Additionally name can be checked by running `npm ls -g --depth=0 --link=true`.
2. Use the linked model in impl by specifying `name`, `method`, `path` in initialize models section. 

```yaml
name: cloud-usage-link
description: loads plugin
tags: null
initialize:
  plugins:
    my-custom-plugin:
      method: CloudFootprint
      path: "cloud-hiker"
      global-config:
        ...
...
```

### Using directly from Github

You can simply push your model to the public Github repository and pass the path to it in your impl.
For example, for a model saved in `https://github.com/elaiwon/cloud-hiker` you can do the following:

npm install your model: 

```
npm install -g https://github.com/elaiwon/cloud-hiker
```

Then, in your `impl`, provide the path in the model instantiation. You also need to specify which class the model instantiates. In this case you are using the `PluginInterface`, so you can specify `CloudFootprint`. 

```yaml
name: plugin-demo-git
description: loads plugin
tags: null
initialize:
  plugins:
    my-custom-plugin:
      method: CloudFootprint
      path: https://github.com/elaiwon/cloud-hiker
      global-config:
        ...
...
```

Now, when you run the `manifest` using the IF CLI, it will load the model automatically. Run using:

```sh
ie --manifest <path-to-your-impl> --output <path-to-save-output>
```
