import type { IExecuteFunctions } from 'n8n-workflow';
import { INanoRPCConfig, nanoRPCCall } from './core';
import type {
  WalletBalancesRPCResponse,
  WalletInfoRPCResponse,
  WalletHistoryRPCResponse,
  WalletLedgerRPCResponse,
  WalletReceivableRPCResponse,
} from '../../nodes/Nano/types';

/**
 * Options for account creation
 */
export interface CreateAccountOptions {
  /** Index to create account for (v18.0+), starting with 0 */
  index?: number;
  /** Generate work after creating account (v9.0+), true by default */
  work?: boolean;
}

/**
 * Create new account in wallet
 */
export async function createAccount(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  options: CreateAccountOptions = {}
): Promise<string> {
  const params: Record<string, unknown> = { wallet };

  // Add index if specified (v18.0+)
  if (options.index !== undefined) {
    params.index = options.index.toString();
  }

  // Only send work=false when explicitly disabled (default is true)
  if (options.work === false) {
    params.work = 'false';
  }

  const response = await nanoRPCCall<{ account: string }>(context, config, 'account_create', params);
  return response.account;
}

/**
 * List accounts in wallet
 */
export async function listAccounts(context: IExecuteFunctions, config: INanoRPCConfig, wallet: string): Promise<string[]> {
  const response = await nanoRPCCall<{ accounts: string[] }>(context, config, 'account_list', { wallet });
  return response.accounts;
}

/**
 * Move accounts from one wallet to another
 */
export async function accountMove(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  source: string,
  accounts: string[]
): Promise<number> {
  const response = await nanoRPCCall<{ moved: string }>(context, config, 'account_move', { wallet, source, accounts });
  return parseInt(response.moved);
}

/**
 * Remove an account from a wallet
 */
export async function accountRemove(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ removed: string }>(context, config, 'account_remove', { wallet, account });
  return response.removed === '1';
}

/**
 * Options for account representative set
 */
export interface AccountRepresentativeSetOptions {
  /** Work value (16 hex digits) from external source (v9.0+) */
  work?: string;
}

/**
 * Set the representative for an account in a wallet
 */
export async function accountRepresentativeSet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string,
  representative: string,
  options: AccountRepresentativeSetOptions = {}
): Promise<string> {
  const params: Record<string, unknown> = {
    wallet,
    account,
    representative,
  };

  // Add work if specified (v9.0+)
  if (options.work !== undefined) {
    params.work = options.work;
  }

  const response = await nanoRPCCall<{ block: string }>(context, config, 'account_representative_set', params);
  return response.block;
}

/**
 * Options for multiple accounts creation
 */
export interface AccountsCreateOptions {
  /** Enable work generation after creating accounts (v11.2+, false by default) */
  work?: boolean;
}

/**
 * Create multiple accounts in a wallet
 */
export async function accountsCreate(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  count: number,
  options: AccountsCreateOptions = {}
): Promise<string[]> {
  const params: Record<string, unknown> = { wallet, count };

  // Only send work=true when explicitly enabled (default is false in v11.2+)
  if (options.work === true) {
    params.work = 'true';
  }

  const response = await nanoRPCCall<{ accounts: string[] }>(context, config, 'accounts_create', params);
  return response.accounts;
}

/**
 * Change wallet password
 */
export async function passwordChange(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  password: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ changed: string }>(context, config, 'password_change', { wallet, password });
  return response.changed === '1';
}

/**
 * Enter wallet password to unlock
 */
export async function passwordEnter(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  password: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ valid: string }>(context, config, 'password_enter', { wallet, password });
  return response.valid === '1';
}

/**
 * Check if wallet password is valid
 */
export async function passwordValid(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ valid: string }>(context, config, 'password_valid', { wallet });
  return response.valid === '1';
}

/**
 * Get the minimum receive threshold
 */
export async function receiveMinimum(context: IExecuteFunctions, config: INanoRPCConfig): Promise<string> {
  const response = await nanoRPCCall<{ amount: string }>(context, config, 'receive_minimum', {});
  return response.amount;
}

/**
 * Set the minimum receive threshold
 */
export async function receiveMinimumSet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  amount: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ success: string }>(context, config, 'receive_minimum_set', { amount });
  return response.success === '';
}

/**
 * Search pending blocks for a wallet (deprecated - use searchReceivable)
 */
export async function searchPending(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ started: string }>(context, config, 'search_pending', { wallet });
  return response.started === '1';
}

/**
 * Search receivable blocks for a wallet
 */
export async function searchReceivable(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ started: string }>(context, config, 'search_receivable', { wallet });
  return response.started === '1';
}

/**
 * Search pending blocks for all wallets (deprecated - use searchReceivableAll)
 */
export async function searchPendingAll(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  const response = await nanoRPCCall<{ success: string }>(context, config, 'search_pending_all', {});
  return response.success === '';
}

/**
 * Search receivable blocks for all wallets
 */
export async function searchReceivableAll(context: IExecuteFunctions, config: INanoRPCConfig): Promise<boolean> {
  const response = await nanoRPCCall<{ success: string }>(context, config, 'search_receivable_all', {});
  return response.success === '';
}

/**
 * Options for wallet add
 */
export interface WalletAddOptions {
  /** Disable work generation after adding account (v9.0+, false by default) */
  work?: boolean;
}

/**
 * Add an existing private key to a wallet
 */
export async function walletAdd(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  key: string,
  options: WalletAddOptions = {}
): Promise<string> {
  const params: Record<string, unknown> = { wallet, key };

  // Only send work=false when explicitly disabled (default is true)
  if (options.work === false) {
    params.work = 'false';
  }

  const response = await nanoRPCCall<{ account: string }>(context, config, 'wallet_add', params);
  return response.account;
}

/**
 * Add watch-only accounts to a wallet
 */
export async function walletAddWatch(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  accounts: string[]
): Promise<boolean> {
  const response = await nanoRPCCall<{ success: string }>(context, config, 'wallet_add_watch', { wallet, accounts });
  return response.success === '';
}

/**
 * Get balances for all accounts in a wallet
 */
export async function walletBalances(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  threshold?: string
): Promise<WalletBalancesRPCResponse['balances']> {
  const response = await nanoRPCCall<WalletBalancesRPCResponse>(context, config, 'wallet_balances', { wallet, threshold });
  return response.balances;
}

/**
 * Change the seed for a wallet
 */
export async function walletChangeSeed(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  seed: string,
  count?: number
): Promise<{ success: boolean; last_restored_account: string; restored_count: number }> {
  const response = await nanoRPCCall<{ success: string; last_restored_account: string; restored_count: string }>(
    context, config, 'wallet_change_seed', { wallet, seed, count }
  );
  return {
    success: response.success === '',
    last_restored_account: response.last_restored_account,
    restored_count: parseInt(response.restored_count || '0'),
  };
}

/**
 * Check if a wallet contains an account
 */
export async function walletContains(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ exists: string }>(context, config, 'wallet_contains', { wallet, account });
  return response.exists === '1';
}

/**
 * Create a new wallet
 */
export async function walletCreate(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  seed?: string
): Promise<{ wallet: string; last_restored_account?: string; restored_count?: number }> {
  const response = await nanoRPCCall<{ wallet: string; last_restored_account?: string; restored_count?: string }>(
    context, config, 'wallet_create', { seed }
  );
  return {
    wallet: response.wallet,
    last_restored_account: response.last_restored_account,
    restored_count: response.restored_count ? parseInt(response.restored_count) : undefined,
  };
}

/**
 * Destroy a wallet
 */
export async function walletDestroy(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ destroyed: string }>(context, config, 'wallet_destroy', { wallet });
  return response.destroyed === '1';
}

/**
 * Export wallet as JSON
 */
export async function walletExport(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<string> {
  const response = await nanoRPCCall<{ json: string }>(context, config, 'wallet_export', { wallet });
  return response.json;
}

/**
 * Get frontiers for all accounts in a wallet
 */
export async function walletFrontiers(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<Record<string, string>> {
  const response = await nanoRPCCall<{ frontiers: Record<string, string> }>(context, config, 'wallet_frontiers', { wallet });
  return response.frontiers;
}

/**
 * Get transaction history for a wallet
 */
export async function walletHistory(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  modifiedSince?: number
): Promise<WalletHistoryRPCResponse['history']> {
  const response = await nanoRPCCall<WalletHistoryRPCResponse>(context, config, 'wallet_history', {
    wallet,
    modified_since: modifiedSince,
  });
  return response.history;
}

/**
 * Get wallet info including balance sum
 */
export async function walletInfo(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletInfoRPCResponse> {
  return await nanoRPCCall<WalletInfoRPCResponse>(context, config, 'wallet_info', { wallet });
}

/**
 * Options for wallet ledger
 */
export interface WalletLedgerOptions {
  /** Include representative for each account */
  representative?: boolean;
  /** Include voting weight for each account */
  weight?: boolean;
  /** Include receivable balance for each account (use receivable instead of deprecated pending) */
  receivable?: boolean;
  /** Return only accounts modified after this UNIX timestamp */
  modifiedSince?: number;
}

/**
 * Get ledger for all accounts in a wallet
 */
export async function walletLedger(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  options: WalletLedgerOptions = {}
): Promise<WalletLedgerRPCResponse['accounts']> {
  const params: Record<string, unknown> = { wallet };

  if (options.representative !== undefined) {
    params.representative = options.representative;
  }
  if (options.weight !== undefined) {
    params.weight = options.weight;
  }
  if (options.receivable !== undefined) {
    params.receivable = options.receivable;
  }
  if (options.modifiedSince !== undefined) {
    params.modified_since = options.modifiedSince;
  }

  const response = await nanoRPCCall<WalletLedgerRPCResponse>(context, config, 'wallet_ledger', params);
  return response.accounts;
}

/**
 * Lock a wallet
 */
export async function walletLock(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ locked: string }>(context, config, 'wallet_lock', { wallet });
  return response.locked === '1';
}

/**
 * Check if a wallet is locked
 */
export async function walletLocked(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ locked: string }>(context, config, 'wallet_locked', { wallet });
  return response.locked === '1';
}

/**
 * Options for wallet receivable
 */
export interface WalletReceivableOptions {
  /** Number of receivable blocks to return */
  count?: number;
  /** Minimum amount threshold (128-bit decimal) */
  threshold?: string;
  /** Include source account information (v9.0+) */
  source?: boolean;
  /** Include active blocks without finished confirmations (v15.0+) */
  includeActive?: boolean;
  /** Returns minimum version (epoch) of block that can pocket this (v15.0+) */
  minVersion?: boolean;
  /** Only return confirmed blocks (v19.0+, default true in v22.0+) */
  includeOnlyConfirmed?: boolean;
}

/**
 * Get receivable blocks for a wallet
 */
export async function walletReceivable(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  options: WalletReceivableOptions = {}
): Promise<WalletReceivableRPCResponse['blocks']> {
  const params: Record<string, unknown> = { wallet };

  if (options.count !== undefined) {
    params.count = options.count;
  }
  if (options.threshold !== undefined) {
    params.threshold = options.threshold;
  }
  if (options.source !== undefined) {
    params.source = options.source;
  }
  if (options.includeActive !== undefined) {
    params.include_active = options.includeActive;
  }
  if (options.minVersion !== undefined) {
    params.min_version = options.minVersion;
  }
  if (options.includeOnlyConfirmed !== undefined) {
    params.include_only_confirmed = options.includeOnlyConfirmed;
  }

  const response = await nanoRPCCall<WalletReceivableRPCResponse>(context, config, 'wallet_receivable', params);
  return response.blocks;
}

/**
 * Get wallet representative
 */
export async function walletRepresentative(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<string> {
  const response = await nanoRPCCall<{ representative: string }>(context, config, 'wallet_representative', { wallet });
  return response.representative;
}

/**
 * Set wallet representative for all accounts
 */
export async function walletRepresentativeSet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  representative: string,
  updateExisting?: boolean
): Promise<boolean> {
  const response = await nanoRPCCall<{ set: string }>(context, config, 'wallet_representative_set', {
    wallet,
    representative,
    update_existing_accounts: updateExisting,
  });
  return response.set === '1';
}

/**
 * Republish blocks for accounts in a wallet
 */
export async function walletRepublish(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  count?: number
): Promise<string[]> {
  const response = await nanoRPCCall<{ blocks: string[] }>(context, config, 'wallet_republish', { wallet, count });
  return response.blocks;
}

/**
 * Get cached work for a wallet account
 */
export async function walletWorkGet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<Record<string, string>> {
  const response = await nanoRPCCall<{ works: Record<string, string> }>(context, config, 'wallet_work_get', { wallet });
  return response.works;
}

/**
 * Get cached work for an account
 */
export async function workGet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string
): Promise<string> {
  const response = await nanoRPCCall<{ work: string }>(context, config, 'work_get', { wallet, account });
  return response.work;
}

/**
 * Set cached work for an account
 */
export async function workSet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string,
  work: string
): Promise<boolean> {
  const response = await nanoRPCCall<{ success: string }>(context, config, 'work_set', { wallet, account, work });
  return response.success === '';
}
