import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  CreateBlockParams,
  BlockContents,
  BlockAccountRPCResponse,
  BlockConfirmRPCResponse,
  BlockCountRPCResponse,
  BlockHashRPCResponse,
  BlocksRPCResponse,
  BlockInfoRPCResponse,
  BlockCreateResponse,
  BlocksInfoOptions,
  BlocksInfoResponse,
} from '../../../types/rpc';

/**
 * Get the account that owns a block
 */
export async function getBlockAccount(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
): Promise<BlockAccountRPCResponse> {
  return await nanoRPCCall<BlockAccountRPCResponse>(context, config, 'block_account', { hash });
}

/**
 * Request confirmation for a block
 */
export async function confirmBlock(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
): Promise<BlockConfirmRPCResponse> {
  return await nanoRPCCall<BlockConfirmRPCResponse>(context, config, 'block_confirm', { hash });
}

/**
 * Create a block for sending, receiving, or changing representative
 */
export async function createBlock(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  blockparams: CreateBlockParams
): Promise<BlockCreateResponse> {
  const { work, balance, type, account, destination, difficulty, json_block, key, link, previous, representative, source, version, wallet } = blockparams;
  const params: Record<string, unknown> = { balance, type, previous, representative, json_block };

  if (work) {
    params.work = work
  }
  if (account) {
    params.account = account
  }
  if (version) {
    params.version = version;
  }
  if (source) {
    params.source = source;
  }
  if (wallet) {
    params.wallet = wallet;
  }
  if (link) {
    params.link = link;
  }
  if (key) {
    params.key = key;
  }
  if (destination) {
    params.destination = destination;
  }
  if (difficulty) {
    params.difficulty = difficulty;
  }

  return await nanoRPCCall<BlockCreateResponse>(context, config, 'block_create', params);
}

/**
 * Calculate hash for a block
 */
export async function getBlockHash(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  block: BlockContents,
  jsonBlock: boolean = true,
): Promise<BlockHashRPCResponse> {
  const params: Record<string, BlockContents | boolean> = {
    block,
    json_block: jsonBlock,
  };
  return await nanoRPCCall<BlockHashRPCResponse>(context, config, 'block_hash', params);
}

/**
 * Get block information
 */
export async function getBlockInfo(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
  jsonBlock: boolean = true,
  includeLinkedAccount: boolean = false
): Promise<BlockInfoRPCResponse> {
  const params: Record<string, string | boolean> = {
    hash,
    json_block: jsonBlock,
  };
  if (includeLinkedAccount) {
    params.include_linked_account = true;
  }
  return await nanoRPCCall<BlockInfoRPCResponse>(context, config, 'block_info', params);
}

/**
 * Get multiple blocks by their hashes
 */
export async function getBlocks(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hashes: string[],
): Promise<BlocksRPCResponse> {
  return await nanoRPCCall<BlocksRPCResponse>(context, config, 'blocks', { hashes, json_block: true });
}

/**
 * Get information for multiple blocks
 */
export async function getBlocksInfo(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hashes: string[],
  options?: BlocksInfoOptions
): Promise<BlocksInfoResponse> {
  const params: Record<string, unknown> = {
    hashes,
    json_block: options?.jsonBlock !== false, // default true
  };

  if (options?.includeNotFound) {
    params.include_not_found = true;
  }
  if (options?.pending) {
    params.pending = true;
  }
  if (options?.source) {
    params.source = true;
  }
  if (options?.receiveHash) {
    params.receive_hash = true;
  }
  if (options?.includeLinkedAccount) {
    params.include_linked_account = true;
  }

  return await nanoRPCCall<BlocksInfoResponse>(context, config, 'blocks_info', params);
}

/**
 * Get current block count
 */
export async function getBlockCount(
  context: IExecuteFunctions,
  config: INanoRPCConfig
): Promise<BlockCountRPCResponse> {
  return await nanoRPCCall<BlockCountRPCResponse>(context, config, 'block_count');
}
