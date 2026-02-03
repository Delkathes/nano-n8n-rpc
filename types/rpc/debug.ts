/**
 * Debug/Admin-related RPC types
 */

import type { BlockContents } from './common';

// ============ RPC Response Types ============

/** Response from bootstrap */
export interface BootstrapRPCResponse {
  success: string;
}

/** Response from bootstrap_any */
export interface BootstrapAnyRPCResponse {
  success: string;
}

/** Response from bootstrap_lazy */
export interface BootstrapLazyRPCResponse {
  started: string;
  key_inserted: string;
}

/** Response from bootstrap_status_reset (confirmation_height_clear) */
export interface BootstrapResetRPCResponse {
  success: string;
}

/** Response from stop */
export interface StopRPCResponse {
  success: string;
}

/** Response from unchecked_clear */
export interface UncheckedClearRPCResponse {
  success: string;
}

/** Response from unchecked_get */
export interface UncheckedGetRPCResponse {
  modified_timestamp: string;
  contents: BlockContents;
}

/** Response from stats_clear */
export interface StatsClearRPCResponse {
  success: string;
}

/** Raw RPC response from bootstrap_status */
export interface BootstrapStatusRPCResponse {
  bootstrap_threads: string;
  running_attempts_count: string;
  total_attempts_count: string;
  connections: {
    clients: string;
    connections: string;
    idle: string;
    target_connections: string;
    pulls: string;
  };
  attempts: {
    id: string;
    mode: string;
    started: string;
    pulling: string;
    total_blocks: string;
    requeued_pulls: string;
    frontier_pulls: string;
    account_count: string;
  }[];
}

/** Raw RPC response from stats */
export interface StatsRPCResponse {
  type: string;
  created: string;
  entries: {
    time: string;
    type: string;
    detail: string;
    dir: string;
    value: string;
  }[];
}

/** Raw RPC response from unchecked */
export interface UncheckedRPCResponse {
  blocks: Record<string, string | BlockContents>;
}

/** Raw RPC response from unchecked_keys */
export interface UncheckedKeysRPCResponse {
  unchecked: {
    key: string;
    hash: string;
    modified_timestamp: string;
    contents: BlockContents;
  }[];
}

/** Response from bootstrap_priorities */
export interface BootstrapPrioritiesRPCResponse {
  priorities: {
    account: string;
    priority: string;
  }[];
}

/** Response from database_txn_tracker */
export interface DatabaseTxnTrackerRPCResponse {
  txn_tracking: {
    thread: string;
    time_held_open: string;
    write: string;
    stacktrace?: string[];
  }[];
}

// ============ Options Types ============

/** Options for bootstrap command */
export interface BootstrapOptions {
  /** Disable frontier confirmation (v20.0-21.3). Default false */
  bypassFrontierConfirmation?: boolean;
  /** Set specific ID for bootstrap attempt (v21.0+) */
  id?: string;
}

/** Options for bootstrap_any command */
export interface BootstrapAnyOptions {
  /** Force closing of all current bootstraps (v20.0+). Default false */
  force?: boolean;
  /** Set specific ID for bootstrap attempt (v21.0+) */
  id?: string;
  /** Target specific account on bootstrap (v22.0+) */
  account?: string;
}

/** Options for bootstrap_lazy command */
export interface BootstrapLazyOptions {
  /** Force closing of all current bootstraps. Default false */
  force?: boolean;
  /** Set specific ID for bootstrap attempt (v21.0+) */
  id?: string;
}

/** Options for database_txn_tracker command */
export interface DatabaseTxnTrackerOptions {
  /** Minimum read time in milliseconds to include in response */
  minReadTime?: number;
  /** Minimum write time in milliseconds to include in response */
  minWriteTime?: number;
}
