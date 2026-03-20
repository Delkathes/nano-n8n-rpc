import type { INodeProperties } from 'n8n-workflow';

export const conversionNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Amount to Convert',
		name: 'convertAmount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['nanoToRawRPC', 'rawToNanoRPC'],
			},
		},
		default: '',
		placeholder: '1.5 or 1500000000000000000000000000000',
	},
];
