# cloud-hiker

`cloud-hiker` is an environmental impact calculator template which exposes an API for [IF](https://github.com/Green-Software-Foundation/if) to retrieve energy and embodied carbon estimates.

## Methods

- [CloudList](./docs/cloud-list.md)
- [CloudUsage](./docs/cloud-usage.md)
- [CloudFootprint](./docs/cloud-footprint.md)
- [TreesFlightsPhones](./docs/trees-flights-phones.md)

## TO DO

- Add Storage, Memory and Network Usage
Current implementation does not retrieve and compute the footprint for storage, memory and network usage.
- Add Other Cloud Providers
  - AWS
  - GCP
  - AllyCloud
- Not all VMs have proper CCF parameters
- Comment Code
- Unit Tests
