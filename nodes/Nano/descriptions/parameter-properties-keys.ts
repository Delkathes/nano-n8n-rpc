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
				description: 'Sign with a private key',
			},
			{
				name: 'Wallet Account',
				value: 'wallet',
				description: 'Sign with an account from a wallet',
			},
		],
		default: 'key',
		description: 'Method to use for signing (v18.0+)',
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
		description: 'Private key for signing',
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
		description: 'Account in wallet to sign with',
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
				description: 'Sign a block (returns signed block)',
			},
			{
				name: 'Hash',
				value: 'hash',
				description: 'Sign a hash directly (requires rpc.enable_sign_hash config)',
			},
		],
		default: 'block',
		description: 'What to sign - a block or a hash directly',
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
		description: 'Block JSON to sign. The signature field will be updated in the response.',
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
		placeholder: 'Hash to sign',
		description: 'Hash to sign directly (requires rpc.enable_sign_hash config on the node)',
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
