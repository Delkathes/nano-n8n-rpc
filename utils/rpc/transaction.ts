import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type { BlockContents, ReceivableRPCResponse, BlockSubtype } from '../../nodes/Nano/types';

/** Options for process RPC call */
export interface ProcessOptions {
  /** Block subtype (v18.0+, highly recommended) */
  subtype?: BlockSubtype;
  /** Force fork resolution (v13.1+) */
  force?: boolean;
  /** Process asynchronously, returns immediately (v22.0+) */
  async?: boolean;
}

/** Response from process RPC call */
export interface ProcessResponse {
  /** Block hash (when async=false) */
  hash?: string;
  /** Started status (when async=true) */
  started?: string;
}

/**
 * Publish a block to the network
 */
export async function process(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  block: BlockContents,
  options?: ProcessOptions
): Promise<ProcessResponse> {
  const params: Record<string, unknown> = {
    json_block: true, // recommended since v19.0
    block,
  };

  if (options?.subtype) {
    params.subtype = options.subtype;
  }
  if (options?.force) {
    params.force = true;
  }
  if (options?.async) {
    params.async = true;
  }

  return await nanoRPCCall<ProcessResponse>(context, config, 'process', params);
}

/** Options for receivable RPC call */
export interface ReceivableOptions {
  /** Maximum number of blocks to return */
  count?: number;
  /** Minimum amount threshold in raw (v8.0+) */
  threshold?: string;
  /** Include source account information (v9.0+) */
  source?: boolean;
  /** Include active blocks without finished confirmations (v15.0+) */
  includeActive?: boolean;
  /** Return minimum epoch version for receiving (v15.0+) */
  minVersion?: boolean;
  /** Sort by amount descending (v19.0+, v22.0+ for absolute sorting with count) */
  sorting?: boolean;
  /** Only return confirmed blocks (v19.0+, default true in v22.0+) */
  includeOnlyConfirmed?: boolean;
}

/**
 * Get receivable/pending transactions for an account
 */
export async function getReceivable(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  options?: ReceivableOptions
): Promise<ReceivableRPCResponse> {
  const params: Record<string, unknown> = {
    account,
  };

  if (options?.count !== undefined) {
    params.count = options.count;
  }
  if (options?.threshold) {
    params.threshold = options.threshold;
  }
  if (options?.source) {
    params.source = true;
  }
  if (options?.includeActive) {
    params.include_active = true;
  }
  if (options?.minVersion) {
    params.min_version = true;
  }
  if (options?.sorting) {
    params.sorting = true;
  }
  // Only send if explicitly false (since true is default in v22.0+)
  if (options?.includeOnlyConfirmed === false) {
    params.include_only_confirmed = false;
  }

  return await nanoRPCCall<ReceivableRPCResponse>(context, config, 'receivable', params);
}

/** Options for receivable_exists RPC call */
export interface ReceivableExistsOptions {
  /** Include active blocks without finished confirmations (v15.0+) */
  includeActive?: boolean;
  /** Only return confirmed blocks (v19.0+, default true in v22.0+) */
  includeOnlyConfirmed?: boolean;
}

/**
 * Check if a receivable block exists
 */
export async function receivableExists(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
  options?: ReceivableExistsOptions
): Promise<boolean> {
  const params: Record<string, unknown> = { hash };
  
  if (options?.includeActive) {
    params.include_active = true;
  }
  // Only send if explicitly false (since true is default in v22.0+)
  if (options?.includeOnlyConfirmed === false) {
    params.include_only_confirmed = false;
  }
  
  const response = await nanoRPCCall<{ exists: string }>(context, config, 'receivable_exists', params);
  return response.exists === '1';
}

/**
 * Upgrade accounts to epoch blocks
 */
export async function epochUpgrade(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  epoch: number,
  key: string,
  count?: number
): Promise<boolean> {
  await nanoRPCCall(context, config, 'epoch_upgrade', { epoch, key, count });
  return true;
}

/**
 * Send Nano payment
 * @param id - Highly recommended idempotency key to prevent duplicate sends (v10.0+)
 * @param work - External work value (16 hex digits) to use instead of node-generated work (v9.0+)
 */
export async function send(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  source: string,
  destination: string,
  amountRaw: string,
  id?: string,
  work?: string
): Promise<string> {
  const params: Record<string, string> = {
    wallet,
    source,
    destination,
    amount: amountRaw,
  };
  if (id) {
    params.id = id;
  }
  if (work) {
    params.work = work;
  }
  const response = await nanoRPCCall<{ block: string }>(context, config, 'send', params);
  return response.block;
}

/**
 * Receive pending blocks
 * @param work - External work value (16 hex digits) to use instead of node-generated work (v9.0+)
 */
export async function receive(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string,
  block: string,
  work?: string
): Promise<string> {
  const params: Record<string, string> = {
    wallet,
    account,
    block,
  };
  if (work) {
    params.work = work;
  }
  const response = await nanoRPCCall<{ block: string }>(context, config, 'receive', params);
  return response.block;
}

/**
 * Get pending blocks for an account (deprecated, use getReceivable instead)
 */
export async function getPending(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  count: number = 10
): Promise<ReceivableRPCResponse> {
  return await nanoRPCCall<ReceivableRPCResponse>(context, config, 'pending', {
    account,
    count,
    source: true,
  });
}

