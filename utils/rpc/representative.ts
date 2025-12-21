import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';

export interface GetDelegatorsOptions {
  /** Minimum balance threshold in raw (v23.0+) */
  threshold?: string;
  /** Maximum number of delegators to return (v23.0+) */
  count?: number;
  /** Account to start after for pagination (v23.0+) */
  start?: string;
}

/**
 * Get delegators (accounts delegating) to a representative
 */
export async function getDelegators(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  options: GetDelegatorsOptions = {}
): Promise<Record<string, string>> {
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
  
  const response = await nanoRPCCall<{ delegators: Record<string, string> }>(context, config, 'delegators', params);
  return response.delegators;
}

/**
 * Get number of delegators for a representative
 */
export async function getDelegatorsCount(context: IExecuteFunctions, config: INanoRPCConfig, account: string): Promise<number> {
  const response = await nanoRPCCall<{ count: string }>(context, config, 'delegators_count', { account });
  return parseInt(response.count);
}
