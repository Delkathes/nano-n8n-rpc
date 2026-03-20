import type { INodeProperties } from 'n8n-workflow';

export const representativeNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Threshold (Raw)',
		name: 'delegatorsThreshold',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delegators'],
			},
		},
		default: '',
		placeholder: '1000000000000000000000000000000',
		hint: 'Leave empty to return all delegators regardless of balance',
		description:
			'Minimum balance threshold in raw units - only delegators with at least this balance will be returned (v23.0+)',
	},
	{
		displayName: 'Count',
		name: 'delegatorsCount',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['delegators'],
			},
		},
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		hint: 'Set to 0 to return all delegators',
		description: 'Maximum number of delegators to return (v23.0+)',
	},
	{
		displayName: 'Start After Account',
		name: 'delegatorsStart',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delegators'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		hint: 'For pagination - leave empty to start from beginning',
		description: 'Account to start after for pagination (v23.0+)',
	},
];
