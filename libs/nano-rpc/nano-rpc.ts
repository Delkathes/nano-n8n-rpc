import type { IExecuteFunctions } from 'n8n-workflow';

import type * as rpcTypes from '../../types/rpc';

import * as rpc from './rpc';

/**
 * Create a Nano RPC client with methods bound to the provided context and config
 */
export function createNanoRPC(context: IExecuteFunctions, config: rpcTypes.INanoRPCConfig) {
	return {
		// Account Operations
		getBalance: (account: string, includeOnlyConfirmed?: boolean) =>
			rpc.getBalance(context, config, account, includeOnlyConfirmed),
		getAccountBlockCount: (account: string) => rpc.getAccountBlockCount(context, config, account),
		getAccountFromPublicKey: (key: string) => rpc.getAccountFromPublicKey(context, config, key),
		getAccountInfo: (account: string, options?: rpcTypes.AccountInfoOptions) =>
			rpc.getAccountInfo(context, config, account, options),
		getAccountKey: (account: string) => rpc.getAccountKey(context, config, account),
		getAccountRepresentative: (account: string) =>
			rpc.getAccountRepresentative(context, config, account),
		getAccountWeight: (account: string) => rpc.getAccountWeight(context, config, account),
		getAccountHistory: (
			account: string,
			count?: number,
			options?: rpcTypes.AccountHistoryOptions,
		) => rpc.getAccountHistory(context, config, account, count, options),
		getAccountsBalances: (accounts: string[], options?: rpcTypes.AccountsBalancesOptions) =>
			rpc.getAccountsBalances(context, config, accounts, options),
		getAccountsFrontiers: (accounts: string[]) =>
			rpc.getAccountsFrontiers(context, config, accounts),
		getAccountsReceivable: (accounts: string[], options?: rpcTypes.AccountsReceivableOptions) =>
			rpc.getAccountsReceivable(context, config, accounts, options),
		getAccountsRepresentatives: (accounts: string[]) =>
			rpc.getAccountsRepresentatives(context, config, accounts),
		validateAccount: (account: string) => rpc.validateAccount(context, config, account),

		// Block Operations
		getBlockAccount: (hash: string) => rpc.getBlockAccount(context, config, hash),
		confirmBlock: (hash: string) => rpc.confirmBlock(context, config, hash),
		createBlock: (params: rpcTypes.CreateBlockParams) => rpc.createBlock(context, config, params),
		getBlockHash: (block: rpcTypes.BlockContents, jsonBlock?: boolean) =>
			rpc.getBlockHash(context, config, block, jsonBlock),
		getBlockInfo: (hash: string, jsonBlock?: boolean, includeLinkedAccount?: boolean) =>
			rpc.getBlockInfo(context, config, hash, jsonBlock, includeLinkedAccount),
		getBlocks: (hashes: string[]) => rpc.getBlocks(context, config, hashes),
		getBlocksInfo: (hashes: string[], options?: rpcTypes.BlocksInfoOptions) =>
			rpc.getBlocksInfo(context, config, hashes, options),
		getBlockCount: () => rpc.getBlockCount(context, config),

		// Transaction Operations
		process: (block: rpcTypes.BlockContents, options?: rpcTypes.ProcessOptions) =>
			rpc.process(context, config, block, options),
		getReceivable: (account: string, options?: rpcTypes.ReceivableOptions) =>
			rpc.getReceivable(context, config, account, options),
		receivableExists: (hash: string, options?: rpcTypes.ReceivableExistsOptions) =>
			rpc.receivableExists(context, config, hash, options),
		epochUpgrade: (epoch: number, key: string, count?: number) =>
			rpc.epochUpgrade(context, config, epoch, key, count),
		send: (
			wallet: string,
			source: string,
			destination: string,
			amountRaw: string,
			id?: string,
			work?: string,
		) => rpc.send(context, config, wallet, source, destination, amountRaw, id, work),
		receive: (wallet: string, account: string, block: string, work?: string) =>
			rpc.receive(context, config, wallet, account, block, work),

		// Wallet Operations
		createAccount: (wallet: string, options?: rpcTypes.CreateAccountOptions) =>
			rpc.createAccount(context, config, wallet, options),
		listAccounts: (wallet: string) => rpc.listAccounts(context, config, wallet),
		accountMove: (source: string, wallet: string, accounts: string[]) =>
			rpc.accountMove(context, config, source, wallet, accounts),
		accountRemove: (wallet: string, account: string) =>
			rpc.accountRemove(context, config, wallet, account),
		accountRepresentativeSet: (
			wallet: string,
			account: string,
			representative: string,
			options?: rpcTypes.AccountRepresentativeSetOptions,
		) => rpc.accountRepresentativeSet(context, config, wallet, account, representative, options),
		accountsCreate: (wallet: string, count: number, options?: rpcTypes.AccountsCreateOptions) =>
			rpc.accountsCreate(context, config, wallet, count, options),
		passwordChange: (wallet: string, password: string) =>
			rpc.passwordChange(context, config, wallet, password),
		passwordEnter: (wallet: string, password: string) =>
			rpc.passwordEnter(context, config, wallet, password),
		passwordValid: (wallet: string) => rpc.passwordValid(context, config, wallet),
		receiveMinimum: () => rpc.receiveMinimum(context, config),
		receiveMinimumSet: (amount: string) => rpc.receiveMinimumSet(context, config, amount),
		searchReceivable: (wallet: string) => rpc.searchReceivable(context, config, wallet),
		searchReceivableAll: () => rpc.searchReceivableAll(context, config),
		walletAdd: (wallet: string, key: string, options?: rpcTypes.WalletAddOptions) =>
			rpc.walletAdd(context, config, wallet, key, options),
		walletAddWatch: (wallet: string, accounts: string[]) =>
			rpc.walletAddWatch(context, config, wallet, accounts),
		walletBalances: (wallet: string, threshold?: string) =>
			rpc.walletBalances(context, config, wallet, threshold),
		walletChangeSeed: (wallet: string, seed: string, count?: number) =>
			rpc.walletChangeSeed(context, config, wallet, seed, count),
		walletContains: (wallet: string, account: string) =>
			rpc.walletContains(context, config, wallet, account),
		walletCreate: (seed?: string) => rpc.walletCreate(context, config, seed),
		walletDestroy: (wallet: string) => rpc.walletDestroy(context, config, wallet),
		walletExport: (wallet: string) => rpc.walletExport(context, config, wallet),
		walletFrontiers: (wallet: string) => rpc.walletFrontiers(context, config, wallet),
		walletHistory: (wallet: string, modifiedSince?: number) =>
			rpc.walletHistory(context, config, wallet, modifiedSince),
		walletInfo: (wallet: string) => rpc.walletInfo(context, config, wallet),
		walletLedger: (wallet: string, options?: rpcTypes.WalletLedgerOptions) =>
			rpc.walletLedger(context, config, wallet, options),
		walletLock: (wallet: string) => rpc.walletLock(context, config, wallet),
		walletLocked: (wallet: string) => rpc.walletLocked(context, config, wallet),
		walletReceivable: (wallet: string, options?: rpcTypes.WalletReceivableOptions) =>
			rpc.walletReceivable(context, config, wallet, options),
		walletRepresentative: (wallet: string) => rpc.walletRepresentative(context, config, wallet),
		walletRepresentativeSet: (wallet: string, representative: string, updateExisting?: boolean) =>
			rpc.walletRepresentativeSet(context, config, wallet, representative, updateExisting),
		walletRepublish: (wallet: string, count?: number) =>
			rpc.walletRepublish(context, config, wallet, count),
		walletWorkGet: (wallet: string) => rpc.walletWorkGet(context, config, wallet),
		workGet: (wallet: string, account: string) => rpc.workGet(context, config, wallet, account),
		workSet: (wallet: string, account: string, work: string) =>
			rpc.workSet(context, config, wallet, account, work),

		// Network Operations
		getAvailableSupply: () => rpc.getAvailableSupply(context, config),
		keepalive: (address: string, port: number) => rpc.keepalive(context, config, address, port),
		getNodeId: () => rpc.getNodeId(context, config),
		getPeers: (options?: rpcTypes.PeersOptions) => rpc.getPeers(context, config, options),
		populateBacklog: () => rpc.populateBacklog(context, config),
		getRepresentatives: (count?: number, sorting?: boolean) =>
			rpc.getRepresentatives(context, config, count, sorting),
		getRepresentativesOnline: (options?: rpcTypes.RepresentativesOnlineOptions) =>
			rpc.getRepresentativesOnline(context, config, options),
		republish: (hash: string, count?: number, sources?: number, destinations?: number) =>
			rpc.republish(context, config, hash, count, sources, destinations),
		getTelemetry: (options?: rpcTypes.TelemetryOptions) =>
			rpc.getTelemetry(context, config, options),
		getVersion: () => rpc.getVersion(context, config),
		getUptime: () => rpc.getUptime(context, config),

		// Ledger Operations
		getChain: (block: string, count: number, options?: rpcTypes.ChainOptions) =>
			rpc.getChain(context, config, block, count, options),
		getFrontiers: (account: string, count: number) =>
			rpc.getFrontiers(context, config, account, count),
		getFrontierCount: () => rpc.getFrontierCount(context, config),
		getLedger: (account: string, options?: rpcTypes.LedgerOptions) =>
			rpc.getLedger(context, config, account, options),
		getSuccessors: (block: string, count: number, options?: rpcTypes.SuccessorsOptions) =>
			rpc.getSuccessors(context, config, block, count, options),
		getUnopened: (account?: string, count?: number) =>
			rpc.getUnopened(context, config, account, count),

		// Confirmation Operations
		getConfirmationActive: (options?: rpcTypes.ConfirmationActiveOptions) =>
			rpc.getConfirmationActive(context, config, options),
		getConfirmationHistory: (hash?: string) => rpc.getConfirmationHistory(context, config, hash),
		getConfirmationInfo: (root: string, options?: rpcTypes.ConfirmationInfoOptions) =>
			rpc.getConfirmationInfo(context, config, root, options),
		getConfirmationQuorum: (options?: rpcTypes.ConfirmationQuorumOptions) =>
			rpc.getConfirmationQuorum(context, config, options),
		getElectionStatistics: () => rpc.getElectionStatistics(context, config),

		// Work Generation Operations
		cancelWork: (hash: string) => rpc.cancelWork(context, config, hash),
		generateWork: (hash: string, options?: rpcTypes.WorkGenerateOptions) =>
			rpc.generateWork(context, config, hash, options),
		addWorkPeer: (address: string, port: number) => rpc.addWorkPeer(context, config, address, port),
		getWorkPeers: () => rpc.getWorkPeers(context, config),
		clearWorkPeers: () => rpc.clearWorkPeers(context, config),
		validateWork: (work: string, hash: string, options?: rpcTypes.WorkValidateOptions) =>
			rpc.validateWork(context, config, work, hash, options),

		// Key Operations
		getDeterministicKey: (seed: string, index: number) =>
			rpc.getDeterministicKey(context, config, seed, index),
		createKey: () => rpc.createKey(context, config),
		expandKey: (key: string) => rpc.expandKey(context, config, key),
		sign: (key: string, hash: string) => rpc.sign(context, config, key, hash),
		signBlock: (options: rpcTypes.SignOptions) => rpc.signBlock(context, config, options),

		// Representative Operations
		getDelegators: (account: string, options?: rpcTypes.GetDelegatorsOptions) =>
			rpc.getDelegators(context, config, account, options),
		getDelegatorsCount: (account: string) => rpc.getDelegatorsCount(context, config, account),

		// Debug/Admin Operations
		bootstrap: (address: string, port: number, options?: rpcTypes.BootstrapOptions) =>
			rpc.bootstrap(context, config, address, port, options),
		bootstrapAny: (options?: rpcTypes.BootstrapAnyOptions) =>
			rpc.bootstrapAny(context, config, options),
		bootstrapLazy: (hash: string, options?: rpcTypes.BootstrapLazyOptions) =>
			rpc.bootstrapLazy(context, config, hash, options),
		getBootstrapPriorities: () => rpc.getBootstrapPriorities(context, config),
		resetBootstrap: () => rpc.resetBootstrap(context, config),
		getBootstrapStatus: () => rpc.getBootstrapStatus(context, config),
		getDatabaseTxnTracker: (options?: rpcTypes.DatabaseTxnTrackerOptions) =>
			rpc.getDatabaseTxnTracker(context, config, options),
		getStats: (type: string) => rpc.getStats(context, config, type),
		clearStats: () => rpc.clearStats(context, config),
		stopNode: () => rpc.stopNode(context, config),
		getUnchecked: (count?: number) => rpc.getUnchecked(context, config, count),
		clearUnchecked: () => rpc.clearUnchecked(context, config),
		getUncheckedBlock: (hash: string) => rpc.getUncheckedBlock(context, config, hash),
		getUncheckedKeys: (key?: string, count?: number) =>
			rpc.getUncheckedKeys(context, config, key, count),

		// Conversion Operations
		nanoToRaw: (amount: string) => rpc.nanoToRawRPC(context, config, amount),
		rawToNano: (amount: string) => rpc.rawToNanoRPC(context, config, amount),
	};
}
