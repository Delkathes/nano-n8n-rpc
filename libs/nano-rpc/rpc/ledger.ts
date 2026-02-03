import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  LedgerRPCResponse,
  ChainOptions,
  LedgerOptions,
  SuccessorsOptions,
  ChainRPCResponse,
  FrontiersRPCResponse,
  FrontierCountRPCResponse,
  UnopenedRPCResponse,
} from '../../../types/rpc';

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
  const response = await nanoRPCCall<ChainRPCResponse>(context, config, 'chain', params);
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
  const response = await nanoRPCCall<FrontiersRPCResponse>(context, config, 'frontiers', { account, count });
  return response.frontiers;
}

/**
 * Get the total frontier block count
 */
export async function getFrontierCount(context: IExecuteFunctions, config: INanoRPCConfig): Promise<string> {
  const response = await nanoRPCCall<FrontierCountRPCResponse>(context, config, 'frontier_count');
  return response.count;
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
  const response = await nanoRPCCall<ChainRPCResponse>(context, config, 'successors', params);
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
  const response = await nanoRPCCall<UnopenedRPCResponse>(context, config, 'unopened', { account, count });
  return response.accounts;
}
