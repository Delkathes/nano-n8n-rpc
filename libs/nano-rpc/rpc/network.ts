import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  PeersRPCResponse,
  RepresentativesOnlineRPCResponse,
  TelemetryRPCResponse,
  PeersOptions,
  TelemetryOptions,
  RepresentativesOnlineOptions,
  AvailableSupplyRPCResponse,
  NodeIdRPCResponse,
  VersionRPCResponse,
  UptimeRPCResponse,
  RepresentativesRPCResponse,
  RepublishRPCResponse,
} from '../../../types/rpc';

/**
 * Get the total available supply of Nano
 */
export async function getAvailableSupply(context: IExecuteFunctions, config: INanoRPCConfig): Promise<AvailableSupplyRPCResponse> {
  return await nanoRPCCall<AvailableSupplyRPCResponse>(context, config, 'available_supply');
}

/**
 * Keepalive with specific peers
 */
export async function keepalive(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  address: string,
  port: number,
): Promise<void> {
  await nanoRPCCall(context, config, 'keepalive', { address, port: port.toString() });
}

/**
 * Get node ID
 */
export async function getNodeId(context: IExecuteFunctions, config: INanoRPCConfig): Promise<NodeIdRPCResponse> {
  return await nanoRPCCall<NodeIdRPCResponse>(context, config, 'node_id');
}

/**
 * Get list of peers
 */
export async function getPeers(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: PeersOptions
): Promise<PeersRPCResponse> {
  const params: Record<string, boolean> = {};
  if (options?.peer_details) {
    params.peer_details = true;
  }
  return await nanoRPCCall<PeersRPCResponse>(context, config, 'peers', params);
}

/**
 * Populate priority queue for election prioritization
 */
export async function populateBacklog(context: IExecuteFunctions, config: INanoRPCConfig): Promise<void> {
  await nanoRPCCall(context, config, 'populate_backlog');
}

/**
 * Get list of network representatives
 */
export async function getRepresentatives(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  count?: number,
  sorting?: boolean
): Promise<RepresentativesRPCResponse> {
  const params: Record<string, number | boolean> = {};
  if (sorting) {
    params.sorting = true;
  } else if (count !== undefined && count > 0) {
    params.count = count;
  }
  return await nanoRPCCall<RepresentativesRPCResponse>(context, config, 'representatives', params);
}

/**
 * Get online representatives with their weights
 */
export async function getRepresentativesOnline(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: RepresentativesOnlineOptions
): Promise<RepresentativesOnlineRPCResponse> {
  const params: Record<string, boolean | string[]> = {};
  if (options?.weight) {
    params.weight = true;
  }
  if (options?.accounts && options.accounts.length > 0) {
    params.accounts = options.accounts;
  }
  return await nanoRPCCall<RepresentativesOnlineRPCResponse>(context, config, 'representatives_online', params);
}

/**
 * Rebroadcast blocks starting from a hash
 */
export async function republish(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  hash: string,
  count?: number,
  sources?: number,
  destinations?: number
): Promise<RepublishRPCResponse> {
  return await nanoRPCCall<RepublishRPCResponse>(context, config, 'republish', { hash, count, sources, destinations });
}

/**
 * Get telemetry data from network peers
 * @param options - Optional parameters for raw metrics or specific peer telemetry
 */
export async function getTelemetry(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options?: TelemetryOptions
): Promise<TelemetryRPCResponse> {
  const params: Record<string, unknown> = {};

  if (options?.raw) {
    params.raw = true;
  }
  if (options?.address) {
    params.address = options.address;
  }
  if (options?.port !== undefined) {
    params.port = options.port.toString();
  }

  return await nanoRPCCall<TelemetryRPCResponse>(context, config, 'telemetry', params);
}

/**
 * Get node version information
 */
export async function getVersion(context: IExecuteFunctions, config: INanoRPCConfig): Promise<VersionRPCResponse> {
  return await nanoRPCCall<VersionRPCResponse>(context, config, 'version');
}

/**
 * Get node uptime in seconds
 */
export async function getUptime(context: IExecuteFunctions, config: INanoRPCConfig): Promise<UptimeRPCResponse> {
  return await nanoRPCCall<UptimeRPCResponse>(context, config, 'uptime');
}
