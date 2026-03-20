/**
 * Transaction-related RPC types
 */

import type { BlockSubtype } from './common';

// ============ RPC Response Types ============

/** Raw RPC response from receivable/pending */
export interface ReceivableRPCResponse {
	blocks: Record<string, string | { amount: string; source: string }>;
}

/** Response from receivable_exists */
export interface ReceivableExistsRPCResponse {
	exists: string;
}

/** Response from process RPC call */
export interface ProcessResponse {
	/** Block hash (when async=false) */
	hash?: string;
	/** Started status (when async=true) */
	started?: string;
}

/** Response from send */
export interface SendRPCResponse {
	block: string;
}

/** Response from receive */
export interface ReceiveRPCResponse {
	block: string;
}

/** Response from epoch_upgrade */
export interface EpochUpgradeRPCResponse {
	started: string;
}

// ============ Options Types ============

/** Options for process RPC call */
export interface ProcessOptions {
	/** Block subtype (v18.0+, highly recommended) */
	subtype?: BlockSubtype;
	/** Force fork resolution (v13.1+) */
	force?: boolean;
	/** Process asynchronously, returns immediately (v22.0+) */
	async?: boolean;
}

/** Options for receivable RPC call */
export interface ReceivableOptions {
	/** Maximum number of blocks to return */
	count?: number;
	/** Minimum amount threshold in raw (v8.0+) */
	threshold?: string;
	/** Include source account information (v9.0+) */
	source?: boolean;
	/** Include active blocks without finished confirmations (v15.0+) */
	includeActive?: boolean;
	/** Return minimum epoch version for receiving (v15.0+) */
	minVersion?: boolean;
	/** Sort by amount descending (v19.0+, v22.0+ for absolute sorting with count) */
	sorting?: boolean;
	/** Only return confirmed blocks (v19.0+, default true in v22.0+) */
	includeOnlyConfirmed?: boolean;
}

/** Options for receivable_exists RPC call */
export interface ReceivableExistsOptions {
	/** Include active blocks without finished confirmations (v15.0+) */
	includeActive?: boolean;
	/** Only return confirmed blocks (v19.0+, default true in v22.0+) */
	includeOnlyConfirmed?: boolean;
}
