/**
 * Block-related RPC types
 */

import type { BlockContents, BlockSubtype } from './common';

// ============ RPC Response Types ============

/** Response from block_account */
export interface BlockAccountRPCResponse {
  account: string;
}

/** Response from block_confirm */
export interface BlockConfirmRPCResponse {
  started: string;
}

/** Response from block_count */
export interface BlockCountRPCResponse {
  count: string;
  unchecked: string;
  cemented: string;
}

/** Response from block_hash */
export interface BlockHashRPCResponse {
  hash: string;
}

/** Response from blocks (multiple block retrieval) */
export interface BlocksRPCResponse {
  blocks: Record<string, BlockContents | string>;
}

/** Raw RPC response from block_info */
export interface BlockInfoRPCResponse {
  block_account: string;
  amount: string;
  balance: string;
  height: string;
  local_timestamp: string;
  successor: string;
  confirmed: string;
  contents: BlockContents;
  subtype: BlockSubtype;
  // Optional fields
  pending?: string; // v9.0+ with pending option
  source_account?: string; // v9.0+ with source option
  receive_hash?: string; // v24.0+ with receive_hash option
  linked_account?: string; // v28.0+ with include_linked_account option
}

/** Response from block_create */
export interface BlockCreateResponse {
  hash: string;
  difficulty: string;
  block: BlockContents;
}

/** Response from blocks_info */
export interface BlocksInfoResponse {
  blocks: Record<string, BlockInfoRPCResponse>;
  blocks_not_found?: string[];
}

// ============ Options Types ============

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
