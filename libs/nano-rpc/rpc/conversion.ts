import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type { INanoRPCConfig, AmountConversionRPCResponse } from '../../../types/rpc';

/**
 * Convert Nano amount to raw
 */
export async function nanoToRaw(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	amount: string,
): Promise<AmountConversionRPCResponse> {
	return await nanoRPCCall<AmountConversionRPCResponse>(context, config, 'nano_to_raw', { amount });
}

/**
 * Convert raw amount to Nano
 */
export async function rawToNano(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	amount: string,
): Promise<AmountConversionRPCResponse> {
	return await nanoRPCCall<AmountConversionRPCResponse>(context, config, 'raw_to_nano', { amount });
}
