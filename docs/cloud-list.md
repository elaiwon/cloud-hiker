# cloud-list

`cloud-list` is a plugin method which exposes an API for [IF](https://github.com/Green-Software-Foundation/if) to list the details of Cloud Services.

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

To run the `CloudList`, an instance of `PluginInterface` must be created. Then, the plugin's `execute()` method can be called, passing required arguments to it.

This is how you could run the model in Typescript:

```typescript
async function runPlugin() {
  const newModel = await new CloudList().configure({
    'cloud/vendor': 'azure',
    'azure/subscription-id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  });
  const usage = await newModel.calculate([
    {
      'azure/service': 'virtual-machine',
    },
  ]);

  console.log(usage);
}

runPlugin();
```

### Parameters

- Target Cloud Vendor. One of [azure].
`cloud/vendor: azure`
  - Azure Subscription Id.
  `azure/subscription-id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Azure Service. One of [virtual-machine].
  `azure/service: virtual-machine`

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
      method: CloudUsage
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
      method: CloudUsage
      path: https://github.com/elaiwon/cloud-hiker
      global-config:
        ...
...
```

Now, when you run the `manifest` using the IF CLI, it will load the model automatically. Run using:

```sh
ie --manifest <path-to-your-impl> --output <path-to-save-output>
```
