import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';

/**
 * Options for work generation
 */
export interface WorkGenerateOptions {
  /** Custom difficulty (16 hex digits) - v19.0+, note: not useful in v22.0+ */
  difficulty?: string;
  /** Multiplier from base difficulty - v20.0+, overrides difficulty */
  multiplier?: number;
  /** Query work peers instead of doing local computation - v14.0+, default false */
  usePeers?: boolean;
  /** Account to relay to work peers - v20.0+, only used if usePeers is true */
  account?: string;
  /** Work version string - v21.0+, default "work_1" */
  version?: string;
  /** Block for automatic difficulty calculation - v21.0+ */
  block?: Record<string, unknown>;
  /** If block is provided as JSON object - v21.0+, default false */
  jsonBlock?: boolean;
}

/**
 * Response from work generation
 */
export interface WorkGenerateResponse {
  /** Generated work value */
  work: string;
  /** Difficulty of the generated work - v19.0+ */
  difficulty: string;
  /** Multiplier from base difficulty - v19.0+ */
  multiplier: string;
  /** Hash used for work generation - v20.0+ */
  hash: string;
}

/**
 * Cancel work generation
 */
export async function cancelWork(context: IExecuteFunctions, config: INanoRPCConfig, hash: string): Promise<boolean> {
  await nanoRPCCall(context, config, 'work_cancel', { hash });
  return true;
}

/**
 * Generate work for a block
 */
export async function generateWork(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
  options: WorkGenerateOptions = {}
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
    params.use_peers = 'true';
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
    params.json_block = 'true';
  }

  const response = await nanoRPCCall<WorkGenerateResponse>(context, config, 'work_generate', params);
  return response;
}

/**
 * Add a work peer
 */
export async function addWorkPeer(context: IExecuteFunctions, config: INanoRPCConfig, address: string, port: number): Promise<boolean> {
  await nanoRPCCall(context, config, 'work_peer_add', { address, port: port.toString() });
  return true;
}

/**
 * Get list of work peers
 */
export async function getWorkPeers(context: IExecuteFunctions, config: INanoRPCConfig): Promise<string[]> {
  const response = await nanoRPCCall<{ work_peers: string[] }>(context, config, 'work_peers');
  return response.work_peers;
}

/**
 * Clear work peers list
 */
export async function clearWorkPeers(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  await nanoRPCCall(context, config, 'work_peers_clear');
  return true;
}

/**
 * Options for work validation
 */
export interface WorkValidateOptions {
  /** Custom difficulty to validate against (16 hex digits) - v19.0+ */
  difficulty?: string;
  /** Multiplier from base difficulty - v20.0+, overrides difficulty */
  multiplier?: number;
  /** Work version string - v21.0+, default "work_1" */
  version?: string;
}

/**
 * Response from work validation
 */
export interface WorkValidateResponse {
  /** Valid at the given difficulty (only when difficulty/multiplier provided) */
  valid?: boolean;
  /** Valid for all block types (v21.0+) */
  validAll: boolean;
  /** Valid for receive blocks (v21.0+) */
  validReceive: boolean;
  /** Difficulty of the work */
  difficulty: string;
  /** Multiplier from base difficulty */
  multiplier: number;
}

/**
 * Validate work value
 */
export async function validateWork(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  work: string,
  hash: string,
  options: WorkValidateOptions = {}
): Promise<WorkValidateResponse> {
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

  const response = await nanoRPCCall<{
    valid?: string;
    valid_all: string;
    valid_receive: string;
    difficulty: string;
    multiplier: string;
  }>(context, config, 'work_validate', params);

  return {
    valid: response.valid !== undefined ? response.valid === '1' : undefined,
    validAll: response.valid_all === '1',
    validReceive: response.valid_receive === '1',
    difficulty: response.difficulty,
    multiplier: parseFloat(response.multiplier),
  };
}
