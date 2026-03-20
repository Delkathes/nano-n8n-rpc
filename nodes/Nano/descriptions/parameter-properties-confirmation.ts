import type { INodeProperties } from 'n8n-workflow';

export const confirmationNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Confirmation Hash',
		name: 'confirmationHash',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getConfirmationHistory'],
			},
		},
		default: '',
		placeholder: 'Block hash (optional)',
		description: 'Block hash for confirmation query (optional)',
	},
	{
		displayName: 'Announcements',
		name: 'announcements',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getConfirmationActive'],
			},
		},
		default: 0,
		description:
			'Returns only active elections with equal or higher announcements count. Useful to find long running elections.',
	},
	{
		displayName: 'Include Representatives',
		name: 'includeRepresentatives',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getConfirmationInfo'],
			},
		},
		default: false,
		description: 'Whether to return list of votes representatives & weights for each block',
	},
	{
		displayName: 'Include Contents',
		name: 'includeContents',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getConfirmationInfo'],
			},
		},
		default: true,
		description: 'Whether to include contents for each block',
	},
	{
		displayName: 'JSON Block Format',
		name: 'confirmationJsonBlock',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getConfirmationInfo'],
			},
		},
		default: true,
		description: 'Whether to return contents as JSON subtree instead of JSON string (v19.0+)',
	},
	{
		displayName: 'Include Peer Details',
		name: 'peerDetails',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getConfirmationQuorum'],
			},
		},
		default: false,
		description:
			'Whether to add account/ip/rep weight for each peer considered in the summation of peers_stake_total (v17.0+)',
	},
];
