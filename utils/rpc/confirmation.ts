import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  ConfirmationActiveRPCResponse,
  ConfirmationHistoryRPCResponse,
  ConfirmationInfoRPCResponse,
  ConfirmationQuorumRPCResponse,
  ElectionStatisticsRPCResponse,
  ConfirmationActiveOptions,
  ConfirmationInfoOptions,
  ConfirmationQuorumOptions,
} from '../../types/rpc';

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
