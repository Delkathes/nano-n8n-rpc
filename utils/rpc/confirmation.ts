import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type {
  ConfirmationActiveRPCResponse,
  ConfirmationHistoryRPCResponse,
  ConfirmationInfoRPCResponse,
  ConfirmationQuorumRPCResponse,
  ElectionStatisticsRPCResponse,
} from '../../nodes/Nano/types';

/**
 * Options for getConfirmationActive
 */
export interface ConfirmationActiveOptions {
  /** Returns only active elections with equal or higher announcements count */
  announcements?: number;
  [key: string]: unknown;
}

/**
 * Options for getConfirmationInfo
 */
export interface ConfirmationInfoOptions {
  /** Returns list of votes representatives & its weights for each block. Default: false */
  representatives?: boolean;
  /** Disable contents for each block. Default: true */
  contents?: boolean;
  /** If true, "contents" will contain a JSON subtree instead of a JSON string. Default: false (v19.0+) */
  json_block?: boolean;
  [key: string]: unknown;
}

/**
 * Options for getConfirmationQuorum
 */
export interface ConfirmationQuorumOptions {
  /** If true, add account/ip/rep weight for each peer considered in the summation of peers_stake_total. Default: false (v17.0+) */
  peer_details?: boolean;
  [key: string]: unknown;
}

/**
 * Get currently active elections
 */
export async function getConfirmationActive(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: ConfirmationActiveOptions
): Promise<ConfirmationActiveRPCResponse> {
  return await nanoRPCCall<ConfirmationActiveRPCResponse>(context, config, 'confirmation_active', options);
}

/**
 * Get recently confirmed blocks
 */
export async function getConfirmationHistory(context: IExecuteFunctions, config: INanoRPCConfig, hash?: string): Promise<ConfirmationHistoryRPCResponse> {
  return await nanoRPCCall<ConfirmationHistoryRPCResponse>(context, config, 'confirmation_history', { hash });
}

/**
 * Get confirmation info for an active election by root
 */
export async function getConfirmationInfo(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  root: string,
  options?: ConfirmationInfoOptions
): Promise<ConfirmationInfoRPCResponse> {
  return await nanoRPCCall<ConfirmationInfoRPCResponse>(context, config, 'confirmation_info', { root, ...options });
}

/**
 * Get confirmation quorum details (node election settings & observed network state)
 */
export async function getConfirmationQuorum(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: ConfirmationQuorumOptions
): Promise<ConfirmationQuorumRPCResponse> {
  return await nanoRPCCall<ConfirmationQuorumRPCResponse>(context, config, 'confirmation_quorum', options);
}

/**
 * Get election statistics (v27.0+)
 */
export async function getElectionStatistics(context: IExecuteFunctions, config: INanoRPCConfig): Promise<ElectionStatisticsRPCResponse> {
  return await nanoRPCCall<ElectionStatisticsRPCResponse>(context, config, 'election_statistics');
}
