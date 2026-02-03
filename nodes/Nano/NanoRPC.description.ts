import type { INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export const NanoRPCDescription: INodeTypeDescription = {
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
                        'Get the total number of blocks (transactions) that have been confirmed for a specific Nano account. Requires account address. Returns the block count as a number',
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
                        'Retrieve the public key (64 character hex string) associated with a Nano account address. Requires account address. Returns the public key used for cryptographic operations',
                    action: 'Get account public key',
                },
                {
                    name: 'Get Account Representative',
                    value: 'accountRepresentative',
                    description:
                        'Get the current voting representative (delegate) for a Nano account. Requires account address. Returns representative account address',
                    action: 'Get account representative',
                },
                {
                    name: 'Get Account Weight',
                    value: 'accountWeight',
                    description:
                        'Get the total voting weight delegated to a representative account in raw units. Requires account address. Returns voting weight',
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

        // ===== ENABLE_CONTROL WARNING NOTICE =====
        // These operations require `enable_control = true` in node config
        {
            displayName:
                'This operation requires <code>enable_control = true</code> in your Nano node configuration. Without it, the RPC call will be rejected.',
            name: 'enableControlNotice',
            type: 'notice',
            default: '',
            displayOptions: {
                show: {
                    operation: [
                        // Transaction operations
                        'send',
                        'receive',
                        'processBlock',
                        'epochUpgrade',
                        // Block operations
                        'createBlock',
                        // Wallet operations
                        'createAccount',
                        'accountsCreate',
                        'accountMove',
                        'accountRemove',
                        'accountRepresentativeSet',
                        'passwordChange',
                        'receiveMinimum',
                        'receiveMinimumSet',
                        'searchReceivable',
                        'searchReceivableAll',
                        'walletAdd',
                        'walletAddWatch',
                        'walletChangeSeed',
                        'walletCreate',
                        'walletDestroy',
                        'walletLedger',
                        'walletLock',
                        'walletReceivable',
                        'walletRepresentativeSet',
                        'walletRepublish',
                        'walletWorkGet',
                        'workGet',
                        'workSet',
                        // Network operations
                        'keepalive',
                        'populateBacklog',
                        // Ledger operations
                        'getLedger',
                        'getUnopened',
                        // Work operations
                        'generateWork',
                        'cancelWork',
                        'addWorkPeer',
                        'getWorkPeers',
                        'clearWorkPeers',
                        // Keys operations
                        'getNodeId',
                        // Administration/Debug operations
                        'stopNode',
                        'bootstrap',
                        'bootstrapAny',
                        'bootstrapLazy',
                        'resetBootstrap',
                        'getBootstrapPriorities',
                        'clearStats',
                        'clearUnchecked',
                        'getDatabaseTxnTracker',
                    ],
                },
            },
        },

        // ===== SEND OPERATION =====
        {
            displayName: 'Wallet ID (Manual)',
            name: 'manualWalletId',
            type: 'string',
            displayOptions: {
                show: {
                    operation: ['send'],
                },
            },
            default: '',
            placeholder: 'Wallet ID',
            description: 'Manually specify the wallet ID to send fund from (optional), default to credential wallet ',
        },
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
            displayName: 'Wallet ID (Manual)',
            name: 'manualWalletId',
            type: 'string',
            displayOptions: {
                show: {
                    operation: ['receive'],
                },
            },
            default: '',
            placeholder: 'Wallet ID',
            description: 'Manually specify the wallet ID to receive funds to (optional), default to credential wallet ',
        },
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
            description: 'Work value (16 hexadecimal digits string, 64 bit). Uses work value for block from external source.',
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
            description: 'Provide a block for automatic difficulty calculation (v21.0+). Leave empty to use the hash and difficulty/multiplier instead.',
        },

        // ===== KEY OPERATIONS =====
        {
            displayName: 'Wallet ID (Manual)',
            name: 'manualWalletId',
            type: 'string',
            displayOptions: {
                show: {
                    operation: ['sign'],
                },
            },
            default: '',
            placeholder: 'Wallet ID',
            description: 'Manually specify the wallet ID you sign from (optional), default to credential wallet ',
        },
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
            description: "Final balance for account after block creation, formatted in 'raw' units using a decimal integer. If balance is less than previous, block is considered as send subtype!",
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
            description: 'The wallet ID that the account the block is being created for is in.',
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
            description: 'The account the block is being created for.',
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
            description: 'Instead of using "wallet" & "account" parameters, you can directly pass in a private key.',
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
            description: 'The block hash of the source of funds for this receive block (the send block that this receive block will pocket).',
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
            description: 'The account that the sent funds should be accessible to.',
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
            description: 'Instead of using "source" and "destination" parameters, you can directly pass "link". If the block is sending funds, set link to the public key of the destination account. If it is receiving funds, set link to the hash of the block to receive. If the block has no balance change but is updating representative only, set link to 0.',
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
            description: 'The account that block account will use as its representative.',
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
            description: `The block hash of the previous block on this account's block chain ("0" for first block).`,
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
            displayName: 'Source Wallet (Manual)',
            name: 'sourceWallet',
            type: 'string',
            displayOptions: {
                show: {
                    operation: ['accountMove'],
                },
            },
            default: '',
            placeholder: 'Source wallet ID',
            description: 'Wallet ID to move accounts from (optional), default to credential wallet ID',
        },
        {
            displayName: 'Target Wallet',
            name: 'targetWallet',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    operation: ['accountMove'],
                },
            },
            default: '',
            placeholder: 'Target wallet ID',
            description: 'Wallet ID to move accounts to',
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
                    operation: ['searchReceivable'],
                },
            },
            default: '',
            placeholder: 'Wallet ID',
            description: 'Wallet ID to search for receivable blocks',
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
        {
            displayName: 'Wallet ID (Manual)',
            name: 'manualWalletId',
            type: 'string',
            displayOptions: {
                show: {
                    operation: ['walletAdd', 'walletAddWatch', 'passwordChange', 'walletChangeSeed', 'walletLocked', 'createAccount', 'accountsCreate', 'passwordEnter', 'walletExport', 'workGet',  'receiveMinimum', 'walletBalances', 'walletFrontiers', 'walletHistory', 'walletInfo', 'walletLedger', 'walletReceivable', 'walletRepresentative',  'walletWorkGet', 'listAccounts', 'walletLock', 'accountRemove', 'walletRepublish',  'accountRepresentativeSet', 'workSet', 'receiveMinimumSet', 'walletRepresentativeSet', 'passwordValid', 'walletContains'],
                },
            },
            default: '',
            placeholder: 'Wallet ID',
            description: 'Manually specify the wallet ID (optional), default to credential wallet ',
        },
        {
            displayName: 'Wallet (Manual)',
            name: 'manualWalletId',
            type: 'string',
            displayOptions: {
                show: {
                    operation: ['accountMove'],
                },
            },
            default: '',
            placeholder: 'Source wallet ID',
            description: 'Wallet ID to move accounts from (optional), default to credential wallet ID',
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
                    displayName: 'Timeout (Ms)',
                    name: 'timeout',
                    type: 'number',
                    default: 30000,
                    description: 'Request timeout in milliseconds',
                },
            ],
        },
    ],
}