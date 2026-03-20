import type { INodeProperties } from 'n8n-workflow';

export const workNanoRPCParameterProperties: INodeProperties[] = [
	{
		displayName: 'Work',
		name: 'work',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['validateWork'],
			},
		},
		default: '',
		placeholder: 'Work hex string',
		description: 'Proof of work to validate',
	},
	{
		displayName: 'Work',
		name: 'workCreateBlock',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createBlock'],
			},
		},
		default: '',
		placeholder: 'Work hex string',
		description:
			'Work value (16 hexadecimal digits string, 64 bit). Uses work value for block from external source.',
	},
	{
		displayName: 'Difficulty',
		name: 'difficulty',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateWork', 'validateWork', 'createBlock'],
			},
		},
		default: '',
		placeholder: 'fffffff800000000',
		description: 'Work difficulty threshold (optional)',
	},
	{
		displayName: 'Multiplier',
		name: 'workMultiplier',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['generateWork', 'validateWork'],
			},
		},
		default: 0,
		placeholder: '1.0',
		description:
			'Multiplier from base difficulty (v20.0+). Overrides difficulty if provided. Set to 0 or leave empty to not use.',
	},
	{
		displayName: 'Use Peers',
		name: 'usePeers',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['generateWork'],
			},
		},
		default: false,
		description: 'Whether to query work peers instead of doing local computation (v14.0+)',
	},
	{
		displayName: 'Account (For Peers)',
		name: 'workAccount',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateWork'],
				usePeers: [true],
			},
		},
		default: '',
		placeholder: 'nano_1abc...',
		description: 'Account to relay to work peers (v20.0+). Only used when Use Peers is enabled.',
	},
	{
		displayName: 'Work Version',
		name: 'workVersion',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateWork', 'validateWork', 'createBlock'],
			},
		},
		default: '',
		placeholder: 'work_1',
		description: 'Work version string (v21.0+). Leave empty for default "work_1".',
	},
	{
		displayName: 'Block (For Auto Difficulty)',
		name: 'workBlock',
		type: 'json',
		displayOptions: {
			show: {
				operation: ['generateWork'],
			},
		},
		default: '',
		description:
			'Provide a block for automatic difficulty calculation (v21.0+). Leave empty to use the hash and difficulty/multiplier instead.',
	},
	{
		displayName: 'Work Hash',
		name: 'workHash',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['cancelWork'],
			},
		},
		default: '',
		placeholder: 'Hash of work to cancel',
		description: 'Hash of the work generation to cancel',
	},
	{
		displayName: 'Peer Address',
		name: 'peerAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['addWorkPeer'],
			},
		},
		default: '',
		placeholder: '::1 or 192.168.1.1',
		description: 'Peer IP address',
	},
	{
		displayName: 'Peer Port',
		name: 'peerPort',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				operation: ['addWorkPeer'],
			},
		},
		default: 7075,
		description: 'Peer port number',
	},
];
