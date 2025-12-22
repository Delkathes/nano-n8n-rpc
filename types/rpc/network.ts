/**
 * Network-related RPC types
 */

// ============ RPC Response Types ============

/** Response from available_supply */
export interface AvailableSupplyRPCResponse {
  available: string;
}

/** Response from keepalive */
export interface KeepaliveRPCResponse {
  started: string;
}

/** Response from node_id */
export interface NodeIdRPCResponse {
  private: string;
  public: string;
  as_account: string;
  node_id: string;
}

/** Raw RPC response from peers */
export interface PeersRPCResponse {
  peers: Record<string, string | {
    protocol_version: string;
    node_id: string;
    type: string;
  }>;
}

/** Raw RPC response from representatives_online */
export interface RepresentativesOnlineRPCResponse {
  representatives: Record<string, string | { weight: string }>;
}

/** Raw RPC response from telemetry */
export interface TelemetryRPCResponse {
  block_count: string;
  cemented_count: string;
  unchecked_count: string;
  account_count: string;
  bandwidth_cap: string;
  peer_count: string;
  protocol_version: string;
  uptime: string;
  genesis_block: string;
  major_version: string;
  minor_version: string;
  patch_version: string;
  pre_release_version: string;
  maker: string;
  timestamp: string;
  active_difficulty: string;
  node_id: string;
  signature: string;
}

/** Response from version */
export interface VersionRPCResponse {
  rpc_version: string;
  store_version: string;
  protocol_version: string;
  node_vendor: string;
  store_vendor: string;
  network: string;
  network_identifier: string;
  build_info: string;
}

/** Response from uptime */
export interface UptimeRPCResponse {
  seconds: string;
}

/** Response from representatives (with no weight) */
export interface RepresentativesRPCResponse {
  representatives: Record<string, string>;
}

/** Response from republish */
export interface RepublishRPCResponse {
  blocks: string[];
}

/** Response from populate_backlog */
export interface PopulateBacklogRPCResponse {
  success: string;
}

// ============ Options Types ============

/** Options for peers RPC call */
export interface PeersOptions {
  /** When true, returns detailed peer info including node_id and connection type (v18.0+) */
  peer_details?: boolean;
}

/** Options for representatives_online RPC call */
export interface RepresentativesOnlineOptions {
  /** If true, returns voting weight for each representative */
  weight?: boolean;
  /** Filter to only these accounts */
  accounts?: string[];
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
