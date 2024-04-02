import {CloudList} from '../../../lib/cloud-hiker/cloud-list';
import azure from '../../../lib/cloud-hiker/core/azure';
jest.mock('../../../lib/cloud-hiker/core/azure');

const mockedAzure = azure as jest.Mocked<typeof azure>;

describe('lib/cloud-hiker/cloud-list: ', () => {
  describe('CloudList(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = CloudList({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = CloudList({});
        const inputs = [
          {
            'azure/service': 'virtual-machine',
            'cloud/vendor': 'azure',
            'azure/subscription-id': 'someSubscriptionId',
          },
        ];
        const list = [
          {
            'azure/resource-id':
              '/subscriptions/someSubscriptionId/resourceGroups/someResourceGroup/providers/Microsoft.Compute/virtualMachines/someName',
            name: 'someName',
            'azure/instance-type': 'Standard_B2s',
          },
        ];
        const outputs = [
          {
            ...inputs[0],
            'azure/virtual-machine-list': list,
          },
        ];

        mockedAzure.getVirtualMachineList.mockResolvedValue(list);
        const response = await pluginInstance.execute(inputs, {});
        expect(response).toEqual(outputs);
      });
    });
  });
});
