import type { INodeProperties } from 'n8n-workflow';

export const blockNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Block Hash',
		name: 'blockHash',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'receive',
					'blockInfo',
					'blockAccount',
					'confirmBlock',
					'receivableExists',
					'getConfirmationInfo',
					'generateWork',
					'getChain',
					'validateWork',
				],
			},
		},
		default: '',
		placeholder: 'ABC123DEF456...',
		description: 'Hash of the block',
	},
	{
		displayName: 'JSON Block Format',
		name: 'jsonBlock',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['blockInfo', 'getBlockHash', 'createBlock'],
			},
		},
		default: true,
		description: 'Whether to return block contents as a JSON object instead of a JSON string',
	},
	{
		displayName: 'Include Linked Account',
		name: 'includeLinkedAccount',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['blockInfo'],
			},
		},
		default: false,
		description:
			'Whether to include the linked account associated with the block (e.g., sender for receive blocks, recipient for send blocks)',
	},
	{
		displayName: 'Block Hashes',
		name: 'blockHashes',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['getBlocks', 'getBlocksInfo'],
			},
		},
		default: '',
		placeholder: 'hash1,hash2,hash3',
		description: 'Comma-separated list of block hashes',
	},
	{
		displayName: 'Include Not Found',
		name: 'blocksInfoIncludeNotFound',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getBlocksInfo'],
			},
		},
		default: false,
		description: 'Whether to include blocks_not_found array instead of erroring (v19.0+)',
	},
	{
		displayName: 'Include Pending Status',
		name: 'blocksInfoPending',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getBlocksInfo'],
			},
		},
		default: false,
		description: 'Whether to check if block is pending/receivable (v9.0+)',
	},
	{
		displayName: 'Include Source Account',
		name: 'blocksInfoSource',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getBlocksInfo'],
			},
		},
		default: false,
		description: 'Whether to return source account for receive & open blocks (v9.0+)',
	},
	{
		displayName: 'Include Receive Hash',
		name: 'blocksInfoReceiveHash',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getBlocksInfo'],
			},
		},
		default: false,
		description: 'Whether to include hash of corresponding receive block for send blocks (v24.0+)',
	},
	{
		displayName: 'Include Linked Account',
		name: 'blocksInfoIncludeLinkedAccount',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getBlocksInfo'],
			},
		},
		default: false,
		description: 'Whether to include linked_account field (v28.0+)',
	},
	{
		displayName: 'Block Type',
		name: 'blockType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		options: [
			{ name: 'State', value: 'state' },
			{ name: 'Send', value: 'send' },
			{ name: 'Receive', value: 'receive' },
			{ name: 'Change', value: 'change' },
		],
		default: 'send',
		description: 'Type of block to create',
	},
	{
		displayName: 'Balance',
		name: 'balance',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: '15000000000000000000000',
		description:
			"Final balance for account after block creation, formatted in 'raw' units using a decimal integer. If balance is less than previous, block is considered as send subtype!.",
	},
	{
		displayName: 'Wallet',
		name: 'createBlockWallet',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'Wallet ID',
		description: 'The wallet ID that the account the block is being created for is in',
	},
	{
		displayName: 'Account Address',
		name: 'createBlockAccount',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description: 'The account the block is being created for',
	},
	{
		displayName:
			'Security notice: providing a private key here signs the block directly and grants full control over that account. Prefer wallet + account parameters when possible and never reuse an exposed key.',
		name: 'createBlockPrivateKeySecurityNotice',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
	},
	{
		displayName: 'Private Key',
		name: 'privateKey',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: '64-character hex string',
		description:
			'Instead of using "wallet" & "account" parameters, you can directly pass in a private key',
	},
	{
		displayName: 'Source',
		name: 'source',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'Block hash',
		description:
			'The block hash of the source of funds for this receive block (the send block that this receive block will pocket)',
	},
	{
		displayName: 'Destination Address',
		name: 'destination',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description: 'The account that the sent funds should be accessible to',
	},
	{
		displayName: 'Link',
		name: 'link',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'Public key or Block hash',
		description:
			'Instead of using "source" and "destination" parameters, you can directly pass "link". If the block is sending funds, set link to the public key of the destination account. If it is receiving funds, set link to the hash of the block to receive. If the block has no balance change but is updating representative only, set link to 0.',
	},
	{
		displayName: 'Representative',
		name: 'representative',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description: 'The account that block account will use as its representative',
	},
	{
		displayName: 'Previous',
		name: 'previous',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'Block hash',
		description:
			'The block hash of the previous block on this account\'s block chain ("0" for first block)',
	},
	{
		displayName: 'Block Parameters',
		name: 'blockParams',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				operation: ['getBlockHash'],
			},
		},
		default: '{}',
		description: 'Block parameters as JSON',
	},
];
