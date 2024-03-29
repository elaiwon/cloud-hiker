import {CloudUsage} from '../../../lib/cloud-hiker/cloud-usage';
import azure from '../../../lib/cloud-hiker/core/azure';
jest.mock('../../../lib/cloud-hiker/core/azure');

const mockedAzure = azure as jest.Mocked<typeof azure>;

describe('lib/cloud-hiker/cloud-list: ', () => {
  describe('CloudList(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = CloudUsage({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = CloudUsage({});
        const inputs = [
          {
            'azure/service': 'virtual-machine',
            'cloud/vendor': 'azure',
            'azure/resource-id':
              '/subscriptions/someSubscriptionId/resourceGroups/someResourceGroup/providers/Microsoft.Compute/virtualMachines/someName',
            'azure/instance-type': 'Standard_B2s',
            'start-time': new Date('2024-03-15T09:00:00.000Z'),
            'end-time': new Date('2024-03-15T20:00:00.000Z'),
          },
        ];
        const usage = [
          {
            timestamp: '2024-03-15T09:00:00.000Z',
            'cpu/utilization': 65.79406976744185,
          },
        ];
        const outputs = [
          {
            ...inputs[0],
            ...usage[0],
          },
        ];

        mockedAzure.getVirtualMachineUsage.mockResolvedValue(usage);
        const response = await pluginInstance.execute(inputs, {});
        expect(response).toEqual(outputs);
      });
    });
  });
});
