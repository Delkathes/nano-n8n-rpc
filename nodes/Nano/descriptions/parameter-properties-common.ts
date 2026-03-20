import type { INodeProperties } from 'n8n-workflow';

export const commonNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Timeout (Ms)',
				name: 'timeout',
				type: 'number',
				default: 15_000,
				typeOptions: {
					minValue: 1000,
					maxValue: 600_000,
				},
				description: 'Request timeout in milliseconds',
			},
			{
				displayName: 'Max Retries',
				name: 'maxRetries',
				type: 'number',
				default: 2,
				typeOptions: {
					minValue: 0,
					maxValue: 10,
				},
				description: 'How many times to retry transient RPC failures before failing',
			},
		],
	},
];
