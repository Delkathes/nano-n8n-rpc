import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type { BootstrapStatusRPCResponse, StatsRPCResponse, UncheckedRPCResponse, UncheckedKeysRPCResponse, BlockContents } from '../../nodes/Nano/types';

/** Options for bootstrap command */
export interface BootstrapOptions {
  /** Disable frontier confirmation (v20.0-21.3). Default false */
  bypassFrontierConfirmation?: boolean;
  /** Set specific ID for bootstrap attempt (v21.0+) */
  id?: string;
}

/** Options for bootstrap_any command */
export interface BootstrapAnyOptions {
  /** Force closing of all current bootstraps (v20.0+). Default false */
  force?: boolean;
  /** Set specific ID for bootstrap attempt (v21.0+) */
  id?: string;
  /** Target specific account on bootstrap (v22.0+) */
  account?: string;
}

/** Options for bootstrap_lazy command */
export interface BootstrapLazyOptions {
  /** Force closing of all current bootstraps. Default false */
  force?: boolean;
  /** Set specific ID for bootstrap attempt (v21.0+) */
  id?: string;
}

/** Options for database_txn_tracker command */
export interface DatabaseTxnTrackerOptions {
  /** Minimum read time in milliseconds to include in response */
  minReadTime?: number;
  /** Minimum write time in milliseconds to include in response */
  minWriteTime?: number;
}

/** Response from bootstrap_priorities */
export interface BootstrapPrioritiesRPCResponse {
  priorities: Array<{
    account: string;
    priority: string;
  }>;
}

/** Response from database_txn_tracker */
export interface DatabaseTxnTrackerRPCResponse {
  txn_tracking: Array<{
    thread: string;
    time_held_open: string;
    write: string;
    stacktrace?: string[];
  }>;
}

/**
 * Initialize bootstrap to a specific IP
 */
export async function bootstrap(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  address: string,
  port: number,
  options?: BootstrapOptions,
): Promise<boolean> {
  await nanoRPCCall(context, config, 'bootstrap', {
    address,
    port: port.toString(),
    bypass_frontier_confirmation: options?.bypassFrontierConfirmation,
    id: options?.id,
  });
  return true;
}

/**
 * Initialize bootstrap to random peers
 */
export async function bootstrapAny(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: BootstrapAnyOptions,
): Promise<boolean> {
  await nanoRPCCall(context, config, 'bootstrap_any', {
    force: options?.force,
    id: options?.id,
    account: options?.account,
  });
  return true;
}

/**
 * Initialize lazy bootstrap with a block hash
 */
export async function bootstrapLazy(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
  options?: BootstrapLazyOptions,
): Promise<boolean> {
  await nanoRPCCall(context, config, 'bootstrap_lazy', {
    hash,
    force: options?.force,
    id: options?.id,
  });
  return true;
}

/**
 * Get bootstrap priority queue info
 */
export async function getBootstrapPriorities(context: IExecuteFunctions, config: INanoRPCConfig): Promise<BootstrapPrioritiesRPCResponse> {
  return await nanoRPCCall<BootstrapPrioritiesRPCResponse>(context, config, 'bootstrap_priorities');
}

/**
 * Reset bootstrap attempts
 */
export async function resetBootstrap(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  await nanoRPCCall(context, config, 'bootstrap_reset');
  return true;
}

/**
 * Get bootstrap status
 */
export async function getBootstrapStatus(context: IExecuteFunctions, config: INanoRPCConfig): Promise<BootstrapStatusRPCResponse> {
  return await nanoRPCCall<BootstrapStatusRPCResponse>(context, config, 'bootstrap_status');
}

/**
 * Get database transaction tracker info
 */
export async function getDatabaseTxnTracker(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: DatabaseTxnTrackerOptions,
): Promise<DatabaseTxnTrackerRPCResponse> {
  return await nanoRPCCall<DatabaseTxnTrackerRPCResponse>(context, config, 'database_txn_tracker', {
    min_read_time: options?.minReadTime?.toString(),
    min_write_time: options?.minWriteTime?.toString(),
  });
}

/**
 * Get node statistics
 */
export async function getStats(context: IExecuteFunctions, config: INanoRPCConfig, type: string): Promise<StatsRPCResponse> {
  return await nanoRPCCall<StatsRPCResponse>(context, config, 'stats', { type });
}

/**
 * Clear node statistics
 */
export async function clearStats(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  await nanoRPCCall(context, config, 'stats_clear');
  return true;
}

/**
 * Stop the node
 */
export async function stopNode(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  await nanoRPCCall(context, config, 'stop');
  return true;
}

/**
 * Get unchecked blocks
 */
export async function getUnchecked(context: IExecuteFunctions, config: INanoRPCConfig, count?: number): Promise<UncheckedRPCResponse> {
  return await nanoRPCCall<UncheckedRPCResponse>(context, config, 'unchecked', { count });
}

/**
 * Clear unchecked blocks
 */
export async function clearUnchecked(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  await nanoRPCCall(context, config, 'unchecked_clear');
  return true;
}

/**
 * Get a specific unchecked block
 */
export async function getUncheckedBlock(context: IExecuteFunctions, config: INanoRPCConfig, hash: string): Promise<BlockContents> {
  const response = await nanoRPCCall<{ contents: BlockContents }>(context, config, 'unchecked_get', { hash, json_block: true });
  return response.contents;
}

/**
 * Get unchecked database keys, hashes & blocks
 */
export async function getUncheckedKeys(context: IExecuteFunctions, config: INanoRPCConfig, key?: string, count?: number): Promise<UncheckedKeysRPCResponse> {
  return await nanoRPCCall<UncheckedKeysRPCResponse>(context, config, 'unchecked_keys', { key, count, json_block: true });
}
