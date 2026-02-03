import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type { INanoRPCConfig } from '../../../types/rpc';

/**
 * Convert Nano amount to raw
 */
export async function nanoToRaw(context: IExecuteFunctions, config: INanoRPCConfig, amount: string): Promise<string> {
  const response = await nanoRPCCall<{ amount: string }>(context, config, 'nano_to_raw', { amount });

  return response.amount;
}

/**
 * Convert raw amount to Nano
 */
export async function rawToNano(context: IExecuteFunctions, config: INanoRPCConfig, amount: string): Promise<string> {
  const response = await nanoRPCCall<{ amount: string }>(context, config, 'raw_to_nano', { amount });

  return response.amount;
}
