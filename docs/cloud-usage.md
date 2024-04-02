# cloud-usage

`cloud-usage` is a plugin method which exposes an API for [IF](https://github.com/Green-Software-Foundation/if) to retrieve the service usage details for a cloud service.

## Limitations

In its current version it only supports:
- Azure Services
  - Virtual Machines

## Authentication

The `CloudList` method requires the user to be authenticated with a Cloud account where the data is retrieved from.

### Azure

Login with [Azure Command-Line Interface (CLI)](https://learn.microsoft.com/en-us/cli/azure/)

```bash
az login
```

## Usage

To run the `<CloudUsage>`, an instance of `PluginInterface` must be created. Then, the plugin's `execute()` method can be called, passing required arguments to it.

This is how you could run the model in Typescript:

```typescript
async function runPlugin() {
  const newModel = await new CloudUsage().configure({
    'start-time': '2024-03-15T09:00:00.000Z',
    'end-time': '2024-03-15T20:00:00.000Z',
    'cloud/vendor': 'azure',
  });
  const usage = await newModel.calculate([
    {
      'azure/resource-id': '/subscriptions/some-subscription-id/resourceGroups/some-resource-group/providers/Microsoft.Compute/virtualMachines/some-name',
    },
  ]);

  console.log(usage);
}

runPlugin();
```

### Parameters

- Start Time. ISO8601 data/time string for the beginning of the period.
`start-time: 2024-03-15T09:00:00.000Z`
- End Time. ISO8601 data/time string for the end of the period.
`end-time: 2024-03-15T20:00:00.000Z`
- Target Cloud Vendor. One of [azure].
`cloud/vendor: azure`
  - Azure Service
  `azure/service: virtual-machine`
    - Azure Resource Id
    `azure/resource-id: /subscriptions/some-subscription-id/resourceGroups/some-resource-group/providers/Microsoft.Compute/virtualMachines/some-name`
    - Azure Granularity. It's an ISO8601 period string(P[n]Y[n]M[n]DT[n]H[n]M[n]S).
    Default: PT1H
    `azure/granularity: PT1H`

## Testing model integration

### Using local links

For using locally developed model in `IF Framework` please follow these steps: 

1. On the root level of a locally developed model run `npm link`, which will create global package. It uses `package.json` file's `name` field as a package name. Additionally name can be checked by running `npm ls -g --depth=0 --link=true`.
2. Use the linked model in impl by specifying `name`, `method`, `path` in initialize models section. 

```yaml
name: cloud-list-link
description: loads plugin
tags: null
initialize:
  plugins:
    my-custom-plugin:
      method: CloudList
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

Then, in your `impl`, provide the path in the model instantiation. You also need to specify which class the model instantiates. In this case you are using the `PluginInterface`, so you can specify `CloudList`. 

```yaml
name: plugin-demo-git
description: loads plugin
tags: null
initialize:
  plugins:
    my-custom-plugin:
      method: CloudList
      path: https://github.com/elaiwon/cloud-hiker
      global-config:
        ...
...
```

Now, when you run the `manifest` using the IF CLI, it will load the model automatically. Run using:

```sh
ie --manifest <path-to-your-impl> --output <path-to-save-output>
```
