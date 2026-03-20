import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
	INanoRPCConfig,
	GetDelegatorsOptions,
	DelegatorsRPCResponse,
	DelegatorsCountRPCResponse,
} from '../../../types/rpc';

/**
 * Get delegators (accounts delegating) to a representative
 */
export async function getDelegators(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	account: string,
	options: GetDelegatorsOptions = {},
): Promise<DelegatorsRPCResponse> {
	const params: Record<string, string | number> = { account };

	if (options.threshold) {
		params.threshold = options.threshold;
	}
	if (options.count !== undefined && options.count > 0) {
		params.count = options.count;
	}
	if (options.start) {
		params.start = options.start;
	}

	return await nanoRPCCall<DelegatorsRPCResponse>(context, config, 'delegators', params);
}

/**
 * Get number of delegators for a representative
 */
export async function getDelegatorsCount(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	account: string,
): Promise<DelegatorsCountRPCResponse> {
	return await nanoRPCCall<DelegatorsCountRPCResponse>(context, config, 'delegators_count', {
		account,
	});
}
