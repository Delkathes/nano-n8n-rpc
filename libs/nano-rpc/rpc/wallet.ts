import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  WalletBalancesRPCResponse,
  WalletInfoRPCResponse,
  WalletHistoryRPCResponse,
  WalletLedgerRPCResponse,
  WalletReceivableRPCResponse,
  CreateAccountOptions,
  AccountRepresentativeSetOptions,
  AccountsCreateOptions,
  WalletAddOptions,
  WalletLedgerOptions,
  WalletReceivableOptions,
  AccountCreateRPCResponse,
  AccountListRPCResponse,
  AccountMoveRPCResponse,
  AccountRemoveRPCResponse,
  AccountRepresentativeSetRPCResponse,
  AccountsCreateRPCResponse,
  PasswordChangeRPCResponse,
  PasswordEnterRPCResponse,
  PasswordValidRPCResponse,
  ReceiveMinimumRPCResponse,
  ReceiveMinimumSetRPCResponse,
  SearchReceivableRPCResponse,
  WalletAddRPCResponse,
  WalletAddWatchRPCResponse,
  WalletChangeSeedRPCResponse,
  WalletContainsRPCResponse,
  WalletCreateRPCResponse,
  WalletDestroyRPCResponse,
  WalletExportRPCResponse,
  WalletFrontiersRPCResponse,
  WalletLockRPCResponse,
  WalletLockedRPCResponse,
  WalletRepresentativeRPCResponse,
  WalletRepresentativeSetRPCResponse,
  WalletRepublishRPCResponse,
  WalletWorkGetRPCResponse,
  WorkGetRPCResponse,
  WorkSetRPCResponse,
} from '../../../types/rpc';

/**
 * Create new account in wallet
 */
export async function createAccount(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  options: CreateAccountOptions = {}
): Promise<AccountCreateRPCResponse> {
  const params: Record<string, unknown> = { wallet };

  // Add index if specified (v18.0+)
  if (options.index !== undefined) {
    params.index = options.index.toString();
  }

  // Only send work=false when explicitly disabled (default is true)
  if (options.work === false) {
    params.work = false;
  }

  return await nanoRPCCall<AccountCreateRPCResponse>(context, config, 'account_create', params);
}

/**
 * List accounts in wallet
 */
export async function listAccounts(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
): Promise<AccountListRPCResponse> {
  return await nanoRPCCall<AccountListRPCResponse>(context, config, 'account_list', { wallet });
}

/**
 * Move accounts from one wallet to another
 */
export async function accountMove(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  source: string,
  wallet: string,
  accounts: string[]
): Promise<AccountMoveRPCResponse> {
  return await nanoRPCCall<AccountMoveRPCResponse>(context, config, 'account_move', { wallet, source, accounts });
}

/**
 * Remove an account from a wallet
 */
export async function accountRemove(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string
): Promise<AccountRemoveRPCResponse> {
  return await nanoRPCCall<AccountRemoveRPCResponse>(context, config, 'account_remove', { wallet, account });
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
): Promise<AccountRepresentativeSetRPCResponse> {
  const params: Record<string, unknown> = {
    wallet,
    account,
    representative,
  };

  // Add work if specified (v9.0+)
  if (options.work !== undefined) {
    params.work = options.work;
  }

  return await nanoRPCCall<AccountRepresentativeSetRPCResponse>(context, config, 'account_representative_set', params);
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
): Promise<AccountsCreateRPCResponse> {
  const params: Record<string, unknown> = { wallet, count };

  // Only send work=true when explicitly enabled (default is false in v11.2+)
  if (options.work === true) {
    params.work = true;
  }

  return await nanoRPCCall<AccountsCreateRPCResponse>(context, config, 'accounts_create', params);
}

/**
 * Change wallet password
 */
export async function passwordChange(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  password: string
): Promise<PasswordChangeRPCResponse> {
  return await nanoRPCCall<PasswordChangeRPCResponse>(context, config, 'password_change', { wallet, password });
}

/**
 * Enter wallet password to unlock
 */
export async function passwordEnter(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  password: string
): Promise<PasswordEnterRPCResponse> {
  return await nanoRPCCall<PasswordEnterRPCResponse>(context, config, 'password_enter', { wallet, password });
}

/**
 * Check if wallet password is valid
 */
export async function passwordValid(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<PasswordValidRPCResponse> {
  return await nanoRPCCall<PasswordValidRPCResponse>(context, config, 'password_valid', { wallet });
}

/**
 * Get the minimum receive threshold
 */
export async function receiveMinimum(context: IExecuteFunctions, config: INanoRPCConfig): Promise<ReceiveMinimumRPCResponse> {
  return await nanoRPCCall<ReceiveMinimumRPCResponse>(context, config, 'receive_minimum', {});
}

/**
 * Set the minimum receive threshold
 */
export async function receiveMinimumSet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  amount: string
): Promise<ReceiveMinimumSetRPCResponse> {
  return await nanoRPCCall<ReceiveMinimumSetRPCResponse>(context, config, 'receive_minimum_set', { amount });
}

/**
 * Search receivable blocks for a wallet
 */
export async function searchReceivable(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<SearchReceivableRPCResponse> {
  return await nanoRPCCall<SearchReceivableRPCResponse>(context, config, 'search_receivable', { wallet });
}

/**
 * Search receivable blocks for all wallets
 */
export async function searchReceivableAll(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
): Promise<SearchReceivableRPCResponse> {
  return await nanoRPCCall<SearchReceivableRPCResponse>(context, config, 'search_receivable_all', {});
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
): Promise<WalletAddRPCResponse> {
  const params: Record<string, unknown> = { wallet, key };

  // Only send work=false when explicitly disabled (default is true)
  if (options.work === false) {
    params.work = false;
  }

  return await nanoRPCCall<WalletAddRPCResponse>(context, config, 'wallet_add', params);
}

/**
 * Add watch-only accounts to a wallet
 */
export async function walletAddWatch(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  accounts: string[]
): Promise<WalletAddWatchRPCResponse> {
  return await nanoRPCCall<WalletAddWatchRPCResponse>(context, config, 'wallet_add_watch', { wallet, accounts });
}

/**
 * Get balances for all accounts in a wallet
 */
export async function walletBalances(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  threshold?: string
): Promise<WalletBalancesRPCResponse> {
  return await nanoRPCCall<WalletBalancesRPCResponse>(context, config, 'wallet_balances', { wallet, threshold });
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
): Promise<WalletChangeSeedRPCResponse> {
  return await nanoRPCCall<WalletChangeSeedRPCResponse>(
    context, config, 'wallet_change_seed', { wallet, seed, count }
  );
}

/**
 * Check if a wallet contains an account
 */
export async function walletContains(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string
): Promise<WalletContainsRPCResponse> {
  return await nanoRPCCall<WalletContainsRPCResponse>(context, config, 'wallet_contains', { wallet, account });
}

/**
 * Create a new wallet
 */
export async function walletCreate(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  seed?: string
): Promise<WalletCreateRPCResponse> {
  return await nanoRPCCall<WalletCreateRPCResponse>(
    context, config, 'wallet_create', { seed }
  );
}

/**
 * Destroy a wallet
 */
export async function walletDestroy(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletDestroyRPCResponse> {
  return await nanoRPCCall<WalletDestroyRPCResponse>(context, config, 'wallet_destroy', { wallet });
}

/**
 * Export wallet as JSON
 */
export async function walletExport(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletExportRPCResponse> {
  return await nanoRPCCall<WalletExportRPCResponse>(context, config, 'wallet_export', { wallet });
}

/**
 * Get frontiers for all accounts in a wallet
 */
export async function walletFrontiers(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletFrontiersRPCResponse> {
  return await nanoRPCCall<WalletFrontiersRPCResponse>(context, config, 'wallet_frontiers', { wallet });
}

/**
 * Get transaction history for a wallet
 */
export async function walletHistory(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  modifiedSince?: number
): Promise<WalletHistoryRPCResponse> {
  return await nanoRPCCall<WalletHistoryRPCResponse>(context, config, 'wallet_history', {
    wallet,
    modified_since: modifiedSince,
  });
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
 * Get ledger for all accounts in a wallet
 */
export async function walletLedger(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  options: WalletLedgerOptions = {}
): Promise<WalletLedgerRPCResponse> {
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

  return await nanoRPCCall<WalletLedgerRPCResponse>(context, config, 'wallet_ledger', params);
}

/**
 * Lock a wallet
 */
export async function walletLock(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletLockRPCResponse> {
  return await nanoRPCCall<WalletLockRPCResponse>(context, config, 'wallet_lock', { wallet });
}

/**
 * Check if a wallet is locked
 */
export async function walletLocked(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletLockedRPCResponse> {
  return await nanoRPCCall<WalletLockedRPCResponse>(context, config, 'wallet_locked', { wallet });
}

/**
 * Get receivable blocks for a wallet
 */
export async function walletReceivable(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  options: WalletReceivableOptions = {}
): Promise<WalletReceivableRPCResponse> {
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
  if (options.includeOnlyConfirmed !== undefined) {
    params.include_only_confirmed = options.includeOnlyConfirmed;
  }

  return await nanoRPCCall<WalletReceivableRPCResponse>(context, config, 'wallet_receivable', params);
}

/**
 * Get wallet representative
 */
export async function walletRepresentative(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletRepresentativeRPCResponse> {
  return await nanoRPCCall<WalletRepresentativeRPCResponse>(context, config, 'wallet_representative', { wallet });
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
): Promise<WalletRepresentativeSetRPCResponse> {
  return await nanoRPCCall<WalletRepresentativeSetRPCResponse>(context, config, 'wallet_representative_set', {
    wallet,
    representative,
    update_existing_accounts: updateExisting,
  });
}

/**
 * Republish blocks for accounts in a wallet
 */
export async function walletRepublish(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  count?: number
): Promise<WalletRepublishRPCResponse> {
  return await nanoRPCCall<WalletRepublishRPCResponse>(context, config, 'wallet_republish', { wallet, count });
}

/**
 * Get cached work for a wallet account
 */
export async function walletWorkGet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string
): Promise<WalletWorkGetRPCResponse> {
  return await nanoRPCCall<WalletWorkGetRPCResponse>(context, config, 'wallet_work_get', { wallet });
}

/**
 * Get cached work for an account
 */
export async function workGet(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  wallet: string,
  account: string
): Promise<WorkGetRPCResponse> {
  return await nanoRPCCall<WorkGetRPCResponse>(context, config, 'work_get', { wallet, account });
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
): Promise<WorkSetRPCResponse> {
  return await nanoRPCCall<WorkSetRPCResponse>(context, config, 'work_set', { wallet, account, work });
}
