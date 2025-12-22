/**
 * Common/shared types used across RPC operations
 */

// ============ Block Types ============

/** State block structure (current standard) */
export interface StateBlock {
  type: 'state';
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account?: string;
  signature: string;
  work: string;
}

/** Block subtype for state blocks */
export type BlockSubtype = 'send' | 'receive' | 'open' | 'change' | 'epoch';

/** Generic block type for RPC responses */
export interface BlockContents {
  type: string;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account?: string;
  signature: string;
  work: string;
}

/** Parameters for creating a block via RPC */
export interface CreateBlockParams {
  type: 'state' | 'send' | 'receive' | 'change';
  balance?: string;
  key?: string;
  representative?: string;
  link?: string;
  previous?: string;
  wallet?: string;
  account?: string;
  source?: string;
  destination?: string;
  /** Work value (16 hex digits). Uses work from external source */
  work?: string;
  /** Return block contents as JSON object instead of string (v19.0+, default false) */
  json_block?: boolean;
  /** Work version string (v21.0+). Currently "work_1" is the only valid option */
  version?: string;
  /** Difficulty value (16 hex digits, v21.0+). Uses difficulty to generate work */
  difficulty?: string;
  [key: string]: string | boolean | undefined;
}

// ============ Core RPC Types ============

export interface INanoRPCResponse {
  [key: string]: unknown;
}

export interface INanoRPCConfig {
  rpcUrl: string;
  headers?: Record<string, string>;
}
