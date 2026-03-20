import type { INodeProperties } from 'n8n-workflow';

export const accountNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Address to Validate',
		name: 'addressToValidate',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['validate'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description: 'Nano address to validate',
	},
	{
		displayName: 'Account Address',
		name: 'account',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'balance',
					'accountInfo',
					'accountBlockCount',
					'accountKey',
					'accountRepresentative',
					'accountWeight',
					'history',
					'receivable',
					'delegators',
					'delegatorsCount',
				],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description: 'Nano account address',
	},
	{
		displayName: 'Confirmed Only',
		name: 'balanceIncludeOnlyConfirmed',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['balance'],
			},
		},
		default: true,
		description:
			'Whether to only include confirmed blocks in balance and confirmed incoming sends in receivable (v22.0+)',
	},
	{
		displayName: 'Include Representative',
		name: 'accountInfoRepresentative',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['accountInfo'],
			},
		},
		default: true,
		description: 'Whether to include representative account in response (v9.0+)',
	},
	{
		displayName: 'Include Weight',
		name: 'accountInfoWeight',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['accountInfo'],
			},
		},
		default: true,
		description: 'Whether to include voting weight in response (v9.0+)',
	},
	{
		displayName: 'Include Pending/Receivable',
		name: 'accountInfoPending',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['accountInfo'],
			},
		},
		default: true,
		description: 'Whether to include pending/receivable balance in response (v9.0+)',
	},
	{
		displayName: 'Include Confirmed',
		name: 'accountInfoIncludeConfirmed',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['accountInfo'],
			},
		},
		default: false,
		description:
			'Whether to include confirmed_balance, confirmed_height, confirmed_frontier, and other confirmed fields (v22.0+)',
	},
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['history', 'receivable'],
			},
		},
		default: 10,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		description: 'Number of transactions to retrieve',
	},
	{
		displayName: 'Head Block',
		name: 'historyHead',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['history'],
			},
		},
		default: '',
		placeholder: '000D1BAE...',
		hint: 'For pagination - use the "previous" value from last response',
		description: 'Block hash to use as head instead of latest block (64 hex characters)',
	},
	{
		displayName: 'Offset',
		name: 'historyOffset',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['history'],
			},
		},
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		hint: 'Skip this many blocks from head',
		description: 'Number of blocks to skip from the head block (v11.0+)',
	},
	{
		displayName: 'Reverse Order',
		name: 'historyReverse',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['history'],
			},
		},
		default: false,
		description:
			'Whether to list from first block toward frontier instead of newest first (v19.0+)',
	},
	{
		displayName: 'Account Filter',
		name: 'historyAccountFilter',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['history'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...,nano_3xyz...',
		hint: 'Comma-separated list of accounts',
		description: 'Filter results to only show sends/receives with these accounts (v19.0+)',
	},
	{
		displayName: 'Include Linked Account',
		name: 'historyIncludeLinkedAccount',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['history'],
			},
		},
		default: false,
		description: 'Whether to include linked_account field in response (v28.0+)',
	},
	{
		displayName: 'Raw Mode',
		name: 'historyRaw',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['history'],
			},
		},
		default: true,
		description:
			'Whether to output all block parameters instead of simplified send/receive data (recommended for detailed info)',
	},
	{
		displayName: 'Accounts',
		name: 'accounts',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['getAccountsBalances'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...,nano_2def...',
		description: 'Comma-separated list of account addresses',
	},
	{
		displayName: 'Include Only Confirmed',
		name: 'accountsBalancesIncludeOnlyConfirmed',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getAccountsBalances'],
			},
		},
		default: true,
		description:
			'Whether to only include confirmed blocks. Set to false to include unconfirmed blocks. (v22.0+)',
	},
	{
		displayName: 'Public Key',
		name: 'publicKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['getAccountFromPublicKey'],
			},
		},
		default: '',
		placeholder: '64-character hex string',
		description: 'Public key to convert to account address',
	},
	{
		displayName: 'Accounts',
		name: 'accountsList',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['getAccountsFrontiers', 'getAccountsReceivable', 'getAccountsRepresentatives'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...,nano_2def...',
		description: 'Comma-separated list of account addresses',
	},
	{
		displayName: 'Count',
		name: 'accountsReceivableCount',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getAccountsReceivable'],
			},
		},
		default: 10,
		typeOptions: {
			minValue: 1,
		},
		description: 'Maximum number of receivable blocks to return per account',
	},
	{
		displayName: 'Threshold (Raw)',
		name: 'accountsReceivableThreshold',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getAccountsReceivable'],
			},
		},
		default: '',
		placeholder: '1000000000000000000000000',
		hint: 'Leave empty to return all receivables regardless of amount',
		description: 'Minimum raw amount threshold to filter receivables',
	},
	{
		displayName: 'Include Source',
		name: 'accountsReceivableSource',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getAccountsReceivable'],
			},
		},
		default: false,
		description: 'Whether to include source account information in response (v15.0+)',
	},
	{
		displayName: 'Sort by Amount',
		name: 'accountsReceivableSorting',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getAccountsReceivable'],
			},
		},
		default: false,
		description: 'Whether to sort receivables by amount in descending order (v19.0+)',
	},
	{
		displayName: 'Offset',
		name: 'accountsReceivableOffset',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['getAccountsReceivable'],
			},
		},
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		hint: 'For pagination - skip this many receivables from the start',
		description: 'Number of receivables to skip for pagination (v19.0+)',
	},
];
