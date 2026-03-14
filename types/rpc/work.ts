/**
 * Work generation-related RPC types
 */

// ============ Response Types ============

/** Response from work_cancel */
export interface WorkCancelRPCResponse {
  success: string;
}

/** Response from work_peer_add */
export interface WorkPeerAddRPCResponse {
  success: string;
}

/** Response from work_peers */
export interface WorkPeersRPCResponse {
  work_peers: string[];
}

/** Response from work_peers_clear */
export interface WorkPeersClearRPCResponse {
  success: string;
}

/** Response from work generation */
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

/** Raw RPC response from work_validate */
export interface WorkValidateRPCResponse {
  /** Valid at the given difficulty (only when difficulty/multiplier provided) */
  valid?: string;
  /** Valid for all block types (v21.0+) */
  valid_all: string;
  /** Valid for receive blocks (v21.0+) */
  valid_receive: string;
  /** Difficulty of the work */
  difficulty: string;
  /** Multiplier from base difficulty */
  multiplier: string;
}

/** Processed response from work validation */
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

// ============ Options Types ============

/** Options for work generation */
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

/** Options for work validation */
export interface WorkValidateOptions {
  /** Custom difficulty to validate against (16 hex digits) - v19.0+ */
  difficulty?: string;
  /** Multiplier from base difficulty - v20.0+, overrides difficulty */
  multiplier?: number;
  /** Work version string - v21.0+, default "work_1" */
  version?: string;
}
