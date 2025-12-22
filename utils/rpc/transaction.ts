import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  BlockContents,
  ReceivableRPCResponse,
  ProcessOptions,
  ProcessResponse,
  ReceivableOptions,
  ReceivableExistsOptions,
  ReceivableExistsRPCResponse,
  SendRPCResponse,
  ReceiveRPCResponse,
} from '../../types/rpc';

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
  
  const response = await nanoRPCCall<ReceivableExistsRPCResponse>(context, config, 'receivable_exists', params);
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
  const response = await nanoRPCCall<SendRPCResponse>(context, config, 'send', params);
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
  const response = await nanoRPCCall<ReceiveRPCResponse>(context, config, 'receive', params);
  return response.block;
}

