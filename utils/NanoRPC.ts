import type { IExecuteFunctions } from 'n8n-workflow';
import type { CreateBlockParams, BlockContents } from '../nodes/Nano/types';
import {
  INanoRPCConfig,
  // Account operations
  getBalance,
  getAccountBlockCount,
  getAccountFromPublicKey,
  getAccountInfo,
  AccountInfoOptions,
  getAccountKey,
  getAccountRepresentative,
  getAccountWeight,
  getAccountHistory,
  AccountHistoryOptions,
  getAccountsBalances,
  AccountsBalancesOptions,
  getAccountsFrontiers,
  getAccountsReceivable,
  AccountsReceivableOptions,
  getAccountsRepresentatives,
  validateAccount,
  // Block operations
  getBlockAccount,
  confirmBlock,
  createBlock,
  getBlockHash,
  getBlockInfo,
  getBlocks,
  getBlocksInfo,
  BlocksInfoOptions,
  getBlockCount,
  // Transaction operations
  process,
  ProcessOptions,
  getReceivable,
  ReceivableOptions,
  receivableExists,
  ReceivableExistsOptions,
  epochUpgrade,
  send,
  receive,
  getPending,
  // Wallet operations
  createAccount,
  listAccounts,
  accountMove,
  accountRemove,
  accountRepresentativeSet,
  AccountRepresentativeSetOptions,
  accountsCreate,
  AccountsCreateOptions,
  passwordChange,
  passwordEnter,
  passwordValid,
  receiveMinimum,
  receiveMinimumSet,
  searchPending,
  searchReceivable,
  searchPendingAll,
  searchReceivableAll,
  walletAdd,
  WalletAddOptions,
  walletAddWatch,
  walletBalances,
  walletChangeSeed,
  walletContains,
  walletCreate,
  walletDestroy,
  walletExport,
  walletFrontiers,
  walletHistory,
  walletInfo,
  walletLedger,
  WalletLedgerOptions,
  walletLock,
  walletLocked,
  walletReceivable,
  WalletReceivableOptions,
  walletRepresentative,
  walletRepresentativeSet,
  walletRepublish,
  walletWorkGet,
  workGet,
  workSet,
  // Network operations
  getAvailableSupply,
  keepalive,
  getNodeId,
  getPeers,
  populateBacklog,
  getRepresentatives,
  getRepresentativesOnline,
  republish,
  getTelemetry,
  TelemetryOptions,
  getVersion,
  getUptime,
  PeersOptions,
  // Ledger operations
  getChain,
  ChainOptions,
  getFrontiers,
  getFrontierCount,
  getLedger,
  LedgerOptions,
  getSuccessors,
  SuccessorsOptions,
  getUnopened,
  // Confirmation operations
  getConfirmationActive,
  ConfirmationActiveOptions,
  getConfirmationHistory,
  getConfirmationInfo,
  ConfirmationInfoOptions,
  getConfirmationQuorum,
  ConfirmationQuorumOptions,
  getElectionStatistics,
  // Work operations
  cancelWork,
  generateWork,
  WorkGenerateOptions,
  addWorkPeer,
  getWorkPeers,
  clearWorkPeers,
  validateWork,
  WorkValidateOptions,
  // Key operations
  getDeterministicKey,
  createKey,
  expandKey,
  sign,
  signBlock,
  SignOptions,
  // Representative operations
  getDelegators,
  getDelegatorsCount,
  // Debug operations
  bootstrap,
  bootstrapAny,
  bootstrapLazy,
  getBootstrapPriorities,
  resetBootstrap,
  getBootstrapStatus,
  getDatabaseTxnTracker,
  getStats,
  clearStats,
  stopNode,
  getUnchecked,
  clearUnchecked,
  getUncheckedBlock,
  getUncheckedKeys,
  BootstrapOptions,
  BootstrapAnyOptions,
  BootstrapLazyOptions,
  DatabaseTxnTrackerOptions,
  // Conversion operations
  nanoToRawRPC,
  rawToNanoRPC,
} from './rpc';

// Re-export types for convenience
export type { INanoRPCConfig, INanoRPCResponse } from './rpc';

/**
 * Create a Nano RPC client with methods bound to the provided context and config
 */
export function createNanoRPC(context: IExecuteFunctions, config: INanoRPCConfig) {
  return {
    // Account Operations
    getBalance: (account: string, includeOnlyConfirmed?: boolean) => getBalance(context, config, account, includeOnlyConfirmed),
    getAccountBlockCount: (account: string) => getAccountBlockCount(context, config, account),
    getAccountFromPublicKey: (key: string) => getAccountFromPublicKey(context, config, key),
    getAccountInfo: (account: string, options?: AccountInfoOptions) => getAccountInfo(context, config, account, options),
    getAccountKey: (account: string) => getAccountKey(context, config, account),
    getAccountRepresentative: (account: string) => getAccountRepresentative(context, config, account),
    getAccountWeight: (account: string) => getAccountWeight(context, config, account),
    getAccountHistory: (account: string, count?: number, options?: AccountHistoryOptions) => getAccountHistory(context, config, account, count, options),
    getAccountsBalances: (accounts: string[], options?: AccountsBalancesOptions) => getAccountsBalances(context, config, accounts, options),
    getAccountsFrontiers: (accounts: string[]) => getAccountsFrontiers(context, config, accounts),
    getAccountsReceivable: (accounts: string[], options?: AccountsReceivableOptions) =>
      getAccountsReceivable(context, config, accounts, options),
    getAccountsRepresentatives: (accounts: string[]) => getAccountsRepresentatives(context, config, accounts),
    validateAccount: (account: string) => validateAccount(context, config, account),

    // Block Operations
    getBlockAccount: (hash: string) => getBlockAccount(context, config, hash),
    confirmBlock: (hash: string) => confirmBlock(context, config, hash),
    createBlock: (params: CreateBlockParams) => createBlock(context, config, params),
    getBlockHash: (block: BlockContents) => getBlockHash(context, config, block),
    getBlockInfo: (hash: string, jsonBlock?: boolean, includeLinkedAccount?: boolean) =>
      getBlockInfo(context, config, hash, jsonBlock, includeLinkedAccount),
    getBlocks: (hashes: string[]) => getBlocks(context, config, hashes),
    getBlocksInfo: (hashes: string[], options?: BlocksInfoOptions) => getBlocksInfo(context, config, hashes, options),
    getBlockCount: () => getBlockCount(context, config),

    // Transaction Operations
    process: (block: BlockContents, options?: ProcessOptions) =>
      process(context, config, block, options),
    getReceivable: (account: string, options?: ReceivableOptions) =>
      getReceivable(context, config, account, options),
    receivableExists: (hash: string, options?: ReceivableExistsOptions) =>
      receivableExists(context, config, hash, options),
    epochUpgrade: (epoch: number, key: string, count?: number) =>
      epochUpgrade(context, config, epoch, key, count),
    send: (wallet: string, source: string, destination: string, amountRaw: string, id?: string, work?: string) =>
      send(context, config, wallet, source, destination, amountRaw, id, work),
    receive: (wallet: string, account: string, block: string, work?: string) =>
      receive(context, config, wallet, account, block, work),
    getPending: (account: string, count?: number) => getPending(context, config, account, count),

    // Wallet Operations
    createAccount: (wallet: string, options?: { index?: number; work?: boolean }) =>
      createAccount(context, config, wallet, options),
    listAccounts: (wallet: string) => listAccounts(context, config, wallet),
    accountMove: (wallet: string, source: string, accounts: string[]) =>
      accountMove(context, config, wallet, source, accounts),
    accountRemove: (wallet: string, account: string) => accountRemove(context, config, wallet, account),
    accountRepresentativeSet: (wallet: string, account: string, representative: string, options?: AccountRepresentativeSetOptions) =>
      accountRepresentativeSet(context, config, wallet, account, representative, options),
    accountsCreate: (wallet: string, count: number, options?: AccountsCreateOptions) =>
      accountsCreate(context, config, wallet, count, options),
    passwordChange: (wallet: string, password: string) => passwordChange(context, config, wallet, password),
    passwordEnter: (wallet: string, password: string) => passwordEnter(context, config, wallet, password),
    passwordValid: (wallet: string) => passwordValid(context, config, wallet),
    receiveMinimum: () => receiveMinimum(context, config),
    receiveMinimumSet: (amount: string) => receiveMinimumSet(context, config, amount),
    searchPending: (wallet: string) => searchPending(context, config, wallet),
    searchReceivable: (wallet: string) => searchReceivable(context, config, wallet),
    searchPendingAll: () => searchPendingAll(context, config),
    searchReceivableAll: () => searchReceivableAll(context, config),
    walletAdd: (wallet: string, key: string, options?: WalletAddOptions) =>
      walletAdd(context, config, wallet, key, options),
    walletAddWatch: (wallet: string, accounts: string[]) => walletAddWatch(context, config, wallet, accounts),
    walletBalances: (wallet: string, threshold?: string) => walletBalances(context, config, wallet, threshold),
    walletChangeSeed: (wallet: string, seed: string, count?: number) =>
      walletChangeSeed(context, config, wallet, seed, count),
    walletContains: (wallet: string, account: string) => walletContains(context, config, wallet, account),
    walletCreate: (seed?: string) => walletCreate(context, config, seed),
    walletDestroy: (wallet: string) => walletDestroy(context, config, wallet),
    walletExport: (wallet: string) => walletExport(context, config, wallet),
    walletFrontiers: (wallet: string) => walletFrontiers(context, config, wallet),
    walletHistory: (wallet: string, modifiedSince?: number) => walletHistory(context, config, wallet, modifiedSince),
    walletInfo: (wallet: string) => walletInfo(context, config, wallet),
    walletLedger: (wallet: string, options?: WalletLedgerOptions) =>
      walletLedger(context, config, wallet, options),
    walletLock: (wallet: string) => walletLock(context, config, wallet),
    walletLocked: (wallet: string) => walletLocked(context, config, wallet),
    walletReceivable: (wallet: string, options?: WalletReceivableOptions) =>
      walletReceivable(context, config, wallet, options),
    walletRepresentative: (wallet: string) => walletRepresentative(context, config, wallet),
    walletRepresentativeSet: (wallet: string, representative: string, updateExisting?: boolean) =>
      walletRepresentativeSet(context, config, wallet, representative, updateExisting),
    walletRepublish: (wallet: string, count?: number) => walletRepublish(context, config, wallet, count),
    walletWorkGet: (wallet: string) => walletWorkGet(context, config, wallet),
    workGet: (wallet: string, account: string) => workGet(context, config, wallet, account),
    workSet: (wallet: string, account: string, work: string) => workSet(context, config, wallet, account, work),

    // Network Operations
    getAvailableSupply: () => getAvailableSupply(context, config),
    keepalive: (address: string, port: number) => keepalive(context, config, address, port),
    getNodeId: () => getNodeId(context, config),
    getPeers: (options?: PeersOptions) => getPeers(context, config, options),
    populateBacklog: () => populateBacklog(context, config),
    getRepresentatives: (count?: number, sorting?: boolean) => getRepresentatives(context, config, count, sorting),
    getRepresentativesOnline: (weight?: boolean, accounts?: string[]) => getRepresentativesOnline(context, config, weight, accounts),
    republish: (hash: string, count?: number, sources?: number, destinations?: number) =>
      republish(context, config, hash, count, sources, destinations),
    getTelemetry: (options?: TelemetryOptions) => getTelemetry(context, config, options),
    getVersion: () => getVersion(context, config),
    getUptime: () => getUptime(context, config),

    // Ledger Operations
    getChain: (block: string, count: number, options?: ChainOptions) =>
      getChain(context, config, block, count, options),
    getFrontiers: (account: string, count: number) => getFrontiers(context, config, account, count),
    getFrontierCount: () => getFrontierCount(context, config),
    getLedger: (account: string, options?: LedgerOptions) =>
      getLedger(context, config, account, options),
    getSuccessors: (block: string, count: number, options?: SuccessorsOptions) =>
      getSuccessors(context, config, block, count, options),
    getUnopened: (account?: string, count?: number) => getUnopened(context, config, account, count),

    // Confirmation Operations
    getConfirmationActive: (options?: ConfirmationActiveOptions) => getConfirmationActive(context, config, options),
    getConfirmationHistory: (hash?: string) => getConfirmationHistory(context, config, hash),
    getConfirmationInfo: (root: string, options?: ConfirmationInfoOptions) =>
      getConfirmationInfo(context, config, root, options),
    getConfirmationQuorum: (options?: ConfirmationQuorumOptions) => getConfirmationQuorum(context, config, options),
    getElectionStatistics: () => getElectionStatistics(context, config),

    // Work Generation Operations
    cancelWork: (hash: string) => cancelWork(context, config, hash),
    generateWork: (hash: string, options?: WorkGenerateOptions) =>
      generateWork(context, config, hash, options),
    addWorkPeer: (address: string, port: number) => addWorkPeer(context, config, address, port),
    getWorkPeers: () => getWorkPeers(context, config),
    clearWorkPeers: () => clearWorkPeers(context, config),
    validateWork: (work: string, hash: string, options?: WorkValidateOptions) =>
      validateWork(context, config, work, hash, options),

    // Key Operations
    getDeterministicKey: (seed: string, index: number) => getDeterministicKey(context, config, seed, index),
    createKey: () => createKey(context, config),
    expandKey: (key: string) => expandKey(context, config, key),
    sign: (key: string, hash: string) => sign(context, config, key, hash),
    signBlock: (options: SignOptions) => signBlock(context, config, options),

    // Representative Operations
    getDelegators: (account: string, options?: { threshold?: string; count?: number; start?: string }) =>
      getDelegators(context, config, account, options),
    getDelegatorsCount: (account: string) => getDelegatorsCount(context, config, account),

    // Debug/Admin Operations
    bootstrap: (address: string, port: number, options?: BootstrapOptions) =>
      bootstrap(context, config, address, port, options),
    bootstrapAny: (options?: BootstrapAnyOptions) => bootstrapAny(context, config, options),
    bootstrapLazy: (hash: string, options?: BootstrapLazyOptions) =>
      bootstrapLazy(context, config, hash, options),
    getBootstrapPriorities: () => getBootstrapPriorities(context, config),
    resetBootstrap: () => resetBootstrap(context, config),
    getBootstrapStatus: () => getBootstrapStatus(context, config),
    getDatabaseTxnTracker: (options?: DatabaseTxnTrackerOptions) =>
      getDatabaseTxnTracker(context, config, options),
    getStats: (type: string) => getStats(context, config, type),
    clearStats: () => clearStats(context, config),
    stopNode: () => stopNode(context, config),
    getUnchecked: (count?: number) => getUnchecked(context, config, count),
    clearUnchecked: () => clearUnchecked(context, config),
    getUncheckedBlock: (hash: string) => getUncheckedBlock(context, config, hash),
    getUncheckedKeys: (key?: string, count?: number) => getUncheckedKeys(context, config, key, count),

    // Conversion Operations
    nanoToRaw: (amount: string) => nanoToRawRPC(context, config, amount),
    rawToNano: (amount: string) => rawToNanoRPC(context, config, amount),
  };
}
