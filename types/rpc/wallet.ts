/**
 * Wallet-related RPC types
 */

// ============ RPC Response Types ============

/** Response from account_create */
export interface AccountCreateRPCResponse {
	account: string;
}

/** Response from account_list */
export interface AccountListRPCResponse {
	accounts: string[];
}

/** Response from account_move */
export interface AccountMoveRPCResponse {
	moved: string;
}

/** Response from account_remove */
export interface AccountRemoveRPCResponse {
	removed: string;
}

/** Response from account_representative_set */
export interface AccountRepresentativeSetRPCResponse {
	block: string;
}

/** Response from accounts_create */
export interface AccountsCreateRPCResponse {
	accounts: string[];
}

/** Response from password_change */
export interface PasswordChangeRPCResponse {
	changed: string;
}

/** Response from password_enter */
export interface PasswordEnterRPCResponse {
	valid: string;
}

/** Response from password_valid */
export interface PasswordValidRPCResponse {
	valid: string;
}

/** Response from receive_minimum */
export interface ReceiveMinimumRPCResponse {
	amount: string;
}

/** Response from receive_minimum_set */
export interface ReceiveMinimumSetRPCResponse {
	success: string;
}

/** Response from search_pending/search_receivable */
export interface SearchReceivableRPCResponse {
	started: string;
}

/** Response from wallet_add */
export interface WalletAddRPCResponse {
	account: string;
}

/** Response from wallet_add_watch */
export interface WalletAddWatchRPCResponse {
	success: string;
}

/** Raw RPC response from wallet_balances */
export interface WalletBalancesRPCResponse {
	balances: Record<
		string,
		{
			balance: string;
			pending: string;
			receivable: string;
		}
	>;
}

/** Raw RPC response from wallet_info */
export interface WalletInfoRPCResponse {
	balance: string;
	pending: string;
	receivable: string;
	accounts_count: string;
	adhoc_count: string;
	deterministic_count: string;
	deterministic_index: string;
	accounts_block_count: string;
	accounts_cemented_block_count: string;
}

/** Raw RPC response from wallet_history */
export interface WalletHistoryRPCResponse {
	history: Array<{
		type: string;
		account: string;
		amount: string;
		block_account: string;
		hash: string;
		local_timestamp: string;
	}>;
}

/** Raw RPC response from wallet_ledger */
export interface WalletLedgerRPCResponse {
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
		}
	>;
}

/** Raw RPC response from wallet_pending/wallet_receivable */
export interface WalletReceivableRPCResponse {
	blocks: Record<string, string[] | Record<string, { amount: string; source: string }>>;
}

/** Response from wallet_change_seed */
export interface WalletChangeSeedRPCResponse {
	success: string;
	last_restored_account: string;
	restored_count: string;
}

/** Response from wallet_contains */
export interface WalletContainsRPCResponse {
	exists: string;
}

/** Response from wallet_create */
export interface WalletCreateRPCResponse {
	wallet: string;
	last_restored_account?: string;
	restored_count?: string;
}

/** Response from wallet_destroy */
export interface WalletDestroyRPCResponse {
	destroyed: string;
}

/** Response from wallet_export */
export interface WalletExportRPCResponse {
	json: string;
}

/** Response from wallet_frontiers */
export interface WalletFrontiersRPCResponse {
	frontiers: Record<string, string>;
}

/** Response from wallet_lock */
export interface WalletLockRPCResponse {
	locked: string;
}

/** Response from wallet_locked */
export interface WalletLockedRPCResponse {
	locked: string;
}

/** Response from wallet_representative */
export interface WalletRepresentativeRPCResponse {
	representative: string;
}

/** Response from wallet_representative_set */
export interface WalletRepresentativeSetRPCResponse {
	set: string;
}

/** Response from wallet_republish */
export interface WalletRepublishRPCResponse {
	blocks: string[];
}

/** Response from wallet_work_get */
export interface WalletWorkGetRPCResponse {
	works: Record<string, string>;
}

/** Response from work_get */
export interface WorkGetRPCResponse {
	work: string;
}

/** Response from work_set */
export interface WorkSetRPCResponse {
	success: string;
}

// ============ Options Types ============

/** Options for account creation */
export interface CreateAccountOptions {
	/** Index to create account for (v18.0+), starting with 0 */
	index?: number;
	/** Generate work after creating account (v9.0+), true by default */
	work?: boolean;
}

/** Options for account representative set */
export interface AccountRepresentativeSetOptions {
	/** Work value (16 hex digits) from external source (v9.0+) */
	work?: string;
}

/** Options for multiple accounts creation */
export interface AccountsCreateOptions {
	/** Enable work generation after creating accounts (v11.2+, false by default) */
	work?: boolean;
}

/** Options for wallet add */
export interface WalletAddOptions {
	/** Disable work generation after adding account (v9.0+, false by default) */
	work?: boolean;
}

/** Options for wallet_ledger */
export interface WalletLedgerOptions {
	/** Include representative for each account (default false) */
	representative?: boolean;
	/** Include voting weight for each account (default false) */
	weight?: boolean;
	/** Include receivable balance for each account (default false) */
	receivable?: boolean;
	/** Return only accounts modified after this UNIX timestamp (v11.0+, default 0) */
	modifiedSince?: number;
}

/** Options for wallet_receivable */
export interface WalletReceivableOptions {
	/** Maximum number of blocks per account to return */
	count?: number;
	/** Minimum amount threshold in raw */
	threshold?: string;
	/** Include source account information */
	source?: boolean;
	/** Include active blocks without finished confirmations (v15.0+) */
	includeActive?: boolean;
	/** Only return confirmed blocks (v19.0+, default true in v22.0+) */
	includeOnlyConfirmed?: boolean;
}
