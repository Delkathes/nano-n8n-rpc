import type { INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export const NanoTriggerDescription: INodeTypeDescription = {
	displayName: 'Nano Trigger',
	name: 'nanoTrigger',
	icon: 'file:nano.svg',
	group: ['trigger'],
	version: 1,
	description: 'Receive Nano block confirmations via HTTP callback',
	defaults: {
		name: 'Nano Trigger',
	},
	inputs: [],
	outputs: [NodeConnectionTypes.Main],
	credentials: [
		{
			name: 'nanoApi',
			required: true,
		},
	],
	webhooks: [
		{
			name: 'default',
			httpMethod: 'POST',
			responseMode: 'onReceived',
			path: 'webhook',
		},
	],
	properties: [
		{
			displayName: 'Configuration Info',
			name: 'configNotice',
			type: 'notice',
			default:
				'Configure your Nano node to send HTTP callbacks to the webhook URL shown above. Only block confirmation events are supported via HTTP callbacks.',
		},
		{
			displayName: 'Filter Options',
			name: 'filterOptions',
			type: 'collection',
			placeholder: 'Add Filter',
			default: {},
			options: [
				{
					displayName: 'Accounts',
					name: 'accounts',
					type: 'string',
					default: '',
					placeholder: 'nano_1abc...,nano_2def...',
					description:
						'Comma-separated list of accounts to filter events for. Only events matching these accounts will trigger the workflow.',
				},
				{
					displayName: 'Block Subtypes',
					name: 'subtypes',
					type: 'multiOptions',
					default: [],
					options: [
						{
							name: 'Send',
							value: 'send',
							description: 'Sending transactions',
						},
						{
							name: 'Receive',
							value: 'receive',
							description: 'Receiving transactions',
						},
						{
							name: 'Change',
							value: 'change',
							description: 'Representative change blocks',
						},
						{
							name: 'Epoch',
							value: 'epoch',
							description: 'Epoch upgrade blocks',
						},
					],
					description: 'Filter by block subtypes. Leave empty to receive all subtypes.',
				},
				{
					displayName: 'Minimum Amount (Nano)',
					name: 'minAmount',
					type: 'number',
					default: 0,
					description:
						'Only trigger for confirmations with at least this amount in Nano. Set to 0 to disable.',
					typeOptions: {
						minValue: 0,
						numberPrecision: 6,
					},
				},
				{
					displayName: 'Maximum Amount (Nano)',
					name: 'maxAmount',
					type: 'number',
					default: 0,
					description:
						'Only trigger for confirmations with at most this amount in Nano. Set to 0 to disable.',
					typeOptions: {
						minValue: 0,
						numberPrecision: 6,
					},
				},
			],
		},
		{
			displayName: 'Advanced Options',
			name: 'advancedOptions',
			type: 'collection',
			placeholder: 'Add Option',
			default: {},
			options: [
				{
					displayName: 'Include Block Contents',
					name: 'includeBlock',
					type: 'boolean',
					default: true,
					description: 'Whether to include full block contents in the response',
				},
				{
					displayName: 'Validate Block Signature',
					name: 'validateSignature',
					type: 'boolean',
					default: false,
					description: 'Whether to validate block signature (extra RPC call + requires credentials)',
				},
				{
					displayName: 'Enrich With Account Info',
					name: 'enrichAccountInfo',
					type: 'boolean',
					default: false,
					description:
						'Whether to fetch additional account information (balance, representative) via RPC',
				},
				{
					displayName: 'Deduplicate By Hash',
					name: 'deduplicateHash',
					type: 'boolean',
					default: true,
					description: 'Whether to prevent duplicate triggers for the same block hash',
				},
			],
		},
	],
};