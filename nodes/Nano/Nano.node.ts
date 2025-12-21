import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IDataObject,
	NodeOperationError,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { createNanoRPC } from '../../utils/NanoRPC';
import {
	nanoToRaw,
	rawToNano,
	isValidNanoAddress,
	formatNanoAmount,
} from '../../utils/conversions';
import type { ReceivableExistsOptions } from '../../utils/rpc';
import type { NanoOperationResponse, PendingBlock, BlockContents, BlockSubtype } from './types';

export class Nano implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nano Node RPC',
		name: 'nano',
		icon: 'file:nano.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Nano cryptocurrency network',
		defaults: {
			name: 'Nano Node RPC',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'nanoApi',
				required: false,
			},
		],
		codex: {
			categories: ['Development', 'Cryptocurrency'],
			subcategories: {
				Development: ['Blockchain'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.nano.org/commands/rpc-protocol/',
					},
				],
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Access balances, history, and account state',
					},
					{
						name: 'Administration',
						value: 'administration',
						description: 'Administrative and debug utilities',
					},
					{
						name: 'Block',
						value: 'block',
						description: 'Inspect and create Nano blocks',
					},
					{
						name: 'Confirmation',
						value: 'confirmation',
						description: 'Review block confirmation details',
					},
					{
						name: 'Conversion',
						value: 'conversion',
						description: 'Convert between Nano and raw units',
					},
					{
						name: 'Key',
						value: 'keys',
						description: 'Generate and manage cryptographic keys',
					},
					{
						name: 'Ledger',
						value: 'ledger',
						description: 'Traverse ledger chains and frontiers',
					},
					{
						name: 'Network',
						value: 'network',
						description: 'Retrieve node and peer status',
					},
					{
						name: 'Representative',
						value: 'representative',
						description: 'Inspect representatives and delegators',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Send funds and manage pending blocks',
					},
					{
						name: 'Wallet',
						value: 'wallet',
						description: 'Manage wallet accounts',
					},
					{
						name: 'Work',
						value: 'work',
						description: 'Generate and manage proof-of-work',
					},
				],
				default: 'account',
			},
			// Account resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get Account Block Count',
						value: 'accountBlockCount',
						description:
							'Get the total number of blocks (transactions) that have been confirmed for a specific Nano account. Requires account address. Returns the block count as a number.',
						action: 'Get account block count',
					},
					{
						name: 'Get Account From Public Key',
						value: 'getAccountFromPublicKey',
						description: 'Convert a public key to its corresponding Nano account address',
						action: 'Get account from public key',
					},
					{
						name: 'Get Account Info',
						value: 'accountInfo',
						description: 'Get detailed account information',
						action: 'Get account information',
					},
					{
						name: 'Get Account Key',
						value: 'accountKey',
						description:
							'Retrieve the public key (64 character hex string) associated with a Nano account address. Requires account address. Returns the public key used for cryptographic operations.',
						action: 'Get account public key',
					},
					{
						name: 'Get Account Representative',
						value: 'accountRepresentative',
						description:
							'Get the current voting representative (delegate) for a Nano account. Requires account address. Returns representative account address.',
						action: 'Get account representative',
					},
					{
						name: 'Get Account Weight',
						value: 'accountWeight',
						description:
							'Get the total voting weight delegated to a representative account in raw units. Requires account address. Returns voting weight.',
						action: 'Get account weight',
					},
					{
						name: 'Get Accounts Balances',
						value: 'getAccountsBalances',
						description: 'Get balances for multiple Nano accounts in a single request',
						action: 'Get multiple accounts balances',
					},
					{
						name: 'Get Accounts Frontiers',
						value: 'getAccountsFrontiers',
						description: 'Get frontier (most recent) blocks for multiple accounts',
						action: 'Get accounts frontiers',
					},
					{
						name: 'Get Accounts Receivable',
						value: 'getAccountsReceivable',
						description:
							'Get receivable transactions for multiple accounts with optional thresholds',
						action: 'Get accounts receivable',
					},
					{
						name: 'Get Accounts Representatives',
						value: 'getAccountsRepresentatives',
						description: 'Get the current voting representatives for multiple accounts',
						action: 'Get accounts representatives',
					},
					{
						name: 'Get Balance',
						value: 'balance',
						description: 'Get account balance',
						action: 'Get account balance',
					},
					{
						name: 'Get History',
						value: 'history',
						description: 'Get transaction history',
						action: 'Get transaction history',
					},
					{
						name: 'Get Pending',
						value: 'pending',
						description: 'List pending transactions',
						action: 'List pending transactions',
					},
					{
						name: 'Get Receivable',
						value: 'receivable',
						description: 'List receivable (pending incoming) transactions for an account',
						action: 'Get receivable transactions',
					},
					{
						name: 'Validate Address',
						value: 'validate',
						description: 'Validate Nano address format',
						action: 'Validate a nano address',
					},
				],
				default: 'balance',
			},
			// Transaction resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
					},
				},
				options: [
					{
						name: 'Check Receivable Exists',
						value: 'receivableExists',
						description:
							'Check if a specific receivable block hash exists and is valid in the ledger',
						action: 'Check receivable exists',
					},
					{
						name: 'Epoch Upgrade',
						value: 'epochUpgrade',
						description: 'Perform an epoch upgrade on accounts to enable new protocol features',
						action: 'Epoch upgrade',
					},
					{
						name: 'Process Block',
						value: 'processBlock',
						description:
							'Publish a signed block to the Nano network for processing and confirmation',
						action: 'Process and publish a block',
					},
					{
						name: 'Receive Pending',
						value: 'receive',
						description: 'Receive pending transactions',
						action: 'Receive pending transactions',
					},
					{
						name: 'Send Payment',
						value: 'send',
						description: 'Send Nano to another address',
						action: 'Send a nano payment',
					},
				],
				default: 'send',
			},
			// Block resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['block'],
					},
				},
				options: [
					{
						name: 'Confirm Block',
						value: 'confirmBlock',
						description: 'Manually request active confirmation for a specific block hash',
						action: 'Confirm a block',
					},
					{
						name: 'Create Block',
						value: 'createBlock',
						description: 'Create a new signed block with specified parameters',
						action: 'Create block',
					},
					{
						name: 'Get Block Account',
						value: 'blockAccount',
						description: 'Retrieve the account address that created a specific block',
						action: 'Get block account',
					},
					{
						name: 'Get Block Count',
						value: 'blockCount',
						description: 'Get the total number of confirmed and unchecked blocks',
						action: 'Get block count',
					},
					{
						name: 'Get Block Hash',
						value: 'getBlockHash',
						description: 'Calculate the hash for a block given its JSON structure',
						action: 'Get block hash',
					},
					{
						name: 'Get Block Info',
						value: 'blockInfo',
						description: 'Get information about a specific block',
						action: 'Get block information',
					},
					{
						name: 'Get Blocks',
						value: 'getBlocks',
						description: 'Retrieve the JSON content of multiple blocks by providing their hashes',
						action: 'Get multiple blocks',
					},
					{
						name: 'Get Blocks Info',
						value: 'getBlocksInfo',
						description:
							'Get detailed information for multiple blocks including amounts and confirmations',
						action: 'Get multiple blocks info',
					},
				],
				default: 'blockInfo',
			},
			// Wallet resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['wallet'],
					},
				},
				options: [
					{
						name: 'Add Key to Wallet',
						value: 'walletAdd',
						description: 'Add an existing private key to a wallet',
						action: 'Add key to wallet',
					},
					{
						name: 'Add Watch-Only',
						value: 'walletAddWatch',
						description: 'Add watch-only accounts to a wallet',
						action: 'Add watch only accounts',
					},
					{
						name: 'Change Password',
						value: 'passwordChange',
						description: 'Change the password for a wallet',
						action: 'Change wallet password',
					},
					{
						name: 'Change Wallet Seed',
						value: 'walletChangeSeed',
						description: 'Change the seed for a wallet',
						action: 'Change wallet seed',
					},
					{
						name: 'Check Wallet Locked',
						value: 'walletLocked',
						description: 'Check if a wallet is locked',
						action: 'Check wallet locked',
					},
					{
						name: 'Create Account',
						value: 'createAccount',
						description: 'Create new account in wallet',
						action: 'Create a new account',
					},
					{
						name: 'Create Multiple Accounts',
						value: 'accountsCreate',
						description: 'Create multiple accounts in a wallet at once',
						action: 'Create multiple accounts',
					},
					{
						name: 'Create Wallet',
						value: 'walletCreate',
						description: 'Create a new wallet',
						action: 'Create wallet',
					},
					{
						name: 'Destroy Wallet',
						value: 'walletDestroy',
						description: 'Destroy a wallet',
						action: 'Destroy wallet',
					},
					{
						name: 'Enter Password',
						value: 'passwordEnter',
						description: 'Enter password to unlock a wallet',
						action: 'Unlock wallet with password',
					},
					{
						name: 'Export Wallet',
						value: 'walletExport',
						description: 'Export wallet as JSON',
						action: 'Export wallet',
					},
					{
						name: 'Get Account Work',
						value: 'workGet',
						description: 'Get cached work for an account',
						action: 'Get account work',
					},
					{
						name: 'Get Receive Minimum',
						value: 'receiveMinimum',
						description: 'Get the minimum receive threshold',
						action: 'Get receive minimum',
					},
					{
						name: 'Get Wallet Balances',
						value: 'walletBalances',
						description: 'Get balances for all accounts in a wallet',
						action: 'Get wallet balances',
					},
					{
						name: 'Get Wallet Frontiers',
						value: 'walletFrontiers',
						description: 'Get frontiers for all accounts in a wallet',
						action: 'Get wallet frontiers',
					},
					{
						name: 'Get Wallet History',
						value: 'walletHistory',
						description: 'Get transaction history for a wallet',
						action: 'Get wallet history',
					},
					{
						name: 'Get Wallet Info',
						value: 'walletInfo',
						description: 'Get wallet information including balance sum',
						action: 'Get wallet info',
					},
					{
						name: 'Get Wallet Ledger',
						value: 'walletLedger',
						description: 'Get ledger for all accounts in a wallet',
						action: 'Get wallet ledger',
					},
					{
						name: 'Get Wallet Receivable',
						value: 'walletReceivable',
						description: 'Get receivable blocks for a wallet',
						action: 'Get wallet receivable',
					},
					{
						name: 'Get Wallet Representative',
						value: 'walletRepresentative',
						description: 'Get wallet default representative',
						action: 'Get wallet representative',
					},
					{
						name: 'Get Wallet Work',
						value: 'walletWorkGet',
						description: 'Get cached work for a wallet',
						action: 'Get wallet work',
					},
					{
						name: 'List Accounts',
						value: 'listAccounts',
						description: 'List all accounts in wallet',
						action: 'List wallet accounts',
					},
					{
						name: 'Lock Wallet',
						value: 'walletLock',
						description: 'Lock a wallet',
						action: 'Lock wallet',
					},
					{
						name: 'Move Accounts',
						value: 'accountMove',
						description: 'Move accounts from one wallet to another',
						action: 'Move accounts between wallets',
					},
					{
						name: 'Remove Account',
						value: 'accountRemove',
						description: 'Remove an account from a wallet',
						action: 'Remove account from wallet',
					},
					{
						name: 'Republish Wallet Blocks',
						value: 'walletRepublish',
						description: 'Republish blocks for accounts in a wallet',
						action: 'Republish wallet blocks',
					},
					{
						name: 'Search Pending',
						value: 'searchPending',
						description: 'Search for pending blocks in a wallet (deprecated)',
						action: 'Search pending blocks',
					},
					{
						name: 'Search Pending All',
						value: 'searchPendingAll',
						description: 'Search for pending blocks in all wallets (deprecated)',
						action: 'Search all pending blocks',
					},
					{
						name: 'Search Receivable',
						value: 'searchReceivable',
						description: 'Search for receivable blocks in a wallet',
						action: 'Search receivable blocks',
					},
					{
						name: 'Search Receivable All',
						value: 'searchReceivableAll',
						description: 'Search for receivable blocks in all wallets',
						action: 'Search all receivable blocks',
					},
					{
						name: 'Set Account Representative',
						value: 'accountRepresentativeSet',
						description: 'Set the representative for an account in a wallet',
						action: 'Set account representative',
					},
					{
						name: 'Set Account Work',
						value: 'workSet',
						description: 'Set cached work for an account',
						action: 'Set account work',
					},
					{
						name: 'Set Receive Minimum',
						value: 'receiveMinimumSet',
						description: 'Set the minimum receive threshold',
						action: 'Set receive minimum',
					},
					{
						name: 'Set Wallet Representative',
						value: 'walletRepresentativeSet',
						description: 'Set wallet representative for all accounts',
						action: 'Set wallet representative',
					},
					{
						name: 'Validate Password',
						value: 'passwordValid',
						description: 'Check if wallet password is valid',
						action: 'Validate wallet password',
					},
					{
						name: 'Wallet Contains',
						value: 'walletContains',
						description: 'Check if a wallet contains an account',
						action: 'Check wallet contains account',
					},
				],
				default: 'createAccount',
			},
			// Ledger resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ledger'],
					},
				},
				options: [
					{
						name: 'Get Chain',
						value: 'getChain',
						description: 'Get the block chain sequence starting from a specific block hash',
						action: 'Get block chain',
					},
					{
						name: 'Get Frontier Count',
						value: 'getFrontierCount',
						description: 'Get the total count of frontier blocks in the ledger',
						action: 'Get frontier count',
					},
					{
						name: 'Get Frontiers',
						value: 'getFrontiers',
						description:
							'Get frontier blocks for accounts starting from a specific account address',
						action: 'Get frontiers',
					},
					{
						name: 'Get Ledger',
						value: 'getLedger',
						description:
							'Get ledger information including balances and block data starting from an account',
						action: 'Get ledger info',
					},
					{
						name: 'Get Successors',
						value: 'getSuccessors',
						description: 'Get successor blocks that follow a specific block hash',
						action: 'Get successors',
					},
					{
						name: 'Get Unopened',
						value: 'getUnopened',
						description:
							'Get accounts that have receivable transactions but have never been opened',
						action: 'Get unopened accounts',
					},
				],
				default: 'getLedger',
			},
			// Network resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['network'],
					},
				},
				options: [
					{
						name: 'Get Available Supply',
						value: 'getAvailableSupply',
						description: 'Get the total available supply of Nano in circulation',
						action: 'Get available supply',
					},
					{
						name: 'Get Node ID',
						value: 'getNodeId',
						description: 'Get the unique node ID key pair for this Nano node',
						action: 'Get node ID',
					},
					{
						name: 'Get Node Version',
						value: 'version',
						description: 'Get the Nano node software and protocol versions',
						action: 'Get node version',
					},
					{
						name: 'Get Peers',
						value: 'getPeers',
						description: 'List all currently connected peer nodes in the Nano network',
						action: 'Get peers',
					},
					{
						name: 'Get Representatives',
						value: 'getRepresentatives',
						description: 'Get a list of known voting representatives with their weights',
						action: 'Get representatives',
					},
					{
						name: 'Get Representatives Online',
						value: 'representativesOnline',
						description: 'List all voting representatives that are currently online',
						action: 'Get online representatives',
					},
					{
						name: 'Get Telemetry',
						value: 'getTelemetry',
						description: 'Get comprehensive telemetry data from the node',
						action: 'Get telemetry',
					},
					{
						name: 'Get Uptime',
						value: 'getUptime',
						description: 'Get the uptime of the Nano node in seconds',
						action: 'Get node uptime',
					},
					{
						name: 'Keepalive',
						value: 'keepalive',
						description: 'Send a keepalive packet to a specific peer to maintain connection',
						action: 'Send keepalive',
					},
					{
						name: 'Populate Backlog',
						value: 'populateBacklog',
						description: 'Populate the bootstrap backlog priority queue for faster synchronization',
						action: 'Populate backlog',
					},
					{
						name: 'Republish',
						value: 'republish',
						description: 'Republish blocks starting from a specific hash to ensure propagation',
						action: 'Republish blocks',
					},
				],
				default: 'version',
			},
			// Confirmation resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['confirmation'],
					},
				},
				options: [
					{
						name: 'Get Confirmation Active',
						value: 'getConfirmationActive',
						description: 'Get blocks currently being actively confirmed by the network',
						action: 'Get confirmation active',
					},
					{
						name: 'Get Confirmation History',
						value: 'getConfirmationHistory',
						description: 'Get recent confirmation history with optional block filtering',
						action: 'Get confirmation history',
					},
					{
						name: 'Get Confirmation Info',
						value: 'getConfirmationInfo',
						description: 'Get detailed confirmation status and voting information for a block',
						action: 'Get confirmation info',
					},
					{
						name: 'Get Confirmation Quorum',
						value: 'getConfirmationQuorum',
						description: 'Get quorum information for block confirmations including peer weights',
						action: 'Get confirmation quorum',
					},
					{
						name: 'Get Election Statistics',
						value: 'getElectionStatistics',
						description: 'Get statistics about active and recently completed elections',
						action: 'Get election statistics',
					},
				],
				default: 'getConfirmationInfo',
			},
			// Work resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['work'],
					},
				},
				options: [
					{
						name: 'Add Work Peer',
						value: 'addWorkPeer',
						description: 'Add a work peer node for distributed proof-of-work generation',
						action: 'Add work peer',
					},
					{
						name: 'Cancel Work',
						value: 'cancelWork',
						description: 'Cancel an ongoing proof-of-work generation task for a block hash',
						action: 'Cancel work',
					},
					{
						name: 'Clear Work Peers',
						value: 'clearWorkPeers',
						description: 'Remove all configured work peers from the distributed PoW system',
						action: 'Clear work peers',
					},
					{
						name: 'Generate Work',
						value: 'generateWork',
						description: 'Generate proof-of-work for a block hash',
						action: 'Generate work',
					},
					{
						name: 'Get Work Peers',
						value: 'getWorkPeers',
						description: 'List all configured work peer nodes',
						action: 'Get work peers',
					},
					{
						name: 'Validate Work',
						value: 'validateWork',
						description: 'Validate if a proof-of-work value meets the difficulty threshold',
						action: 'Validate work',
					},
				],
				default: 'generateWork',
			},
			// Keys resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['keys'],
					},
				},
				options: [
					{
						name: 'Create Key',
						value: 'createKey',
						description: 'Generate a new random cryptographic keypair',
						action: 'Create new keypair',
					},
					{
						name: 'Sign',
						value: 'sign',
						description: 'Sign a hash using a private key',
						action: 'Sign hash',
					},
					{
						name: 'Expand Key',
						value: 'expandKey',
						description: 'Derive the public key and Nano account address from a private key',
						action: 'Expand private key',
					},
					{
						name: 'Get Deterministic Key',
						value: 'getDeterministicKey',
						description: 'Generate a deterministic keypair from a seed and index',
						action: 'Get deterministic key',
					},
				],
				default: 'createKey',
			},
			// Representative resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['representative'],
					},
				},
				options: [
					{
						name: 'Get Delegators',
						value: 'delegators',
						description: 'Get all accounts that delegate their voting weight to a representative',
						action: 'Get delegators',
					},
					{
						name: 'Get Delegators Count',
						value: 'delegatorsCount',
						description: 'Get the total count of accounts delegating to a representative',
						action: 'Get delegators count',
					},
				],
				default: 'delegators',
			},
			// Administration resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['administration'],
					},
				},
				options: [
					{
						name: 'Bootstrap',
						value: 'bootstrap',
						description: 'Bootstrap the node ledger from a specific peer',
						action: 'Bootstrap node',
					},
					{
						name: 'Bootstrap Any',
						value: 'bootstrapAny',
						description: 'Bootstrap the node ledger from any available peer automatically',
						action: 'Bootstrap any',
					},
					{
						name: 'Bootstrap Lazy',
						value: 'bootstrapLazy',
						description: 'Perform lazy bootstrap starting from a specific block hash',
						action: 'Bootstrap lazy',
					},
					{
						name: 'Clear Stats',
						value: 'clearStats',
						description: 'Clear all collected node statistics and reset counters',
						action: 'Clear stats',
					},
					{
						name: 'Clear Unchecked',
						value: 'clearUnchecked',
						description: 'Clear all unchecked blocks from the database',
						action: 'Clear unchecked',
					},
					{
						name: 'Get Bootstrap Priorities',
						value: 'getBootstrapPriorities',
						description: 'Get the current bootstrap priority queue for synchronization',
						action: 'Get bootstrap priorities',
					},
					{
						name: 'Get Bootstrap Status',
						value: 'getBootstrapStatus',
						description: 'Get the current status of the bootstrap process',
						action: 'Get bootstrap status',
					},
					{
						name: 'Get Database Txn Tracker',
						value: 'getDatabaseTxnTracker',
						description: 'Get database transaction tracking information for debugging',
						action: 'Get database txn tracker',
					},
					{
						name: 'Get Stats',
						value: 'getStats',
						description: 'Get detailed node statistics including counters, samples, or objects',
						action: 'Get node stats',
					},
					{
						name: 'Get Unchecked',
						value: 'getUnchecked',
						description: 'Get unchecked blocks that have been received but not validated',
						action: 'Get unchecked blocks',
					},
					{
						name: 'Get Unchecked Block',
						value: 'getUncheckedBlock',
						description: 'Get a specific unchecked block by its hash',
						action: 'Get unchecked block',
					},
					{
						name: 'Get Unchecked Keys',
						value: 'getUncheckedKeys',
						description: 'List unchecked block keys with optional pagination',
						action: 'Get unchecked keys',
					},
					{
						name: 'Reset Bootstrap',
						value: 'resetBootstrap',
						description: 'Reset the bootstrap process and clear the queue',
						action: 'Reset bootstrap',
					},
					{
						name: 'Stop Node',
						value: 'stopNode',
						description: 'Safely shutdown the Nano node',
						action: 'Stop node',
					},
				],
				default: 'bootstrap',
			},
			// Conversion resource operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['conversion'],
					},
				},
				options: [
					{
						name: 'Nano to Raw (RPC)',
						value: 'nanoToRawRPC',
						description: 'Convert Nano amount to raw units (1 NANO = 10^30 raw) via RPC call',
						action: 'Convert nano to raw',
					},
					{
						name: 'Raw to Nano (RPC)',
						value: 'rawToNanoRPC',
						description: 'Convert raw units to Nano amount via RPC call',
						action: 'Convert raw to nano',
					},
				],
				default: 'nanoToRawRPC',
			},

			// ===== SEND OPERATION =====
			{
				displayName: 'Destination Address',
				name: 'destination',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['send'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Nano address to send funds to',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['send'],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
					numberPrecision: 6,
				},
				description: 'Amount to send in NANO',
			},
			{
				displayName: 'Source Account',
				name: 'sourceAccount',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['send'],
					},
				},
				default: '',
				placeholder: 'nano_1xyz... (leave empty to use default)',
				description: 'Source account to send from. Leave empty to use default from credentials.',
			},
			{
				displayName: 'Idempotency ID',
				name: 'sendId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['send'],
					},
				},
				default: '',
				placeholder: '7081e2b8fec9146e',
				hint: 'Highly recommended to prevent duplicate sends on retries',
				description: 'Unique ID for this send request. If provided, calling send again with the same ID will return the original block instead of creating a duplicate transaction. Use a UUID or unique string per transaction.',
			},
			{
				displayName: 'External Work',
				name: 'sendWork',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['send'],
					},
				},
				default: '',
				placeholder: '2bf29ef00786a6bc',
				hint: 'Leave empty to let the node generate work',
				description: 'Pre-computed work value (16 hexadecimal digits). When provided, disables work precaching for this account.',
			},

			// ===== BALANCE/INFO OPERATIONS =====
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
							'pending',
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

			// ===== BALANCE OPTIONS =====
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
				description: 'Whether to only include confirmed blocks in balance and confirmed incoming sends in receivable (v22.0+)',
			},

			// ===== ACCOUNT INFO OPTIONS =====
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
				description: 'Whether to include confirmed_balance, confirmed_height, confirmed_frontier, and other confirmed fields (v22.0+)',
			},

			// ===== HISTORY OPERATION =====
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['history', 'pending', 'receivable'],
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
				description: 'Whether to list from first block toward frontier instead of newest first (v19.0+)',
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
				description: 'Whether to output all block parameters instead of simplified send/receive data (recommended for detailed info)',
			},

			// ===== DELEGATORS OPTIONS =====
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
				description: 'Minimum balance threshold in raw units - only delegators with at least this balance will be returned (v23.0+)',
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

			// ===== RECEIVABLE OPERATION =====
			{
				displayName: 'Threshold',
				name: 'threshold',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['receivable'],
					},
				},
				default: '',
				placeholder: '1000000000000000000000000',
				description: 'Minimum amount in raw (optional, v8.0+)',
			},
			{
				displayName: 'Include Source',
				name: 'receivableSource',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivable'],
					},
				},
				default: true,
				description: 'Whether to include source account information (v9.0+)',
			},
			{
				displayName: 'Include Active',
				name: 'receivableIncludeActive',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivable'],
					},
				},
				default: false,
				description: 'Whether to include active blocks without finished confirmations (v15.0+)',
			},
			{
				displayName: 'Min Version',
				name: 'receivableMinVersion',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivable'],
					},
				},
				default: false,
				description: 'Whether to return minimum epoch version required to receive each block (v15.0+)',
			},
			{
				displayName: 'Sort by Amount',
				name: 'receivableSorting',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivable'],
					},
				},
				default: false,
				description: 'Whether to sort blocks by amount descending (v19.0+, v22.0+ for absolute sorting)',
			},
			{
				displayName: 'Confirmed Only',
				name: 'receivableIncludeOnlyConfirmed',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivable'],
					},
				},
				default: true,
				description: 'Whether to only return confirmed blocks (v19.0+, default true in v22.0+)',
			},

			// ===== RECEIVE OPERATION =====
			{
				displayName: 'Receiving Account',
				name: 'receivingAccount',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['receive'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Account that will receive the pending block',
			},
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
						operation: ['blockInfo'],
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
				description: 'Whether to include the linked account associated with the block (e.g., sender for receive blocks, recipient for send blocks)',
			},

			// ===== RECEIVABLE EXISTS OPTIONS =====
			{
				displayName: 'Include Active',
				name: 'receiveExistsIncludeActive',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivableExists'],
					},
				},
				default: false,
				description: 'Whether to include active blocks without finished confirmations (v15.0+)',
			},
			{
				displayName: 'Include Only Confirmed',
				name: 'receiveExistsIncludeOnlyConfirmed',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['receivableExists'],
					},
				},
				default: true,
				description: 'Whether to only return confirmed blocks (v19.0+, default true in v22.0+)',
			},

			// ===== RECEIVE WORK OPTION =====
			{
				displayName: 'Work',
				name: 'receiveWork',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['receive'],
					},
				},
				default: '',
				placeholder: 'FFFF000000000000',
				description: 'Optional precomputed work value (16 hexadecimal digits). Uses work value for block from external source and disables work precaching for this account (v9.0+).',
			},

			// ===== PROCESS BLOCK OPERATION =====
			{
				displayName: 'Block JSON',
				name: 'blockJson',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['processBlock'],
					},
				},
				default: '{}',
				description: 'Block data in JSON format',
			},
			{
				displayName: 'Subtype',
				name: 'subtype',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['processBlock'],
					},
				},
				options: [
					{ name: 'Change', value: 'change' },
					{ name: 'Epoch', value: 'epoch' },
					{ name: 'Open', value: 'open' },
					{ name: 'Receive', value: 'receive' },
					{ name: 'Send', value: 'send' },
				],
				default: 'send',
				description: 'Block subtype - highly recommended to prevent accidental operations (v18.0+)',
			},
			{
				displayName: 'Force',
				name: 'processForce',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['processBlock'],
					},
				},
				default: false,
				description: 'Whether to force fork resolution if block is not accepted (v13.1+)',
			},
			{
				displayName: 'Async',
				name: 'processAsync',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['processBlock'],
					},
				},
				default: false,
				description: 'Whether to process asynchronously and return immediately (v22.0+)',
			},

			// ===== VALIDATE OPERATION =====
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

			// ===== BLOCK OPERATIONS =====
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

			// ===== LEDGER OPERATIONS =====
			{
				displayName: 'Starting Account',
				name: 'startingAccount',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getFrontiers', 'getLedger'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Account to start from',
			},
			// ===== GET LEDGER OPTIONS =====
			{
				displayName: 'Count',
				name: 'ledgerCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: 10,
				typeOptions: {
					minValue: 1,
				},
				hint: 'Ignored if Sort by Balance is enabled',
				description: 'Number of accounts to return',
			},
			{
				displayName: 'Include Representative',
				name: 'ledgerRepresentative',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: false,
				description: 'Whether to include representative for each account',
			},
			{
				displayName: 'Include Weight',
				name: 'ledgerWeight',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: false,
				description: 'Whether to include voting weight for each account',
			},
			{
				displayName: 'Include Receivable',
				name: 'ledgerReceivable',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: false,
				description: 'Whether to include receivable balance for each account',
			},
			{
				displayName: 'Modified Since',
				name: 'ledgerModifiedSince',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				hint: 'Set to 0 to return all accounts regardless of modification time',
				description: 'Return only accounts modified after this UNIX timestamp (v11.0+)',
			},
			{
				displayName: 'Sort by Balance',
				name: 'ledgerSorting',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: false,
				description: 'Whether to sort accounts by balance in descending order. Note: When enabled, the Count option is ignored.',
			},
			{
				displayName: 'Threshold (Raw)',
				name: 'ledgerThreshold',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLedger'],
					},
				},
				default: '',
				placeholder: '1000000000000000000000000000000',
				hint: 'Leave empty to return all accounts regardless of balance',
				description: 'Return only accounts with balance above this threshold in raw (v19.0+). If Include Receivable is enabled, compares sum of balance and receivable.',
			},

			// ===== WORK OPERATIONS =====
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
				displayName: 'Difficulty',
				name: 'difficulty',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateWork', 'validateWork'],
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
				description: 'Multiplier from base difficulty (v20.0+). Overrides difficulty if provided. Set to 0 or leave empty to not use.',
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
						operation: ['generateWork', 'validateWork'],
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
				description: 'Provide a block for automatic difficulty calculation (v21.0+). Leave empty to use the hash and difficulty/multiplier instead.',
			},

			// ===== KEY OPERATIONS =====
			{
				displayName: 'Sign Method',
				name: 'signMethod',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['sign'],
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
				displayName: 'Sign Input',
				name: 'signInput',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['sign'],
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
				displayName: 'Private Key',
				name: 'signPrivateKey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sign'],
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
						operation: ['sign'],
						signMethod: ['wallet'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Account in wallet to sign with',
			},
			{
				displayName: 'Block to Sign',
				name: 'signBlock',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['sign'],
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
						operation: ['sign'],
						signInput: ['hash'],
					},
				},
				default: '',
				placeholder: 'Hash to sign',
				description: 'Hash to sign directly (requires rpc.enable_sign_hash config on the node)',
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

			// ===== BATCH OPERATIONS =====
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
				description: 'Whether to only include confirmed blocks. Set to false to include unconfirmed blocks. (v22.0+)',
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

			// ===== NETWORK OPERATIONS =====
			{
				displayName: 'Include Peer Details',
				name: 'peerDetails',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getPeers'],
					},
				},
				default: false,
				description: 'Whether to include detailed peer info including node_id and connection type (v18.0+)',
			},
			{
				displayName: 'Sort by Weight',
				name: 'sorting',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getRepresentatives'],
					},
				},
				default: false,
				description: 'Whether to sort representatives by voting weight in descending order. Note: When enabled, the Count option is ignored and all representatives are returned sorted.',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getRepresentatives'],
						sorting: [false],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				hint: 'Set to 0 to return all representatives',
				description: 'Maximum number of representatives to return',
			},
			{
				displayName: 'Include Weight',
				name: 'includeWeight',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['representativesOnline'],
					},
				},
				default: false,
				description: 'Whether to include voting weight for each representative',
			},
			{
				displayName: 'Filter by Accounts',
				name: 'filterAccounts',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['representativesOnline'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...,nano_2def...',
				hint: 'Leave empty to return all online representatives',
				description: 'Comma-separated list of accounts to filter results (only returns representatives from this list that are online)',
			},
			{
				displayName: 'Stats Type',
				name: 'statsType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['getStats'],
					},
				},
				options: [
					{ name: 'Counters', value: 'counters' },
					{ name: 'Samples', value: 'samples' },
					{ name: 'Objects', value: 'objects' },
				],
				default: 'counters',
				description: 'Type of statistics to retrieve',
			},
			// ===== TELEMETRY OPTIONS =====
			{
				displayName: 'Raw Metrics',
				name: 'telemetryRaw',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getTelemetry'],
					},
				},
				default: false,
				description: 'Whether to return metrics from all nodes with address and port for each peer',
			},
			{
				displayName: 'Specific Peer Address',
				name: 'telemetryAddress',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getTelemetry'],
						telemetryRaw: [false],
					},
				},
				default: '',
				placeholder: '192.168.1.1 or ::ffff:192.168.1.1',
				hint: 'Leave empty to get aggregated telemetry from all peers',
				description: 'Get telemetry from a specific peer. Accepts both IPv4 and IPv6 addresses.',
			},
			{
				displayName: 'Specific Peer Port',
				name: 'telemetryPort',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getTelemetry'],
						telemetryRaw: [false],
					},
				},
				default: 7075,
				description: 'Port of the specific peer to get telemetry from (required if address is provided)',
			},
			{
				displayName: 'Bootstrap Address',
				name: 'bootstrapAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['bootstrap'],
					},
				},
				default: '',
				placeholder: '::1 or 192.168.1.1',
				description: 'IP address of the peer to bootstrap from',
			},
			{
				displayName: 'Bootstrap Port',
				name: 'bootstrapPort',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['bootstrap'],
					},
				},
				default: 7075,
				description: 'Port of the peer to bootstrap from',
			},
			{
				displayName: 'Bypass Frontier Confirmation',
				name: 'bootstrapBypassFrontierConfirmation',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['bootstrap'],
					},
				},
				default: false,
				description: 'Whether to skip frontier confirmation during bootstrap (v20.0-21.3)',
			},
			{
				displayName: 'Bootstrap ID',
				name: 'bootstrapId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['bootstrap', 'bootstrapAny', 'bootstrapLazy'],
					},
				},
				default: '',
				placeholder: 'my-bootstrap-001',
				description: 'Set a specific ID for the bootstrap attempt for tracking (v21.0+)',
			},
			{
				displayName: 'Force',
				name: 'bootstrapAnyForce',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['bootstrapAny'],
					},
				},
				default: false,
				description: 'Whether to force closing of all current bootstraps (v20.0+)',
			},
			{
				displayName: 'Target Account',
				name: 'bootstrapAnyAccount',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['bootstrapAny'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Target a specific account for the bootstrap attempt (v22.0+)',
			},

			// ===== ADDITIONAL ACCOUNT OPERATIONS =====
			{
				displayName: 'Accounts',
				name: 'accountsList',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'getAccountsFrontiers',
							'getAccountsReceivable',
							'getAccountsRepresentatives',
						],
					},
				},
				default: '',
				placeholder: 'nano_1abc...,nano_2def...',
				description: 'Comma-separated list of account addresses',
			},
			// ===== ACCOUNTS RECEIVABLE OPTIONS =====
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

			// ===== BLOCK CREATION =====
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
					{ name: 'Send', value: 'send' },
					{ name: 'Receive', value: 'receive' },
					{ name: 'Change', value: 'change' },
				],
				default: 'send',
				description: 'Type of block to create',
			},
			{
				displayName: 'Block Parameters',
				name: 'blockParams',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['createBlock', 'getBlockHash'],
					},
				},
				default: '{}',
				description: 'Block parameters as JSON',
			},

			// ===== EPOCH UPGRADE =====
			{
				displayName: 'Epoch',
				name: 'epoch',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['epochUpgrade'],
					},
				},
				default: 2,
				description: 'Epoch number',
			},
			{
				displayName: 'Epoch Key',
				name: 'epochKey',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['epochUpgrade'],
					},
				},
				default: '',
				placeholder: 'Private key for epoch signing',
				description: 'Private key for epoch upgrade',
			},

			// ===== KEEPALIVE & WORK PEERS =====
			{
				displayName: 'Peer Address',
				name: 'peerAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['keepalive', 'addWorkPeer'],
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
						operation: ['keepalive', 'addWorkPeer'],
					},
				},
				default: 7075,
				description: 'Peer port number',
			},

			// ===== REPUBLISH =====
			{
				displayName: 'Republish Hash',
				name: 'republishHash',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['republish'],
					},
				},
				default: '',
				placeholder: 'Block hash to republish',
				description: 'Hash of block to republish',
			},
			{
				displayName: 'Sources',
				name: 'sources',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['republish'],
					},
				},
				default: 2,
				description: 'Number of source peers',
			},
			{
				displayName: 'Destinations',
				name: 'destinations',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['republish'],
					},
				},
				default: 2,
				description: 'Number of destination peers',
			},

			// ===== LEDGER OPERATIONS =====
			{
				displayName: 'Starting Block',
				name: 'startingBlock',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getSuccessors'],
					},
				},
				default: '',
				placeholder: 'Block hash',
				description: 'Block hash to start from',
			},
			{
				displayName: 'Offset',
				name: 'chainOffset',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getChain', 'getSuccessors'],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				description: 'Number of blocks to skip from the starting block (v18.0+)',
			},
			{
				displayName: 'Reverse Direction',
				name: 'chainReverse',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getChain', 'getSuccessors'],
					},
				},
				default: false,
				description: 'Whether to reverse the direction of traversal. For chain: returns open→frontier instead of frontier→open. For successors: returns frontier→open instead of open→frontier (v18.0+).',
			},
			{
				displayName: 'Starting Account (Optional)',
				name: 'unopenedAccount',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getUnopened'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Starting account for unopened query (optional)',
			},

			// ===== CONFIRMATION OPERATIONS =====
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
				description: 'Returns only active elections with equal or higher announcements count. Useful to find long running elections.',
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
				description: 'Whether to add account/ip/rep weight for each peer considered in the summation of peers_stake_total (v17.0+)',
			},

			// ===== CANCEL WORK =====
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

			// ===== BOOTSTRAP LAZY =====
			{
				displayName: 'Lazy Hash',
				name: 'lazyHash',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['bootstrapLazy'],
					},
				},
				default: '',
				placeholder: 'Block hash',
				description: 'Hash for lazy bootstrap',
			},
			{
				displayName: 'Force',
				name: 'force',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['bootstrapLazy'],
					},
				},
				default: false,
				description: 'Whether to force bootstrap',
			},

			// ===== DATABASE TXN TRACKER =====
			{
				displayName: 'Minimum Read Time (Ms)',
				name: 'dbTxnMinReadTime',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getDatabaseTxnTracker'],
					},
				},
				default: 1000,
				description: 'Return transactions held open for at least this many milliseconds (read operations)',
			},
			{
				displayName: 'Minimum Write Time (Ms)',
				name: 'dbTxnMinWriteTime',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getDatabaseTxnTracker'],
					},
				},
				default: 0,
				description: 'Return transactions held open for at least this many milliseconds (write operations)',
			},

			// ===== UNCHECKED OPERATIONS =====
			{
				displayName: 'Unchecked Hash',
				name: 'uncheckedHash',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getUncheckedBlock'],
					},
				},
				default: '',
				placeholder: 'Block hash',
				description: 'Hash of unchecked block',
			},
			{
				displayName: 'Unchecked Key',
				name: 'uncheckedKey',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getUncheckedKeys'],
					},
				},
				default: '',
				placeholder: 'Starting key (optional)',
				description: 'Starting key for unchecked query (optional)',
			},

			// ===== CONVERSION OPERATIONS =====
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

			// ===== WALLET OPERATIONS =====
			{
				displayName: 'Account Index',
				name: 'accountIndex',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createAccount'],
					},
				},
				default: -1,
				description: 'Index to create account for (v18.0+), starting with 0. Set to -1 or leave empty to use next available index.',
			},
			{
				displayName: 'Generate Work',
				name: 'createAccountWork',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['createAccount'],
					},
				},
				default: true,
				description: 'Whether to generate work after creating account (v9.0+). Disabling can speed up account creation.',
			},
			{
				displayName: 'Source Wallet',
				name: 'sourceWallet',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['accountMove'],
					},
				},
				default: '',
				placeholder: 'Source wallet ID',
				description: 'Wallet ID to move accounts from',
			},
			{
				displayName: 'Accounts to Move',
				name: 'accountsToMove',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['accountMove'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...,nano_2def...',
				description: 'Comma-separated list of accounts to move',
			},
			{
				displayName: 'Account to Remove',
				name: 'accountToRemove',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['accountRemove'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Account address to remove from wallet',
			},
			{
				displayName: 'Account',
				name: 'walletAccount',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['accountRepresentativeSet', 'walletContains', 'workGet', 'workSet'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...',
				description: 'Account address',
			},
			{
				displayName: 'Representative',
				name: 'representativeAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['accountRepresentativeSet', 'walletRepresentativeSet'],
					},
				},
				default: '',
				placeholder: 'nano_1rep...',
				description: 'Representative account address',
			},
			{
				displayName: 'External Work Value',
				name: 'accountRepSetWork',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['accountRepresentativeSet'],
					},
				},
				default: '',
				placeholder: '16-character hex string',
				description: 'Work value from external source (v9.0+). Disables work precaching if provided.',
			},
			{
				displayName: 'Number of Accounts',
				name: 'accountCount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: ['accountsCreate'],
					},
				},
				default: 1,
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				description: 'Number of accounts to create',
			},
			{
				displayName: 'Enable Work Generation',
				name: 'accountsCreateWork',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['accountsCreate'],
					},
				},
				default: false,
				description: 'Whether to enable work generation after creating accounts (v11.2+, disabled by default)',
			},
			{
				displayName: 'Password',
				name: 'walletPassword',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['passwordChange', 'passwordEnter'],
					},
				},
				default: '',
				description: 'Wallet password',
			},
			{
				displayName: 'Minimum Amount (Raw)',
				name: 'minimumAmount',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['receiveMinimumSet'],
					},
				},
				default: '',
				placeholder: '1000000000000000000000000',
				description: 'Minimum receive threshold in raw units',
			},
			{
				displayName: 'Search Wallet',
				name: 'searchWallet',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['searchPending', 'searchReceivable'],
					},
				},
				default: '',
				placeholder: 'Wallet ID',
				description: 'Wallet ID to search for pending/receivable blocks',
			},
			{
				displayName: 'Private Key',
				name: 'walletPrivateKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['walletAdd'],
					},
				},
				default: '',
				placeholder: '64-character hex string',
				description: 'Private key to add to wallet',
			},
			{
				displayName: 'Disable Work Generation',
				name: 'walletAddDisableWork',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletAdd'],
					},
				},
				default: false,
				description: 'Whether to disable work generation after adding account (v9.0+)',
			},
			{
				displayName: 'Watch Accounts',
				name: 'watchAccounts',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['walletAddWatch'],
					},
				},
				default: '',
				placeholder: 'nano_1abc...,nano_2def...',
				description: 'Comma-separated list of accounts to watch',
			},
			{
				displayName: 'Balance Threshold',
				name: 'balanceThreshold',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['walletBalances', 'walletReceivable'],
					},
				},
				default: '',
				placeholder: '1000000000000000000000000',
				description: 'Minimum balance threshold in raw (optional)',
			},
			{
				displayName: 'New Seed',
				name: 'newSeed',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['walletChangeSeed'],
					},
				},
				default: '',
				placeholder: '64-character hex string',
				description: 'New seed for wallet',
			},
			{
				displayName: 'Restore Count',
				name: 'restoreCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['walletChangeSeed', 'walletCreate'],
					},
				},
				default: 0,
				description: 'Number of accounts to restore (0 for none)',
			},
			{
				displayName: 'Initial Seed',
				name: 'initialSeed',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						operation: ['walletCreate'],
					},
				},
				default: '',
				placeholder: '64-character hex string (optional)',
				description: 'Initial seed for wallet (optional, random if empty)',
			},
			{
				displayName: 'Wallet to Destroy',
				name: 'walletToDestroy',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['walletDestroy'],
					},
				},
				default: '',
				placeholder: 'Wallet ID',
				description: 'Wallet ID to destroy',
			},
			{
				displayName: 'Modified Since',
				name: 'modifiedSince',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['walletHistory', 'walletLedger'],
					},
				},
				default: 0,
				description: 'Unix timestamp to filter results (0 for all)',
			},
			{
				displayName: 'Include Representative',
				name: 'includeRepresentative',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletLedger'],
					},
				},
				default: false,
				description: 'Whether to include representative info',
			},
			{
				displayName: 'Include Weight',
				name: 'includeWeight',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletLedger'],
					},
				},
				default: false,
				description: 'Whether to include weight info',
			},
			{
				displayName: 'Include Receivable',
				name: 'includeReceivable',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletLedger'],
					},
				},
				default: false,
				description: 'Whether to include receivable balance info (replaces deprecated pending parameter)',
			},
			{
				displayName: 'Include Source',
				name: 'includeSource',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletReceivable'],
					},
				},
				default: true,
				description: 'Whether to include source account info',
			},
			{
				displayName: 'Include Active',
				name: 'walletReceivableIncludeActive',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletReceivable'],
					},
				},
				default: false,
				description: 'Whether to include active blocks without finished confirmations (v15.0+)',
			},
			{
				displayName: 'Include Only Confirmed',
				name: 'walletReceivableIncludeOnlyConfirmed',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletReceivable'],
					},
				},
				default: true,
				description: 'Whether to only return confirmed blocks (v19.0+, default true in v22.0+)',
			},
			{
				displayName: 'Update Existing Accounts',
				name: 'updateExisting',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['walletRepresentativeSet'],
					},
				},
				default: true,
				description: 'Whether to update existing accounts to the new representative',
			},
			{
				displayName: 'Republish Count',
				name: 'republishCount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['walletRepublish'],
					},
				},
				default: 1,
				description: 'Number of blocks to republish per account',
			},
			{
				displayName: 'Work Value',
				name: 'workValue',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['workSet'],
					},
				},
				default: '',
				placeholder: 'Work hex string',
				description: 'Pre-computed work value',
			},

			// ===== OPTIONS =====
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Raw Values',
						name: 'includeRaw',
						type: 'boolean',
						default: false,
						description: 'Whether to include raw (non-human-readable) values in response',
					},
					{
						displayName: 'Timeout (Ms)',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0);

		// Get credentials
		const credentials = await this.getCredentials('nanoApi');
		const rpcUrl = credentials.rpcUrl as string;
		const walletId = credentials.walletId as string;
		const defaultSourceAccount = credentials.sourceAccount;

		// Initialize RPC client
		const rpc = createNanoRPC(this, { rpcUrl });

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: NanoOperationResponse;

				switch (operation) {
					case 'send': {
						const destination = this.getNodeParameter('destination', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const sourceAccount = this.getNodeParameter(
							'sourceAccount',
							i,
							defaultSourceAccount,
						) as string;
						const sendId = this.getNodeParameter('sendId', i, '') as string;
						const sendWork = this.getNodeParameter('sendWork', i, '') as string;

						// Validate addresses
						if (!isValidNanoAddress(destination)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid destination address: ${destination}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(sourceAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid source address: ${sourceAccount}`,
								{ itemIndex: i },
							);
						}

						// Convert amount to raw
						const amountRaw = nanoToRaw(amount);

						// Send payment
						const blockHash = await rpc.send(
							walletId,
							sourceAccount,
							destination,
							amountRaw,
							sendId || undefined,
							sendWork || undefined
						);

						responseData = {
							success: true,
							blockHash,
							destination,
							amount,
							amountRaw,
							source: sourceAccount,
							id: sendId || undefined,
							timestamp: new Date().toISOString(),
						};
						break;
					}

					case 'balance': {
						const account = this.getNodeParameter('account', i) as string;
						const includeOnlyConfirmed = this.getNodeParameter('balanceIncludeOnlyConfirmed', i, true) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const balanceData = await rpc.getBalance(account, includeOnlyConfirmed);

						responseData = {
							account,
							balance: rawToNano(balanceData.balance),
							balanceRaw: balanceData.balance,
							pending: rawToNano(balanceData.pending),
							pendingRaw: balanceData.pending,
							receivable: rawToNano(balanceData.receivable),
							receivableRaw: balanceData.receivable,
							balanceFormatted: formatNanoAmount(balanceData.balance),
							pendingFormatted: formatNanoAmount(balanceData.pending),
						};
						break;
					}

					case 'accountInfo': {
						const account = this.getNodeParameter('account', i) as string;
						const includeRepresentative = this.getNodeParameter('accountInfoRepresentative', i, true) as boolean;
						const includeWeight = this.getNodeParameter('accountInfoWeight', i, true) as boolean;
						const includePending = this.getNodeParameter('accountInfoPending', i, true) as boolean;
						const includeConfirmed = this.getNodeParameter('accountInfoIncludeConfirmed', i, false) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const accountInfo = await rpc.getAccountInfo(account, {
							representative: includeRepresentative,
							weight: includeWeight,
							pending: includePending,
							receivable: includePending,
							includeConfirmed: includeConfirmed || undefined,
						});

						responseData = {
							frontier: accountInfo.frontier,
							openBlock: accountInfo.open_block,
							representativeBlock: accountInfo.representative_block,
							account,
							balance: rawToNano(accountInfo.balance),
							balanceRaw: accountInfo.balance,
							blockCount: accountInfo.block_count,
							// Optional fields (v9.0+)
							...(accountInfo.representative && { representative: accountInfo.representative }),
							...(accountInfo.weight && { weight: accountInfo.weight }),
							...(accountInfo.pending && {
								pending: rawToNano(accountInfo.pending),
								pendingRaw: accountInfo.pending,
							}),
							...(accountInfo.receivable && {
								receivable: rawToNano(accountInfo.receivable),
								receivableRaw: accountInfo.receivable,
							}),
							// Confirmed fields (v22.0+, only present if includeConfirmed is true)
							...(accountInfo.confirmed_balance && {
								confirmedBalance: rawToNano(accountInfo.confirmed_balance),
								confirmedBalanceRaw: accountInfo.confirmed_balance,
							}),
							...(accountInfo.confirmed_height && { confirmedHeight: accountInfo.confirmed_height }),
							...(accountInfo.confirmed_frontier && { confirmedFrontier: accountInfo.confirmed_frontier }),
							...(accountInfo.confirmed_representative && { confirmedRepresentative: accountInfo.confirmed_representative }),
							...(accountInfo.confirmed_receivable && {
								confirmedReceivable: rawToNano(accountInfo.confirmed_receivable),
								confirmedReceivableRaw: accountInfo.confirmed_receivable,
							}),
						};
						break;
					}

					case 'history': {
						const account = this.getNodeParameter('account', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const head = this.getNodeParameter('historyHead', i, '') as string;
						const offset = this.getNodeParameter('historyOffset', i, 0) as number;
						const reverse = this.getNodeParameter('historyReverse', i, false) as boolean;
						const accountFilterStr = this.getNodeParameter('historyAccountFilter', i, '') as string;
						const includeLinkedAccount = this.getNodeParameter('historyIncludeLinkedAccount', i, false) as boolean;
						const raw = this.getNodeParameter('historyRaw', i, true) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						// Parse account filter (comma-separated)
						const accountFilter = accountFilterStr
							? accountFilterStr.split(',').map((a) => a.trim()).filter((a) => a)
							: undefined;

						const historyOptions = {
							...(raw === false && { raw: false }),
							...(head && { head }),
							...(offset > 0 && { offset }),
							...(reverse && { reverse }),
							...(accountFilter && accountFilter.length > 0 && { accountFilter }),
							...(includeLinkedAccount && { includeLinkedAccount }),
						};

						const historyData = await rpc.getAccountHistory(
							account,
							count,
							Object.keys(historyOptions).length > 0 ? historyOptions : undefined,
						);

						// Format history - include all raw fields since we use raw: true
						const formattedHistory = historyData.history?.map((tx) => ({
							type: tx.type,
							subtype: tx.subtype,
							account: tx.account,
							amount: rawToNano(tx.amount),
							amountRaw: tx.amount,
							hash: tx.hash,
							height: tx.height,
							confirmed: tx.confirmed === 'true',
							localTimestamp: tx.local_timestamp ? new Date(parseInt(tx.local_timestamp) * 1000).toISOString() : undefined,
							// Raw block fields
							...(tx.previous && { previous: tx.previous }),
							...(tx.representative && { representative: tx.representative }),
							...(tx.balance && { balance: tx.balance }),
							...(tx.link && { link: tx.link }),
							...(tx.link_as_account && { linkAsAccount: tx.link_as_account }),
							...(tx.signature && { signature: tx.signature }),
							...(tx.work && { work: tx.work }),
							// Linked account (v28.0+)
							...(tx.linked_account && { linkedAccount: tx.linked_account }),
						})) || [];

						responseData = {
							account,
							history: formattedHistory,
							// previous is used for pagination in normal mode
							...(historyData.previous && { previous: historyData.previous }),
							// next is used for pagination in reverse mode
							...(historyData.next && { next: historyData.next }),
						};
						break;
					}

					case 'accountBlockCount': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const blockCount = await rpc.getAccountBlockCount(account);

						responseData = {
							account,
							blockCount,
						};
						break;
					}

					case 'accountKey': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const publicKey = await rpc.getAccountKey(account);

						responseData = {
							account,
							publicKey,
						};
						break;
					}

					case 'accountRepresentative': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const representative = await rpc.getAccountRepresentative(account);

						responseData = {
							account,
							representative,
						};
						break;
					}

					case 'accountWeight': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const weight = await rpc.getAccountWeight(account);

						responseData = {
							account,
							weight,
							weightFormatted: formatNanoAmount(weight),
						};
						break;
					}

					case 'receivable': {
						const account = this.getNodeParameter('account', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const threshold = this.getNodeParameter('threshold', i, '') as string;
						const source = this.getNodeParameter('receivableSource', i, true) as boolean;
						const includeActive = this.getNodeParameter('receivableIncludeActive', i, false) as boolean;
						const minVersion = this.getNodeParameter('receivableMinVersion', i, false) as boolean;
						const sorting = this.getNodeParameter('receivableSorting', i, false) as boolean;
						const includeOnlyConfirmed = this.getNodeParameter('receivableIncludeOnlyConfirmed', i, true) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const receivableOptions = {
							count,
							...(threshold && { threshold }),
							...(source && { source }),
							...(includeActive && { includeActive }),
							...(minVersion && { minVersion }),
							...(sorting && { sorting }),
							// Only include if false (true is default)
							...(!includeOnlyConfirmed && { includeOnlyConfirmed: false }),
						};

						const receivableData = await rpc.getReceivable(account, receivableOptions);

						responseData = {
							account,
							receivable: receivableData,
						};
						break;
					}

					case 'blockAccount': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;

						const account = await rpc.getBlockAccount(blockHash);

						responseData = {
							blockHash,
							account,
						};
						break;
					}

					case 'blockCount': {
						const blockCountData = await rpc.getBlockCount();

						responseData = {
							count: blockCountData.count,
							unchecked: blockCountData.unchecked,
							cemented: blockCountData.cemented,
						};
						break;
					}

					case 'processBlock': {
						const blockJson = this.getNodeParameter('blockJson', i) as BlockContents;
						const subtype = this.getNodeParameter('subtype', i, 'send') as BlockSubtype;
						const force = this.getNodeParameter('processForce', i, false) as boolean;
						const asyncProcess = this.getNodeParameter('processAsync', i, false) as boolean;

						const processOptions = {
							subtype,
							...(force && { force }),
							...(asyncProcess && { async: true }),
						};

						const result = await rpc.process(blockJson, processOptions);

						responseData = {
							success: true,
							...(result.hash && { hash: result.hash }),
							...(result.started && { started: result.started === '1' }),
							subtype,
							async: asyncProcess,
						};
						break;
					}

					case 'version': {
						const versionInfo = await rpc.getVersion();

						responseData = {
							...versionInfo,
						};
						break;
					}

					case 'representativesOnline': {
						const includeWeight = this.getNodeParameter('includeWeight', i, false) as boolean;
						const filterAccountsStr = this.getNodeParameter('filterAccounts', i, '') as string;
						const filterAccounts = filterAccountsStr
							? filterAccountsStr.split(',').map((a) => a.trim()).filter((a) => a.length > 0)
							: undefined;

						const repsOnline = await rpc.getRepresentativesOnline(includeWeight, filterAccounts);

						responseData = {
							representatives: repsOnline,
						};
						break;
					}

					case 'delegators': {
						const account = this.getNodeParameter('account', i) as string;
						const threshold = this.getNodeParameter('delegatorsThreshold', i, '') as string;
						const countParam = this.getNodeParameter('delegatorsCount', i, 0) as number;
						const start = this.getNodeParameter('delegatorsStart', i, '') as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const options: { threshold?: string; count?: number; start?: string } = {};
						if (threshold) options.threshold = threshold;
						if (countParam > 0) options.count = countParam;
						if (start) options.start = start;

						const delegators = await rpc.getDelegators(
							account,
							Object.keys(options).length > 0 ? options : undefined
						);

						responseData = {
							account,
							delegators,
							delegatorCount: Object.keys(delegators).length,
						};
						break;
					}

					case 'delegatorsCount': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const count = await rpc.getDelegatorsCount(account);

						responseData = {
							account,
							delegatorCount: count,
						};
						break;
					}

					case 'receive': {
						const receivingAccount = this.getNodeParameter('receivingAccount', i) as string;
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const work = this.getNodeParameter('receiveWork', i, '') as string;

						if (!isValidNanoAddress(receivingAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid receiving account address: ${receivingAccount}`,
								{ itemIndex: i },
							);
						}

						const receiveBlockHash = await rpc.receive(
							walletId,
							receivingAccount,
							blockHash,
							work || undefined,
						);

						responseData = {
							success: true,
							receivingAccount,
							receivedBlockHash: receiveBlockHash,
							originalBlockHash: blockHash,
							timestamp: new Date().toISOString(),
						};
						break;
					}

					case 'pending': {
						const account = this.getNodeParameter('account', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const pendingData = await rpc.getPending(account, count);

						// Format pending blocks
						const formattedPending: PendingBlock[] = Object.entries(pendingData.blocks || {}).map(
							([hash, data]) => ({
								hash,
								amount: rawToNano((data as { amount: string; source: string }).amount),
								amountRaw: (data as { amount: string; source: string }).amount,
								source: (data as { amount: string; source: string }).source,
							}),
						);

						responseData = {
							account,
							pendingCount: formattedPending.length,
							pendingBlocks: formattedPending,
						};
						break;
					}

					case 'validate': {
						const addressToValidate = this.getNodeParameter('addressToValidate', i) as string;

						const isValid = await rpc.validateAccount(addressToValidate);

						responseData = {
							address: addressToValidate,
							valid: isValid,
						};
						break;
					}

					case 'blockInfo': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const jsonBlock = this.getNodeParameter('jsonBlock', i, true) as boolean;
						const includeLinkedAccount = this.getNodeParameter('includeLinkedAccount', i, false) as boolean;

						const blockInfo = await rpc.getBlockInfo(blockHash, jsonBlock, includeLinkedAccount);

						responseData = {
							hash: blockHash,
							...blockInfo,
							amount: blockInfo.amount ? rawToNano(blockInfo.amount) : undefined,
							balance: blockInfo.balance ? rawToNano(blockInfo.balance) : undefined,
						};
						break;
					}

					case 'createAccount': {
						const accountIndex = this.getNodeParameter('accountIndex', i, -1) as number;
						const createAccountWork = this.getNodeParameter('createAccountWork', i, true) as boolean;

						const createOptions: { index?: number; work?: boolean } = {};
						if (accountIndex >= 0) {
							createOptions.index = accountIndex;
						}
						if (!createAccountWork) {
							createOptions.work = false;
						}

						const newAccount = await rpc.createAccount(walletId, createOptions);

						responseData = {
							success: true,
							account: newAccount,
							wallet: walletId,
							...(accountIndex >= 0 && { index: accountIndex }),
							workGenerated: createAccountWork,
							timestamp: new Date().toISOString(),
						};
						break;
					}

					case 'listAccounts': {
						const accounts = await rpc.listAccounts(walletId);

						responseData = {
							wallet: walletId,
							accountCount: accounts.length,
							accounts,
						};
						break;
					}

					case 'accountMove': {
						const sourceWallet = this.getNodeParameter('sourceWallet', i) as string;
						const accountsToMoveStr = this.getNodeParameter('accountsToMove', i) as string;
						const accountsToMove = accountsToMoveStr.split(',').map((a) => a.trim());

						const moved = await rpc.accountMove(walletId, sourceWallet, accountsToMove);

						responseData = {
							success: true,
							moved,
						};
						break;
					}

					case 'accountRemove': {
						const accountToRemove = this.getNodeParameter('accountToRemove', i) as string;

						if (!isValidNanoAddress(accountToRemove)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${accountToRemove}`,
								{ itemIndex: i },
							);
						}

						const removed = await rpc.accountRemove(walletId, accountToRemove);

						responseData = {
							success: true,
							removed,
						};
						break;
					}

					case 'accountRepresentativeSet': {
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;
						const representativeAddress = this.getNodeParameter(
							'representativeAddress',
							i,
						) as string;

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(representativeAddress)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid representative address: ${representativeAddress}`,
								{ itemIndex: i },
							);
						}

						const accountRepSetWork = this.getNodeParameter('accountRepSetWork', i, '') as string;

						const block = await rpc.accountRepresentativeSet(
							walletId,
							walletAccount,
							representativeAddress,
							accountRepSetWork ? { work: accountRepSetWork } : undefined,
						);

						responseData = {
							success: true,
							block,
						};
						break;
					}

					case 'accountsCreate': {
						const accountCount = this.getNodeParameter('accountCount', i) as number;
						const accountsCreateWork = this.getNodeParameter('accountsCreateWork', i, false) as boolean;

						const accounts = await rpc.accountsCreate(walletId, accountCount, { work: accountsCreateWork });

						responseData = {
							success: true,
							accounts,
						};
						break;
					}

					case 'passwordChange': {
						const walletPassword = this.getNodeParameter('walletPassword', i) as string;

						const changed = await rpc.passwordChange(walletId, walletPassword);

						responseData = {
							success: true,
							changed,
						};
						break;
					}

					case 'passwordEnter': {
						const walletPassword = this.getNodeParameter('walletPassword', i) as string;

						const valid = await rpc.passwordEnter(walletId, walletPassword);

						responseData = {
							success: true,
							valid,
						};
						break;
					}

					case 'passwordValid': {
						const valid = await rpc.passwordValid(walletId);

						responseData = {
							valid,
						};
						break;
					}

					case 'receiveMinimum': {
						const amount = await rpc.receiveMinimum();

						responseData = {
							amount,
							amountFormatted: formatNanoAmount(amount),
						};
						break;
					}

					case 'receiveMinimumSet': {
						const minimumAmount = this.getNodeParameter('minimumAmount', i) as string;

						const success = await rpc.receiveMinimumSet(minimumAmount);

						responseData = {
							success,
						};
						break;
					}

					case 'searchPending': {
						const searchWallet = this.getNodeParameter('searchWallet', i) as string;

						const started = await rpc.searchPending(searchWallet);

						responseData = {
							success: true,
							started,
						};
						break;
					}

					case 'searchReceivable': {
						const searchWallet = this.getNodeParameter('searchWallet', i) as string;

						const started = await rpc.searchReceivable(searchWallet);

						responseData = {
							success: true,
							started,
						};
						break;
					}

					case 'searchPendingAll': {
						const success = await rpc.searchPendingAll();

						responseData = {
							success,
						};
						break;
					}

					case 'searchReceivableAll': {
						const success = await rpc.searchReceivableAll();

						responseData = {
							success,
						};
						break;
					}

					case 'walletAdd': {
						const walletPrivateKey = this.getNodeParameter('walletPrivateKey', i) as string;
						const walletAddDisableWork = this.getNodeParameter('walletAddDisableWork', i, false) as boolean;

						const account = await rpc.walletAdd(
							walletId,
							walletPrivateKey,
							walletAddDisableWork ? { work: false } : undefined,
						);

						responseData = {
							success: true,
							account,
						};
						break;
					}

					case 'walletAddWatch': {
						const watchAccountsStr = this.getNodeParameter('watchAccounts', i) as string;
						const watchAccounts = watchAccountsStr.split(',').map((a) => a.trim());

						for (const account of watchAccounts) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const success = await rpc.walletAddWatch(walletId, watchAccounts);

						responseData = {
							success,
						};
						break;
					}

					case 'walletBalances': {
						const balanceThreshold = this.getNodeParameter('balanceThreshold', i, '') as string;

						const balances = await rpc.walletBalances(walletId, balanceThreshold || undefined);

						responseData = {
							wallet: walletId,
							balances,
						};
						break;
					}

					case 'walletChangeSeed': {
						const newSeed = this.getNodeParameter('newSeed', i) as string;
						const restoreCount = this.getNodeParameter('restoreCount', i, 0) as number;

						const result = await rpc.walletChangeSeed(walletId, newSeed, restoreCount || undefined);

						responseData = {
							success: result.success,
							lastRestoredAccount: result.last_restored_account,
							restoredCount: result.restored_count,
						};
						break;
					}

					case 'walletContains': {
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}

						const exists = await rpc.walletContains(walletId, walletAccount);

						responseData = {
							wallet: walletId,
							account: walletAccount,
							exists,
						};
						break;
					}

					case 'walletCreate': {
						const initialSeed = this.getNodeParameter('initialSeed', i, '') as string;

						const result = await rpc.walletCreate(initialSeed || undefined);

						responseData = {
							success: true,
							wallet: result.wallet,
							lastRestoredAccount: result.last_restored_account,
							restoredCount: result.restored_count,
						};
						break;
					}

					case 'walletDestroy': {
						const walletToDestroy = this.getNodeParameter('walletToDestroy', i) as string;

						const destroyed = await rpc.walletDestroy(walletToDestroy);

						responseData = {
							success: true,
							destroyed,
						};
						break;
					}

					case 'walletExport': {
						const json = await rpc.walletExport(walletId);

						responseData = {
							wallet: walletId,
							json,
						};
						break;
					}

					case 'walletFrontiers': {
						const frontiers = await rpc.walletFrontiers(walletId);

						responseData = {
							wallet: walletId,
							frontiers,
						};
						break;
					}

					case 'walletHistory': {
						const modifiedSince = this.getNodeParameter('modifiedSince', i, 0) as number;

						const history = await rpc.walletHistory(walletId, modifiedSince || undefined);

						responseData = {
							wallet: walletId,
							history,
						};
						break;
					}

					case 'walletInfo': {
						const info = await rpc.walletInfo(walletId);

						responseData = {
							wallet: walletId,
							...info,
						};
						break;
					}

					case 'walletLedger': {
						const includeRepresentative = this.getNodeParameter(
							'includeRepresentative',
							i,
							false,
						) as boolean;
						const includeWeight = this.getNodeParameter('includeWeight', i, false) as boolean;
						const includeReceivable = this.getNodeParameter('includeReceivable', i, false) as boolean;
						const modifiedSince = this.getNodeParameter('modifiedSince', i, 0) as number;

						const accounts = await rpc.walletLedger(walletId, {
							representative: includeRepresentative || undefined,
							weight: includeWeight || undefined,
							receivable: includeReceivable || undefined,
							modifiedSince: modifiedSince || undefined,
						});

						responseData = {
							wallet: walletId,
							accounts,
						};
						break;
					}

					case 'walletLock': {
						const locked = await rpc.walletLock(walletId);

						responseData = {
							success: true,
							locked,
						};
						break;
					}

					case 'walletLocked': {
						const locked = await rpc.walletLocked(walletId);

						responseData = {
							wallet: walletId,
							locked,
						};
						break;
					}

					case 'walletReceivable': {
						const count = this.getNodeParameter('count', i, 10) as number;
						const balanceThreshold = this.getNodeParameter('balanceThreshold', i, '') as string;
						const includeSource = this.getNodeParameter('includeSource', i, true) as boolean;
						const includeActive = this.getNodeParameter('walletReceivableIncludeActive', i, false) as boolean;
						const includeOnlyConfirmed = this.getNodeParameter('walletReceivableIncludeOnlyConfirmed', i, true) as boolean;

						const blocks = await rpc.walletReceivable(walletId, {
							count,
							threshold: balanceThreshold || undefined,
							source: includeSource,
							includeActive,
							includeOnlyConfirmed,
						});

						responseData = {
							wallet: walletId,
							blocks,
						};
						break;
					}

					case 'walletRepresentative': {
						const representative = await rpc.walletRepresentative(walletId);

						responseData = {
							wallet: walletId,
							representative,
						};
						break;
					}

					case 'walletRepresentativeSet': {
						const representativeAddress = this.getNodeParameter(
							'representativeAddress',
							i,
						) as string;
						const updateExisting = this.getNodeParameter('updateExisting', i, true) as boolean;

						if (!isValidNanoAddress(representativeAddress)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid representative address: ${representativeAddress}`,
								{ itemIndex: i },
							);
						}

						const set = await rpc.walletRepresentativeSet(
							walletId,
							representativeAddress,
							updateExisting,
						);

						responseData = {
							success: true,
							set,
						};
						break;
					}

					case 'walletRepublish': {
						const republishCount = this.getNodeParameter('republishCount', i, 1) as number;

						const blocks = await rpc.walletRepublish(walletId, republishCount);

						responseData = {
							success: true,
							blocks,
						};
						break;
					}

					case 'walletWorkGet': {
						const works = await rpc.walletWorkGet(walletId);

						responseData = {
							wallet: walletId,
							works,
						};
						break;
					}

					case 'workGet': {
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}

						const work = await rpc.workGet(walletId, walletAccount);

						responseData = {
							wallet: walletId,
							account: walletAccount,
							work,
						};
						break;
					}

					case 'workSet': {
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;
						const workValue = this.getNodeParameter('workValue', i) as string;

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}

						const success = await rpc.workSet(walletId, walletAccount, workValue);

						responseData = {
							success,
						};
						break;
					}

					case 'confirmBlock': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;

						const confirmationHash = await rpc.confirmBlock(blockHash);

						responseData = {
							success: true,
							hash: confirmationHash,
						};
						break;
					}

					case 'getBlocks': {
						const blockHashesStr = this.getNodeParameter('blockHashes', i) as string;
						const blockHashes = blockHashesStr.split(',').map((h) => h.trim());

						const blocks = await rpc.getBlocks(blockHashes);

						responseData = {
							blocks,
						};
						break;
					}

					case 'getBlocksInfo': {
						const blockHashesStr = this.getNodeParameter('blockHashes', i) as string;
						const blockHashes = blockHashesStr.split(',').map((h) => h.trim());
						const includeNotFound = this.getNodeParameter('blocksInfoIncludeNotFound', i, false) as boolean;
						const includePending = this.getNodeParameter('blocksInfoPending', i, false) as boolean;
						const includeSource = this.getNodeParameter('blocksInfoSource', i, false) as boolean;
						const includeReceiveHash = this.getNodeParameter('blocksInfoReceiveHash', i, false) as boolean;
						const includeLinkedAccount = this.getNodeParameter('blocksInfoIncludeLinkedAccount', i, false) as boolean;

						const blocksInfoOptions = {
							...(includeNotFound && { includeNotFound }),
							...(includePending && { pending: true }),
							...(includeSource && { source: true }),
							...(includeReceiveHash && { receiveHash: true }),
							...(includeLinkedAccount && { includeLinkedAccount }),
						};

						const blocksInfoResult = await rpc.getBlocksInfo(
							blockHashes,
							Object.keys(blocksInfoOptions).length > 0 ? blocksInfoOptions : undefined,
						);

						responseData = {
							blocks: blocksInfoResult.blocks,
							...(blocksInfoResult.blocks_not_found && { blocksNotFound: blocksInfoResult.blocks_not_found }),
						};
						break;
					}

					case 'receivableExists': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const includeActive = this.getNodeParameter('receiveExistsIncludeActive', i, false) as boolean;
						const includeOnlyConfirmed = this.getNodeParameter('receiveExistsIncludeOnlyConfirmed', i, true) as boolean;

						const options: ReceivableExistsOptions = {};
						if (includeActive) options.includeActive = true;
						if (!includeOnlyConfirmed) options.includeOnlyConfirmed = false;

						const exists = await rpc.receivableExists(blockHash, Object.keys(options).length > 0 ? options : undefined);

						responseData = {
							hash: blockHash,
							exists,
						};
						break;
					}

					case 'getChain': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const offset = this.getNodeParameter('chainOffset', i, 0) as number;
						const reverse = this.getNodeParameter('chainReverse', i, false) as boolean;

						const options: { offset?: number; reverse?: boolean } = {};
						if (offset > 0) options.offset = offset;
						if (reverse) options.reverse = true;

						const chain = await rpc.getChain(blockHash, count, Object.keys(options).length > 0 ? options : undefined);

						responseData = {
							startingBlock: blockHash,
							chain,
						};
						break;
					}

					case 'getLedger': {
						const startingAccount = this.getNodeParameter('startingAccount', i) as string;
						const count = this.getNodeParameter('ledgerCount', i, 10) as number;
						const representative = this.getNodeParameter('ledgerRepresentative', i, false) as boolean;
						const weight = this.getNodeParameter('ledgerWeight', i, false) as boolean;
						const receivable = this.getNodeParameter('ledgerReceivable', i, false) as boolean;
						const modifiedSince = this.getNodeParameter('ledgerModifiedSince', i, 0) as number;
						const sorting = this.getNodeParameter('ledgerSorting', i, false) as boolean;
						const threshold = this.getNodeParameter('ledgerThreshold', i, '') as string;

						if (!isValidNanoAddress(startingAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${startingAccount}`,
								{ itemIndex: i },
							);
						}

						const ledger = await rpc.getLedger(startingAccount, {
							count,
							representative,
							weight,
							receivable,
							modifiedSince,
							sorting,
							threshold: threshold || undefined,
						});

						responseData = {
							startingAccount,
							accounts: ledger,
						};
						break;
					}

					case 'getFrontiers': {
						const startingAccount = this.getNodeParameter('startingAccount', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						if (!isValidNanoAddress(startingAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${startingAccount}`,
								{ itemIndex: i },
							);
						}

						const frontiers = await rpc.getFrontiers(startingAccount, count);

						responseData = {
							startingAccount,
							frontiers,
						};
						break;
					}

					case 'getConfirmationInfo': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const includeRepresentatives = this.getNodeParameter('includeRepresentatives', i, false) as boolean;
						const includeContents = this.getNodeParameter('includeContents', i, true) as boolean;
						const jsonBlock = this.getNodeParameter('confirmationJsonBlock', i, true) as boolean;

						const confirmationInfo = await rpc.getConfirmationInfo(blockHash, {
							representatives: includeRepresentatives,
							contents: includeContents,
							json_block: jsonBlock,
						});

						responseData = {
							hash: blockHash,
							...confirmationInfo,
						};
						break;
					}

					case 'generateWork': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const difficulty = this.getNodeParameter('difficulty', i, '') as string;
						const multiplier = this.getNodeParameter('workMultiplier', i, 0) as number;
						const usePeers = this.getNodeParameter('usePeers', i, false) as boolean;
						const workAccount = this.getNodeParameter('workAccount', i, '') as string;
						const workVersion = this.getNodeParameter('workVersion', i, '') as string;
						const workBlockJson = this.getNodeParameter('workBlock', i, '') as string;

						// Build options object
						const options: Record<string, unknown> = {};
						if (difficulty) {
							options.difficulty = difficulty;
						}
						if (multiplier && multiplier > 0) {
							options.multiplier = multiplier;
						}
						if (usePeers) {
							options.usePeers = true;
							if (workAccount) {
								options.account = workAccount;
							}
						}
						if (workVersion) {
							options.version = workVersion;
						}
						if (workBlockJson) {
							try {
								options.block = typeof workBlockJson === 'string'
									? JSON.parse(workBlockJson)
									: workBlockJson;
							} catch {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in Block field', {
									itemIndex: i,
								});
							}
						}

						const workResult = await rpc.generateWork(blockHash, options);

						responseData = {
							hash: workResult.hash,
							work: workResult.work,
							difficulty: workResult.difficulty,
							multiplier: workResult.multiplier,
						};
						break;
					}

					case 'validateWork': {
						const work = this.getNodeParameter('work', i) as string;
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const difficulty = this.getNodeParameter('difficulty', i, '') as string;
						const multiplier = this.getNodeParameter('workMultiplier', i, 0) as number;
						const version = this.getNodeParameter('workVersion', i, '') as string;

						const validationResult = await rpc.validateWork(work, blockHash, {
							difficulty: difficulty || undefined,
							multiplier: multiplier > 0 ? multiplier : undefined,
							version: version || undefined,
						});

						responseData = {
							work,
							hash: blockHash,
							valid: validationResult.valid,
							validAll: validationResult.validAll,
							validReceive: validationResult.validReceive,
							difficulty: validationResult.difficulty,
							multiplier: validationResult.multiplier,
						};
						break;
					}

					case 'createKey': {
						const keyPair = await rpc.createKey();

						responseData = {
							success: true,
							...keyPair,
						};
						break;
					}

					case 'sign': {
						const signMethod = this.getNodeParameter('signMethod', i, 'key') as string;
						const signInput = this.getNodeParameter('signInput', i, 'block') as string;

						// Build sign options
						const signOptions: Record<string, unknown> = {};

						// Set signing credentials
						if (signMethod === 'key') {
							const signPrivateKey = this.getNodeParameter('signPrivateKey', i) as string;
							signOptions.key = signPrivateKey;
						} else {
							// wallet method
							signOptions.wallet = walletId;
							const signAccount = this.getNodeParameter('signAccount', i) as string;
							signOptions.account = signAccount;
						}

						// Set what to sign
						if (signInput === 'block') {
							const signBlockJson = this.getNodeParameter('signBlock', i) as string;
							try {
								signOptions.block = typeof signBlockJson === 'string'
									? JSON.parse(signBlockJson)
									: signBlockJson;
							} catch {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in Block to Sign field', {
									itemIndex: i,
								});
							}
						} else {
							// hash input
							const hashToSign = this.getNodeParameter('hashToSign', i) as string;
							signOptions.hash = hashToSign;
						}

						const signResult = await rpc.signBlock(signOptions);

						responseData = {
							signature: signResult.signature,
							...(signResult.block && { block: signResult.block }),
						};
						break;
					}

					case 'expandKey': {
						const privateKey = this.getNodeParameter('privateKey', i) as string;

						const expanded = await rpc.expandKey(privateKey);

						responseData = {
							privateKey,
							...expanded,
						};
						break;
					}

					case 'getDeterministicKey': {
						const seed = this.getNodeParameter('seed', i) as string;
						const index = this.getNodeParameter('index', i) as number;

						const keyPair = await rpc.getDeterministicKey(seed, index);

						responseData = {
							seed,
							index,
							...keyPair,
						};
						break;
					}

					case 'getAccountsBalances': {
						const accountsStr = this.getNodeParameter('accounts', i) as string;
						const accounts = accountsStr.split(',').map((a) => a.trim());
						const includeOnlyConfirmed = this.getNodeParameter('accountsBalancesIncludeOnlyConfirmed', i, true) as boolean;

						// Validate all accounts
						for (const account of accounts) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const balances = await rpc.getAccountsBalances(accounts, {
							includeOnlyConfirmed,
						});

						responseData = {
							balances,
						};
						break;
					}

					case 'getAccountFromPublicKey': {
						const publicKey = this.getNodeParameter('publicKey', i) as string;

						const account = await rpc.getAccountFromPublicKey(publicKey);

						responseData = {
							publicKey,
							account,
						};
						break;
					}

					case 'getAvailableSupply': {
						const supply = await rpc.getAvailableSupply();

						responseData = {
							availableSupply: rawToNano(supply),
							availableSupplyRaw: supply,
						};
						break;
					}

					case 'getPeers': {
								const peerDetails = this.getNodeParameter('peerDetails', i, false) as boolean;

								const peers = await rpc.getPeers(peerDetails ? { peer_details: true } : undefined);
						responseData = {
							peers,
						};
						break;
					}

					case 'getRepresentatives': {
						const sorting = this.getNodeParameter('sorting', i, false) as boolean;
						const countParam = this.getNodeParameter('count', i, 0) as number;
						const count = countParam > 0 ? countParam : undefined;

						const representatives = await rpc.getRepresentatives(count, sorting);

						responseData = {
							representatives,
						};
						break;
					}

					case 'getUptime': {
						const uptime = await rpc.getUptime();

						responseData = {
							seconds:
								typeof uptime === 'object' ? (uptime as { seconds: number }).seconds : uptime,
						};
						break;
					}

					case 'getTelemetry': {
						const raw = this.getNodeParameter('telemetryRaw', i, false) as boolean;
						const address = this.getNodeParameter('telemetryAddress', i, '') as string;
						const port = this.getNodeParameter('telemetryPort', i, 7075) as number;

						const telemetry = await rpc.getTelemetry({
							raw,
							address: address || undefined,
							port: address ? port : undefined,
						});

						responseData = {
							...telemetry,
						};
						break;
					}

					case 'getStats': {
						const statsType = this.getNodeParameter('statsType', i) as string;

						const stats = await rpc.getStats(statsType);

						responseData = {
							statsType,
							...stats,
						};
						break;
					}

					case 'getUnchecked': {
						const count = this.getNodeParameter('count', i, 10) as number;

						const unchecked = await rpc.getUnchecked(count);

						responseData = {
							count,
							blocks: unchecked,
						};
						break;
					}

					case 'bootstrap': {
						const bootstrapAddress = this.getNodeParameter('bootstrapAddress', i) as string;
						const bootstrapPort = this.getNodeParameter('bootstrapPort', i) as number;
						const bypassFrontierConfirmation = this.getNodeParameter(
							'bootstrapBypassFrontierConfirmation',
							i,
							false,
						) as boolean;
						const bootstrapId = this.getNodeParameter('bootstrapId', i, '') as string;

						await rpc.bootstrap(bootstrapAddress, bootstrapPort, {
							bypassFrontierConfirmation: bypassFrontierConfirmation || undefined,
							id: bootstrapId || undefined,
						});

						responseData = {
							success: true,
							address: bootstrapAddress,
							port: bootstrapPort,
						};
						break;
					}

					case 'stopNode': {
						await rpc.stopNode();

						responseData = {
							success: true,
						};
						break;
					}

					case 'getAccountsFrontiers': {
						const accountsListStr = this.getNodeParameter('accountsList', i) as string;
						const accountsList = accountsListStr.split(',').map((a) => a.trim());

						for (const account of accountsList) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const frontiers = await rpc.getAccountsFrontiers(accountsList);

						responseData = {
							accounts: accountsList,
							frontiers,
						};
						break;
					}

					case 'getAccountsReceivable': {
						const accountsListStr = this.getNodeParameter('accountsList', i) as string;
						const accountsList = accountsListStr.split(',').map((a) => a.trim());
						const count = this.getNodeParameter('accountsReceivableCount', i, 10) as number;
						const threshold = this.getNodeParameter('accountsReceivableThreshold', i, '') as string;
						const source = this.getNodeParameter('accountsReceivableSource', i, false) as boolean;
						const sorting = this.getNodeParameter('accountsReceivableSorting', i, false) as boolean;
						const offset = this.getNodeParameter('accountsReceivableOffset', i, 0) as number;

						for (const account of accountsList) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const receivable = await rpc.getAccountsReceivable(accountsList, {
							count,
							threshold: threshold || undefined,
							source,
							sorting,
							offset,
						});

						responseData = {
							accounts: accountsList,
							receivable,
						};
						break;
					}

					case 'getAccountsRepresentatives': {
						const accountsListStr = this.getNodeParameter('accountsList', i) as string;
						const accountsList = accountsListStr.split(',').map((a) => a.trim());

						for (const account of accountsList) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const representatives = await rpc.getAccountsRepresentatives(accountsList);

						responseData = {
							accounts: accountsList,
							representatives,
						};
						break;
					}

					case 'createBlock': {
						const blockType = this.getNodeParameter('blockType', i) as 'state' | 'send' | 'receive' | 'change';
						const blockParamsStr = this.getNodeParameter('blockParams', i) as Record<string, string>;

						// let blockParams;
						// try {
						//   blockParams = JSON.parse(blockParamsStr);
						// } catch {
						//   throw new NodeOperationError(
						//     this.getNode(),
						//     'Invalid block parameters JSON',
						//     { itemIndex: i }
						//   );
						// }

						const block = await rpc.createBlock({ type: blockType, ...blockParamsStr });

						responseData = {
							success: true,
							blockType,
							block,
						};
						break;
					}

					case 'getBlockHash': {
						const blockParamsStr = this.getNodeParameter('blockParams', i) as string;

						let blockParams;
						try {
							blockParams = JSON.parse(blockParamsStr);
						} catch {
							throw new NodeOperationError(this.getNode(), 'Invalid block parameters JSON', {
								itemIndex: i,
							});
						}

						const hash = await rpc.getBlockHash(blockParams);

						responseData = {
							hash,
							block: blockParams,
						};
						break;
					}

					case 'epochUpgrade': {
						const epoch = this.getNodeParameter('epoch', i) as number;
						const epochKey = this.getNodeParameter('epochKey', i) as string;
						const count = this.getNodeParameter('count', i, 1) as number;

						const result = await rpc.epochUpgrade(epoch, epochKey, count);

						responseData = {
							success: true,
							epoch,
							count,
							result,
						};
						break;
					}

					case 'keepalive': {
						const peerAddress = this.getNodeParameter('peerAddress', i) as string;
						const peerPort = this.getNodeParameter('peerPort', i) as number;

						await rpc.keepalive(peerAddress, peerPort);

						responseData = {
							success: true,
							address: peerAddress,
							port: peerPort,
						};
						break;
					}

					case 'getNodeId': {
						const nodeId = await rpc.getNodeId();

						responseData = {
							nodeId,
						};
						break;
					}

					case 'populateBacklog': {
						await rpc.populateBacklog();

						responseData = {
							success: true,
						};
						break;
					}

					case 'republish': {
						const republishHash = this.getNodeParameter('republishHash', i) as string;
						const count = this.getNodeParameter('count', i, 1) as number;
						const sources = this.getNodeParameter('sources', i, 2) as number;
						const destinations = this.getNodeParameter('destinations', i, 2) as number;

						const result = await rpc.republish(republishHash, count, sources, destinations);

						responseData = {
							success: true,
							hash: republishHash,
							count,
							sources,
							destinations,
							result,
						};
						break;
					}

					case 'getFrontierCount': {
						const frontierCount = await rpc.getFrontierCount();

						responseData = {
							count: frontierCount,
						};
						break;
					}

					case 'getSuccessors': {
						const startingBlock = this.getNodeParameter('startingBlock', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const offset = this.getNodeParameter('chainOffset', i, 0) as number;
						const reverse = this.getNodeParameter('chainReverse', i, false) as boolean;

						const options: { offset?: number; reverse?: boolean } = {};
						if (offset > 0) options.offset = offset;
						if (reverse) options.reverse = true;

						const successors = await rpc.getSuccessors(startingBlock, count, Object.keys(options).length > 0 ? options : undefined);

						responseData = {
							startingBlock,
							successors,
						};
						break;
					}

					case 'getUnopened': {
						const unopenedAccount = this.getNodeParameter('unopenedAccount', i, '') as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						if (unopenedAccount && !isValidNanoAddress(unopenedAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${unopenedAccount}`,
								{ itemIndex: i },
							);
						}

						const unopened = await rpc.getUnopened(unopenedAccount || undefined, count);

						responseData = {
							accounts: unopened,
						};
						break;
					}

					case 'getConfirmationActive': {
							const announcements = this.getNodeParameter('announcements', i, 0) as number;

							const active = await rpc.getConfirmationActive(
								announcements > 0 ? { announcements } : undefined
							);
						responseData = {
							confirmations: active,
						};
						break;
					}

					case 'getConfirmationHistory': {
						const confirmationHash = this.getNodeParameter('confirmationHash', i, '') as string;

						const history = await rpc.getConfirmationHistory(confirmationHash || undefined);

						responseData = {
							history,
						};
						break;
					}

					case 'getConfirmationQuorum': {
							const peerDetails = this.getNodeParameter('peerDetails', i, false) as boolean;

							const quorum = await rpc.getConfirmationQuorum(
								peerDetails ? { peer_details: true } : undefined
							);
						responseData = {
							quorum,
						};
						break;
					}

					case 'getElectionStatistics': {
						const stats = await rpc.getElectionStatistics();

						responseData = {
							statistics: stats,
						};
						break;
					}

					case 'cancelWork': {
						const workHash = this.getNodeParameter('workHash', i) as string;

						await rpc.cancelWork(workHash);

						responseData = {
							success: true,
							hash: workHash,
						};
						break;
					}

					case 'addWorkPeer': {
						const peerAddress = this.getNodeParameter('peerAddress', i) as string;
						const peerPort = this.getNodeParameter('peerPort', i) as number;

						await rpc.addWorkPeer(peerAddress, peerPort);

						responseData = {
							success: true,
							address: peerAddress,
							port: peerPort,
						};
						break;
					}

					case 'getWorkPeers': {
						const peers = await rpc.getWorkPeers();

						responseData = {
							workPeers: peers,
						};
						break;
					}

					case 'clearWorkPeers': {
						await rpc.clearWorkPeers();

						responseData = {
							success: true,
						};
						break;
					}

					case 'bootstrapAny': {
						const force = this.getNodeParameter('bootstrapAnyForce', i, false) as boolean;
						const bootstrapId = this.getNodeParameter('bootstrapId', i, '') as string;
						const account = this.getNodeParameter('bootstrapAnyAccount', i, '') as string;

						await rpc.bootstrapAny({
							force: force || undefined,
							id: bootstrapId || undefined,
							account: account || undefined,
						});

						responseData = {
							success: true,
						};
						break;
					}

					case 'bootstrapLazy': {
						const lazyHash = this.getNodeParameter('lazyHash', i) as string;
						const force = this.getNodeParameter('force', i, false) as boolean;
						const bootstrapId = this.getNodeParameter('bootstrapId', i, '') as string;

						await rpc.bootstrapLazy(lazyHash, {
							force: force || undefined,
							id: bootstrapId || undefined,
						});

						responseData = {
							success: true,
							hash: lazyHash,
							force,
						};
						break;
					}

					case 'getBootstrapPriorities': {
						const priorities = await rpc.getBootstrapPriorities();

						responseData = {
							priorities,
						};
						break;
					}

					case 'resetBootstrap': {
						await rpc.resetBootstrap();

						responseData = {
							success: true,
						};
						break;
					}

					case 'getBootstrapStatus': {
						const status = await rpc.getBootstrapStatus();

						responseData = {
							status,
						};
						break;
					}

					case 'getDatabaseTxnTracker': {
						const minReadTime = this.getNodeParameter('dbTxnMinReadTime', i, 1000) as number;
						const minWriteTime = this.getNodeParameter('dbTxnMinWriteTime', i, 0) as number;

						const tracker = await rpc.getDatabaseTxnTracker({
							minReadTime,
							minWriteTime,
						});

						responseData = {
							tracker,
						};
						break;
					}

					case 'clearStats': {
						await rpc.clearStats();

						responseData = {
							success: true,
						};
						break;
					}

					case 'clearUnchecked': {
						await rpc.clearUnchecked();

						responseData = {
							success: true,
						};
						break;
					}

					case 'getUncheckedBlock': {
						const uncheckedHash = this.getNodeParameter('uncheckedHash', i) as string;

						const block = await rpc.getUncheckedBlock(uncheckedHash);

						responseData = {
							hash: uncheckedHash,
							block,
						};
						break;
					}

					case 'getUncheckedKeys': {
						const uncheckedKey = this.getNodeParameter('uncheckedKey', i, '') as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						const keys = await rpc.getUncheckedKeys(uncheckedKey || undefined, count);

						responseData = {
							keys,
						};
						break;
					}

					case 'nanoToRawRPC': {
						const convertAmount = this.getNodeParameter('convertAmount', i) as string;

						const raw = await rpc.nanoToRaw(convertAmount);

						responseData = {
							nano: convertAmount,
							raw,
						};
						break;
					}

					case 'rawToNanoRPC': {
						const convertAmount = this.getNodeParameter('convertAmount', i) as string;

						const nano = await rpc.rawToNano(convertAmount);

						responseData = {
							raw: convertAmount,
							nano,
						};
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
							itemIndex: i,
						});
				}

				// Add the response data to return array
				returnData.push({
					json: responseData as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							operation,
							itemIndex: i,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
