import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type { LedgerRPCResponse } from '../../nodes/Nano/types';

/** Options for chain RPC call */
export interface ChainOptions {
  /** Number of blocks to skip from start (v18.0+) */
  offset?: number;
  /** Return from open block to frontier instead of frontier to open (v18.0+) */
  reverse?: boolean;
}

/**
 * Get a consecutive sequence of block hashes in the account chain
 * @param block - Starting block hash
 * @param count - Number of blocks to return (-1 for all)
 * @param options - Optional parameters for offset and reverse
 */
export async function getChain(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  block: string,
  count: number,
  options?: ChainOptions
): Promise<string[]> {
  const params: Record<string, unknown> = { block, count };
  if (options?.offset !== undefined && options.offset > 0) {
    params.offset = options.offset;
  }
  if (options?.reverse) {
    params.reverse = true;
  }
  const response = await nanoRPCCall<{ blocks: string[] }>(context, config, 'chain', params);
  return response.blocks;
}

/**
 * Get frontier (head) blocks for accounts
 */
export async function getFrontiers(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  count: number
): Promise<Record<string, string>> {
  const response = await nanoRPCCall<{ frontiers: Record<string, string> }>(context, config, 'frontiers', { account, count });
  return response.frontiers;
}

/**
 * Get the total frontier block count
 */
export async function getFrontierCount(context: IExecuteFunctions, config: INanoRPCConfig): Promise<number> {
  const response = await nanoRPCCall<{ count: string }>(context, config, 'frontier_count');
  return parseInt(response.count);
}

/** Options for ledger RPC call */
export interface LedgerOptions {
  /** Number of accounts to return (ignored if sorting is true) */
  count?: number;
  /** Include representative for each account (default false) */
  representative?: boolean;
  /** Include voting weight for each account (default false) */
  weight?: boolean;
  /** Include receivable balance for each account (default false) */
  receivable?: boolean;
  /** Return only accounts modified after this UNIX timestamp (v11.0+, default 0) */
  modifiedSince?: number;
  /** Sort accounts by balance in descending order (default false). Note: count is ignored if sorting is true */
  sorting?: boolean;
  /** Return only accounts with balance above this threshold in raw (v19.0+, default 0). If receivable is also given, compares sum of balance and receivable. */
  threshold?: string;
}

/**
 * Get accounts, public keys, balances, heads, and more from the ledger
 * @param account - Starting account address
 * @param options - Optional parameters for filtering and additional data
 */
export async function getLedger(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  options?: LedgerOptions
): Promise<LedgerRPCResponse> {
  const params: Record<string, unknown> = { account };

  if (options?.count !== undefined) {
    params.count = options.count;
  }
  if (options?.representative) {
    params.representative = true;
  }
  if (options?.weight) {
    params.weight = true;
  }
  if (options?.receivable) {
    params.receivable = true;
  }
  if (options?.modifiedSince !== undefined && options.modifiedSince > 0) {
    params.modified_since = options.modifiedSince;
  }
  if (options?.sorting) {
    params.sorting = true;
  }
  if (options?.threshold) {
    params.threshold = options.threshold;
  }

  return await nanoRPCCall<LedgerRPCResponse>(context, config, 'ledger', params);
}

/** Options for successors RPC call */
export interface SuccessorsOptions {
  /** Number of blocks to skip from start (v18.0+) */
  offset?: number;
  /** Return from frontier to open block instead of open to frontier (v18.0+) */
  reverse?: boolean;
}

/**
 * Get successor blocks in the chain
 * @param block - Starting block hash
 * @param count - Number of blocks to return (-1 for all)
 * @param options - Optional parameters for offset and reverse
 */
export async function getSuccessors(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  block: string,
  count: number,
  options?: SuccessorsOptions
): Promise<string[]> {
  const params: Record<string, unknown> = { block, count };
  if (options?.offset !== undefined && options.offset > 0) {
    params.offset = options.offset;
  }
  if (options?.reverse) {
    params.reverse = true;
  }
  const response = await nanoRPCCall<{ blocks: string[] }>(context, config, 'successors', params);
  return response.blocks;
}

/**
 * Get accounts that have not yet been opened
 */
export async function getUnopened(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account?: string,
  count?: number
): Promise<Record<string, string>> {
  const response = await nanoRPCCall<{ accounts: Record<string, string> }>(context, config, 'unopened', { account, count });
  return response.accounts;
}
