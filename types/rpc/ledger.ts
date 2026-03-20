/**
 * Ledger-related RPC types
 */

// ============ RPC Response Types ============

/** Response from chain/successors */
export interface ChainRPCResponse {
	blocks: string[];
}

/** Response from frontiers */
export interface FrontiersRPCResponse {
	frontiers: Record<string, string>;
}

/** Response from frontier_count */
export interface FrontierCountRPCResponse {
	count: string;
}

/** Response from unopened */
export interface UnopenedRPCResponse {
	accounts: Record<string, string>;
}

/** Raw RPC response from ledger */
export interface LedgerRPCResponse {
	accounts: Record<
		string,
		{
			frontier: string;
			open_block: string;
			representative_block: string;
			balance: string;
			modified_timestamp: string;
			block_count: string;
			representative?: string;
			weight?: string;
			pending?: string;
			receivable?: string;
		}
	>;
}

// ============ Options Types ============

/** Options for chain RPC call */
export interface ChainOptions {
	/** Number of blocks to skip from start (v18.0+) */
	offset?: number;
	/** Return from open block to frontier instead of frontier to open (v18.0+) */
	reverse?: boolean;
}

/** Options for ledger RPC call */
export interface LedgerOptions {
	/** Number of accounts to return (ignored if sorting is true) */
	count?: number;
	/** Include representative for each account (default false) */
	representative?: boolean;
	/** Include voting weight for each account (default false) */
	weight?: boolean;
	/** Include receivable balance for each account (default false) */
	receivable?: boolean;
	/** Return only accounts modified after this UNIX timestamp (v11.0+, default 0) */
	modifiedSince?: number;
	/** Sort accounts by balance in descending order (default false). Note: count is ignored if sorting is true */
	sorting?: boolean;
	/** Return only accounts with balance above this threshold in raw (v19.0+, default 0). If receivable is also given, compares sum of balance and receivable. */
	threshold?: string;
}

/** Options for successors RPC call */
export interface SuccessorsOptions {
	/** Number of blocks to skip from start (v18.0+) */
	offset?: number;
	/** Return from frontier to open block instead of open to frontier (v18.0+) */
	reverse?: boolean;
}
