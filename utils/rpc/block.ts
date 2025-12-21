import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type { CreateBlockParams, BlockContents, BlockInfoRPCResponse } from '../../nodes/Nano/types';

/** Response from block_create */
export interface BlockCreateResponse {
  hash: string;
  difficulty: string;
  block: BlockContents;
}

/**
 * Get the account that owns a block
 */
export async function getBlockAccount(context: IExecuteFunctions, config: INanoRPCConfig, hash: string): Promise<string> {
  const response = await nanoRPCCall<{ account: string }>(context, config, 'block_account', { hash });
  return response.account;
}

/**
 * Request confirmation for a block
 */
export async function confirmBlock(context: IExecuteFunctions, config: INanoRPCConfig, hash: string): Promise<boolean> {
  const response = await nanoRPCCall<{ started: string }>(context, config, 'block_confirm', { hash });
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
  const response = await nanoRPCCall<{ hash: string }>(context, config, 'block_hash', { block });
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
export async function getBlocks(context: IExecuteFunctions, config: INanoRPCConfig, hashes: string[]): Promise<Record<string, BlockContents>> {
  const response = await nanoRPCCall<{ blocks: Record<string, BlockContents> }>(context, config, 'blocks', { hashes, json_block: true });
  return response.blocks;
}

/** Options for blocks_info */
export interface BlocksInfoOptions {
  /** Return contents as JSON object instead of string (v19.0+, default true) */
  jsonBlock?: boolean;
  /** Include blocks_not_found array in response (v19.0+) */
  includeNotFound?: boolean;
  /** Check if block is pending/receivable (v9.0+) */
  pending?: boolean;
  /** Return source account for receive & open blocks (v9.0+) */
  source?: boolean;
  /** Include receive_hash for send blocks (v24.0+) */
  receiveHash?: boolean;
  /** Include linked_account field (v28.0+) */
  includeLinkedAccount?: boolean;
}

/** Response from blocks_info */
export interface BlocksInfoResponse {
  blocks: Record<string, BlockInfoRPCResponse>;
  blocks_not_found?: string[];
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
): Promise<{ count: string; unchecked: string; cemented: string }> {
  const response = await nanoRPCCall<{ count: string; unchecked: string; cemented: string }>(context, config, 'block_count');
  return {
    count: response.count,
    unchecked: response.unchecked,
    cemented: response.cemented,
  };
}
