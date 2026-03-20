import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
	INanoRPCConfig,
	WorkGenerateOptions,
	WorkGenerateResponse,
	WorkValidateOptions,
	WorkValidateRPCResponse,
	WorkPeersRPCResponse,
} from '../../../types/rpc';

/**
 * Cancel work generation
 */
export async function cancelWork(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	hash: string,
): Promise<void> {
	await nanoRPCCall(context, config, 'work_cancel', { hash });
}

/**
 * Generate work for a block
 */
export async function generateWork(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	hash: string,
	options: WorkGenerateOptions = {},
): Promise<WorkGenerateResponse> {
	const params: Record<string, unknown> = { hash };

	// Add optional parameters
	if (options.difficulty) {
		params.difficulty = options.difficulty;
	}
	if (options.multiplier !== undefined) {
		params.multiplier = options.multiplier.toString();
	}
	if (options.usePeers === true) {
		params.use_peers = true;
	}
	if (options.account) {
		params.account = options.account;
	}
	if (options.version) {
		params.version = options.version;
	}
	if (options.block) {
		params.block = options.block;
		// json_block must be true when block is a JSON object
		params.json_block = true;
	}

	const response = await nanoRPCCall<WorkGenerateResponse>(
		context,
		config,
		'work_generate',
		params,
	);
	return response;
}

/**
 * Add a work peer
 */
export async function addWorkPeer(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	address: string,
	port: number,
): Promise<void> {
	await nanoRPCCall(context, config, 'work_peer_add', { address, port: port.toString() });
}

/**
 * Get list of work peers
 */
export async function getWorkPeers(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<WorkPeersRPCResponse> {
	return await nanoRPCCall<WorkPeersRPCResponse>(context, config, 'work_peers');
}

/**
 * Clear work peers list
 */
export async function clearWorkPeers(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
): Promise<void> {
	await nanoRPCCall(context, config, 'work_peers_clear');
}

/**
 * Validate work value
 */
export async function validateWork(
	context: IExecuteFunctions,
	config: INanoRPCConfig,
	work: string,
	hash: string,
	options: WorkValidateOptions = {},
): Promise<WorkValidateRPCResponse> {
	const params: Record<string, unknown> = { work, hash };

	if (options.difficulty) {
		params.difficulty = options.difficulty;
	}
	if (options.multiplier !== undefined) {
		params.multiplier = options.multiplier.toString();
	}
	if (options.version) {
		params.version = options.version;
	}

	return await nanoRPCCall<WorkValidateRPCResponse>(context, config, 'work_validate', params);
}
