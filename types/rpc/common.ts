/**
 * Common/shared types used across RPC operations
 */

// ============ Block Types ============
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
  link_as_account: string;
  signature: string;
  work: string;
}

/** Parameters for creating a block via RPC */
export type  CreateBlockParams = {
  type: 'state' | 'send' | 'receive' | 'change';
  balance: string;
  wallet?: string;
  account?: string;
  key?: string;
  source?: string;
  destination?: string;
  link?: string;
  representative?: string;
  previous?: string;

  work?: string; /** Work value (16 hex digits). Uses work from external source */
  json_block?: boolean; /** Return block contents as JSON object instead of string (v19.0+, default false) */
  version?: string; /** Work version string (v21.0+). Currently "work_1" is the only valid option */
  difficulty?: string; /** Difficulty value (16 hex digits, v21.0+). Uses difficulty to generate work */
}

// ============ Core RPC Types ============

export interface INanoRPCResponse {
  [key: string]: unknown;
}

export interface INanoRPCConfig {
  rpcUrl: string;
  headers?: Record<string, string>;
}
