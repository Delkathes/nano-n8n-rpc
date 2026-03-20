import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
	INanoRPCConfig,
	BootstrapStatusRPCResponse,
	StatsRPCResponse,
	UncheckedRPCResponse,
	UncheckedKeysRPCResponse,
	BootstrapOptions,
	BootstrapAnyOptions,
	BootstrapLazyOptions,
	DatabaseTxnTrackerOptions,
	BootstrapPrioritiesRPCResponse,
	DatabaseTxnTrackerRPCResponse,
	BootstrapRPCResponse,
	BootstrapAnyRPCResponse,
	BootstrapLazyRPCResponse,
	BootstrapResetRPCResponse,
	StatsClearRPCResponse,
	StopRPCResponse,
	UncheckedClearRPCResponse,
	UncheckedGetRPCResponse,
} from '../../../types/rpc';

/**
 * Initialize bootstrap to a specific IP
 */
export async function bootstrap(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	address: string,
	port: number,
	options?: BootstrapOptions,
): Promise<BootstrapRPCResponse> {
	return await nanoRPCCall<BootstrapRPCResponse>(context, config, 'bootstrap', {
		address,
		port: port.toString(),
		bypass_frontier_confirmation: options?.bypassFrontierConfirmation,
		id: options?.id,
	});
}

/**
 * Initialize bootstrap to random peers
 */
export async function bootstrapAny(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	options?: BootstrapAnyOptions,
): Promise<BootstrapAnyRPCResponse> {
	return await nanoRPCCall<BootstrapAnyRPCResponse>(context, config, 'bootstrap_any', {
		force: options?.force,
		id: options?.id,
		account: options?.account,
	});
}

/**
 * Initialize lazy bootstrap with a block hash
 */
export async function bootstrapLazy(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	hash: string,
	options?: BootstrapLazyOptions,
): Promise<BootstrapLazyRPCResponse> {
	return await nanoRPCCall<BootstrapLazyRPCResponse>(context, config, 'bootstrap_lazy', {
		hash,
		force: options?.force,
		id: options?.id,
	});
}

/**
 * Get bootstrap priority queue info
 */
export async function getBootstrapPriorities(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<BootstrapPrioritiesRPCResponse> {
	return await nanoRPCCall<BootstrapPrioritiesRPCResponse>(context, config, 'bootstrap_priorities');
}

/**
 * Reset bootstrap attempts
 */
export async function resetBootstrap(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<BootstrapResetRPCResponse> {
	return await nanoRPCCall<BootstrapResetRPCResponse>(context, config, 'bootstrap_reset');
}

/**
 * Get bootstrap status
 */
export async function getBootstrapStatus(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<BootstrapStatusRPCResponse> {
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
export async function getStats(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	type: string,
): Promise<StatsRPCResponse> {
	return await nanoRPCCall<StatsRPCResponse>(context, config, 'stats', { type });
}

/**
 * Clear node statistics
 */
export async function clearStats(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<StatsClearRPCResponse> {
	return await nanoRPCCall<StatsClearRPCResponse>(context, config, 'stats_clear');
}

/**
 * Stop the node
 */
export async function stopNode(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<StopRPCResponse> {
	return await nanoRPCCall<StopRPCResponse>(context, config, 'stop');
}

/**
 * Get unchecked blocks
 */
export async function getUnchecked(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	count?: number,
): Promise<UncheckedRPCResponse> {
	return await nanoRPCCall<UncheckedRPCResponse>(context, config, 'unchecked', { count });
}

/**
 * Clear unchecked blocks
 */
export async function clearUnchecked(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<UncheckedClearRPCResponse> {
	return await nanoRPCCall<UncheckedClearRPCResponse>(context, config, 'unchecked_clear');
}

/**
 * Get a specific unchecked block
 */
export async function getUncheckedBlock(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	hash: string,
): Promise<UncheckedGetRPCResponse> {
	return await nanoRPCCall<UncheckedGetRPCResponse>(context, config, 'unchecked_get', {
		hash,
		json_block: true,
	});
}

/**
 * Get unchecked database keys, hashes & blocks
 */
export async function getUncheckedKeys(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	key?: string,
	count?: number,
): Promise<UncheckedKeysRPCResponse> {
	return await nanoRPCCall<UncheckedKeysRPCResponse>(context, config, 'unchecked_keys', {
		key,
		count,
		json_block: true,
	});
}
