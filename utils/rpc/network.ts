import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type { PeersRPCResponse, RepresentativesOnlineRPCResponse, TelemetryRPCResponse } from '../../nodes/Nano/types';

/**
 * Get the total available supply of Nano
 */
export async function getAvailableSupply(context: IExecuteFunctions, config: INanoRPCConfig): Promise<string> {
  const response = await nanoRPCCall<{ available: string }>(context, config, 'available_supply');
  return response.available;
}

/**
 * Keepalive with specific peers
 */
export async function keepalive(context: IExecuteFunctions, config: INanoRPCConfig, address: string, port: number): Promise<boolean> {
  await nanoRPCCall(context, config, 'keepalive', { address, port: port.toString() });
  return true;
}

/**
 * Get node ID
 */
export async function getNodeId(context: IExecuteFunctions, config: INanoRPCConfig): Promise<{ private: string; public: string; as_account: string }> {
  const response = await nanoRPCCall<{ private: string; public: string; as_account: string }>(context, config, 'node_id');
  return {
    private: response.private,
    public: response.public,
    as_account: response.as_account,
  };
}

/** Options for peers RPC call */
export interface PeersOptions {
  /** When true, returns detailed peer info including node_id and connection type (v18.0+) */
  peer_details?: boolean;
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
export async function populateBacklog(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  await nanoRPCCall(context, config, 'populate_backlog');
  return true;
}

/**
 * Get list of network representatives
 */
export async function getRepresentatives(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  count?: number,
  sorting?: boolean
): Promise<Record<string, string>> {
  const params: Record<string, number | boolean> = {};
  if (sorting) {
    params.sorting = true;
  } else if (count !== undefined && count > 0) {
    params.count = count;
  }
  const response = await nanoRPCCall<{ representatives: Record<string, string> }>(context, config, 'representatives', params);
  return response.representatives;
}

/**
 * Get online representatives with their weights
 */
export async function getRepresentativesOnline(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  weight?: boolean,
  accounts?: string[]
): Promise<RepresentativesOnlineRPCResponse> {
  const params: Record<string, boolean | string[]> = {};
  if (weight) {
    params.weight = true;
  }
  if (accounts && accounts.length > 0) {
    params.accounts = accounts;
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
): Promise<{ blocks: string[] }> {
  const response = await nanoRPCCall<{ blocks: string[] }>(context, config, 'republish', { hash, count, sources, destinations });
  return { blocks: response.blocks };
}

/** Options for telemetry RPC call */
export interface TelemetryOptions {
  /** When true, returns metrics from all nodes with address and port for each peer */
  raw?: boolean;
  /** Get telemetry from a specific peer (requires port). Accepts both IPv4 and IPv6 addresses. */
  address?: string;
  /** Port of the specific peer to get telemetry from (requires address) */
  port?: number;
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
export async function getVersion(context: IExecuteFunctions, config: INanoRPCConfig): Promise<{
  rpc_version: string;
  store_version: string;
  protocol_version: string;
  node_vendor: string;
  store_vendor?: string;
  network: string;
  network_identifier: string;
  build_info: string;
}> {
  const response = await nanoRPCCall<{
    rpc_version: string;
    store_version: string;
    protocol_version: string;
    node_vendor: string;
    store_vendor?: string;
    network: string;
    network_identifier: string;
    build_info: string;
  }>(context, config, 'version');
  return {
    rpc_version: response.rpc_version,
    store_version: response.store_version,
    protocol_version: response.protocol_version,
    node_vendor: response.node_vendor,
    store_vendor: response.store_vendor,
    network: response.network,
    network_identifier: response.network_identifier,
    build_info: response.build_info,
  };
}

/**
 * Get node uptime in seconds
 */
export async function getUptime(context: IExecuteFunctions, config: INanoRPCConfig): Promise<number> {
  const response = await nanoRPCCall<{ seconds: string }>(context, config, 'uptime');
  return parseInt(response.seconds);
}
