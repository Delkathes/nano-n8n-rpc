/**
 * Confirmation-related RPC types
 */

import type { BlockContents } from './common';

// ============ RPC Response Types ============

/** Raw RPC response from confirmation_active */
export interface ConfirmationActiveRPCResponse {
  confirmations: string[];
  unconfirmed: string;
  confirmed: string;
}

/** Raw RPC response from confirmation_history */
export interface ConfirmationHistoryRPCResponse {
  confirmation_stats: {
    count: string;
    average: string;
  };
  confirmations: Array<{
    hash: string;
    duration: string;
    time: string;
    tally: string;
    final: string;
    blocks: string;
    voters: string;
    request_count: string;
  }>;
}

/** Raw RPC response from confirmation_info */
export interface ConfirmationInfoRPCResponse {
  announcements: string;
  voters: string;
  last_winner: string;
  total_tally: string;
  final_tally: string;
  blocks: Record<string, {
    tally: string;
    contents?: BlockContents;
    representatives?: Record<string, string>;
  }>;
}

/** Raw RPC response from confirmation_quorum */
export interface ConfirmationQuorumRPCResponse {
  quorum_delta: string;
  online_weight_quorum_percent: string;
  online_weight_minimum: string;
  online_stake_total: string;
  peers_stake_total: string;
  trended_stake_total: string;
}

/** Raw RPC response from election_statistics */
export interface ElectionStatisticsRPCResponse {
  normal: string;
  priority: string;
  hinted: string;
  optimistic: string;
  total: string;
  aec_utilization_percentage: string;
  max_election_age: string;
  average_election_age: string;
}

// ============ Options Types ============

/** Options for getConfirmationActive */
export interface ConfirmationActiveOptions {
  /** Returns only active elections with equal or higher announcements count */
  announcements?: number;
  [key: string]: unknown;
}

/** Options for getConfirmationInfo */
export interface ConfirmationInfoOptions {
  /** Returns list of votes representatives & its weights for each block. Default: false */
  representatives?: boolean;
  /** Disable contents for each block. Default: true */
  contents?: boolean;
  /** If true, "contents" will contain a JSON subtree instead of a JSON string. Default: false (v19.0+) */
  json_block?: boolean;
  [key: string]: unknown;
}

/** Options for getConfirmationQuorum */
export interface ConfirmationQuorumOptions {
  /** If true, add account/ip/rep weight for each peer considered in the summation of peers_stake_total. Default: false (v17.0+) */
  peer_details?: boolean;
  [key: string]: unknown;
}
