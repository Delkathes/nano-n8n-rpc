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
} from '../../types/rpc';

/**
 * Get the account that owns a block
 */
export async function getBlockAccount(context: IExecuteFunctions, config: INanoRPCConfig, hash: string): Promise<string> {
  const response = await nanoRPCCall<BlockAccountRPCResponse>(context, config, 'block_account', { hash });
  return response.account;
}

/**
 * Request confirmation for a block
 */
export async function confirmBlock(context: IExecuteFunctions, config: INanoRPCConfig, hash: string): Promise<boolean> {
  const response = await nanoRPCCall<BlockConfirmRPCResponse>(context, config, 'block_confirm', { hash });
  return response.started === '1';
}

/**
 * Create a block for sending, receiving, or changing representative
 */
export async function createBlock(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  params: CreateBlockParams
): Promise<BlockCreateResponse> {
  return await nanoRPCCall<BlockCreateResponse>(context, config, 'block_create', params);
}

/**
 * Calculate hash for a block
 */
export async function getBlockHash(context: IExecuteFunctions, config: INanoRPCConfig, block: BlockContents): Promise<string> {
  const response = await nanoRPCCall<BlockHashRPCResponse>(context, config, 'block_hash', { block });
  return response.hash;
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
export async function getBlocks(context: IExecuteFunctions, config: INanoRPCConfig, hashes: string[]): Promise<Record<string, BlockContents | string>> {
  const response = await nanoRPCCall<BlocksRPCResponse>(context, config, 'blocks', { hashes, json_block: true });
  return response.blocks;
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
