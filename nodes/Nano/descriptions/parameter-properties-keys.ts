import type { INodeProperties } from 'n8n-workflow';

export const keyNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Sign Method',
		name: 'signMethod',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['signBlock'],
			},
		},
		options: [
			{
				name: 'Private Key',
				value: 'key',
				description: 'Sign with a raw private key (bypasses wallet isolation)',
			},
			{
				name: 'Wallet Account',
				value: 'wallet',
				description: 'Sign using an account held in a wallet (requires wallet ID)',
			},
		],
		default: 'key',
		description:
			'How to provide signing credentials (v18.0+). Either a private key or a wallet account is required.',
	},
	{
		displayName:
			'Security notice: signing with a raw private key bypasses wallet isolation. Prefer wallet-based signing for long-lived workflows and rotate the key immediately if it may have been exposed.',
		name: 'signPrivateKeySecurityNotice',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['signBlock'],
				signMethod: ['key'],
			},
		},
		default: '',
	},
	{
		displayName: 'Private Key',
		name: 'signPrivateKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['signBlock'],
				signMethod: ['key'],
			},
		},
		default: '',
		placeholder: '64-character hex string',
		description:
			'Private key to sign with (64 hex characters). Required when Sign Method is Private Key.',
	},
	{
		displayName: 'Sign Account',
		name: 'signAccount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['signBlock'],
				signMethod: ['wallet'],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description:
			'Nano account address held in the wallet. Required when Sign Method is Wallet Account. Uses the credential Wallet ID by default, or the Wallet ID field below if provided.',
	},
	{
		displayName: 'Sign Input',
		name: 'signInput',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['signBlock'],
			},
		},
		options: [
			{
				name: 'Block',
				value: 'block',
				description: 'Sign a block (returns the signed block)',
			},
			{
				name: 'Hash',
				value: 'hash',
				description: 'Sign a raw block hash directly (requires rpc.enable_sign_hash on the node)',
			},
		],
		default: 'block',
		description:
			'What to sign. Either a block JSON object (recommended) or a raw block hash string.',
	},
	{
		displayName: 'Block to Sign',
		name: 'signBlock',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				operation: ['signBlock'],
				signInput: ['block'],
			},
		},
		default: '{}',
		description:
			'Block JSON to sign. Must include type, account, previous, representative, balance, and link. The signature field will be computed and added to the response.',
	},
	{
		displayName: 'Hash to Sign',
		name: 'hashToSign',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['signBlock'],
				signInput: ['hash'],
			},
		},
		default: '',
		placeholder: '64-character hex hash',
		description:
			'Raw block hash to sign directly (64 hex characters). Requires rpc.enable_sign_hash to be enabled on the Nano node.',
	},
	{
		displayName:
			'Security notice: expanding a private key reveals the linked public key and account details. Only use keys from trusted sources and remove them from workflow history after testing.',
		name: 'expandKeySecurityNotice',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['expandKey'],
			},
		},
		default: '',
	},
	{
		displayName: 'Private Key',
		name: 'privateKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['expandKey'],
			},
		},
		default: '',
		placeholder: '64-character hex string',
		description: 'Private key for expanding',
	},
	{
		displayName:
			'Security notice: a Nano seed can derive an entire account tree. Treat it like a master secret, keep it out of workflow outputs, and rotate any dependent wallet if the seed may have leaked.',
		name: 'seedSecurityNotice',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['getDeterministicKey'],
			},
		},
		default: '',
	},
	{
		displayName: 'Seed',
		name: 'seed',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['getDeterministicKey'],
			},
		},
		default: '',
		placeholder: '64-character hex string',
		description: 'Seed for deterministic key generation',
	},
	{
		displayName: 'Index',
		name: 'index',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				operation: ['getDeterministicKey'],
			},
		},
		default: 0,
		description: 'Index for deterministic key generation',
	},
];
