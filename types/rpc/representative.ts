/**
 * Representative-related RPC types
 */

// ============ RPC Response Types ============

/** Response from delegators */
export interface DelegatorsRPCResponse {
  delegators: Record<string, string>;
}

/** Response from delegators_count */
export interface DelegatorsCountRPCResponse {
  count: string;
}

// ============ Options Types ============

/** Options for getDelegators */
export interface GetDelegatorsOptions {
  /** Minimum balance threshold in raw (v23.0+) */
  threshold?: string;
  /** Maximum number of delegators to return (v23.0+) */
  count?: number;
  /** Account to start after for pagination (v23.0+) */
  start?: string;
}
