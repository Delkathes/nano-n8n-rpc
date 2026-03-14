import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  AccountBalanceRPCResponse,
  AccountBlockCountRPCResponse,
  AccountGetRPCResponse,
  AccountKeyRPCResponse,
  AccountRepresentativeRPCResponse,
  AccountWeightRPCResponse,
  AccountsBalancesRPCResponse,
  AccountsFrontiersRPCResponse,
  AccountsRepresentativesRPCResponse,
  ValidateAccountRPCResponse,
  AccountInfoRPCResponse,
  AccountHistoryRPCResponse,
  ReceivableRPCResponse,
  AccountInfoOptions,
  AccountHistoryOptions,
  AccountsBalancesOptions,
  AccountsReceivableOptions,
} from '../../../types/rpc';

/**
 * Get account balance
 * @param includeOnlyConfirmed - If true (default), only includes confirmed blocks/receivables. Set to false to include unconfirmed. (v22.0+)
 */
export async function getBalance(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  includeOnlyConfirmed?: boolean
): Promise<AccountBalanceRPCResponse> {
  const params: Record<string, unknown> = { account };

  // Only send the param if explicitly set to false (since true is the default)
  if (includeOnlyConfirmed === false) {
    params.include_only_confirmed = false;
  }

  return await nanoRPCCall<AccountBalanceRPCResponse>(
    context, config, 'account_balance', params
  );
}

/**
 * Get number of blocks for a specific account
 */
export async function getAccountBlockCount(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
): Promise<AccountBlockCountRPCResponse> {
  return await nanoRPCCall<AccountBlockCountRPCResponse>(context, config, 'account_block_count', { account });
}

/**
 * Get account number for the public key
 */
export async function getAccountFromPublicKey(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  key: string,
): Promise<AccountGetRPCResponse> {
  return await nanoRPCCall<AccountGetRPCResponse>(context, config, 'account_get', { key });
}

/**
 * Get account information
 */
export async function getAccountInfo(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  options?: AccountInfoOptions
): Promise<AccountInfoRPCResponse> {
  const params: Record<string, unknown> = {
    account,
  };

  // Default to true for these options (v9.0+)
  params.representative = options?.representative !== false;
  params.weight = options?.weight !== false;
  params.pending = options?.pending !== false;
  params.receivable = options?.receivable !== false;

  if (options?.includeConfirmed) {
    params.include_confirmed = true;
  }

  return await nanoRPCCall<AccountInfoRPCResponse>(context, config, 'account_info', params);
}

/**
 * Get the public key for an account
 */
export async function getAccountKey(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
): Promise<AccountKeyRPCResponse> {
  return await nanoRPCCall<AccountKeyRPCResponse>(context, config, 'account_key', { account });
}

/**
 * Get the representative for an account
 */
export async function getAccountRepresentative(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
): Promise<AccountRepresentativeRPCResponse> {
  return await nanoRPCCall<AccountRepresentativeRPCResponse>(context, config, 'account_representative', { account });
}

/**
 * Get voting weight for an account
 */
export async function getAccountWeight(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
): Promise<AccountWeightRPCResponse> {
  return await nanoRPCCall<AccountWeightRPCResponse>(context, config, 'account_weight', { account });
}

/**
 * Get account history
 */
export async function getAccountHistory(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
  count: number = 10,
  options?: AccountHistoryOptions
): Promise<AccountHistoryRPCResponse> {
  const params: Record<string, unknown> = {
    account,
    count,
  };

  // Default raw to true for detailed block info
  params.raw = options?.raw !== false;

  if (options?.head) {
    params.head = options.head;
  }
  if (options?.offset !== undefined && options.offset > 0) {
    params.offset = options.offset;
  }
  if (options?.reverse !== undefined) {
    params.reverse = options.reverse;
  }
  if (options?.accountFilter && options.accountFilter.length > 0) {
    params.account_filter = options.accountFilter;
  }
  if (options?.includeLinkedAccount !== undefined) {
    params.include_linked_account = options.includeLinkedAccount;
  }

  return await nanoRPCCall<AccountHistoryRPCResponse>(context, config, 'account_history', params);
}

/**
 * Get balances for multiple accounts
 * @param accounts - Array of account addresses
 * @param options - Optional parameters including includeOnlyConfirmed (v22.0+)
 */
export async function getAccountsBalances(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  accounts: string[],
  options?: AccountsBalancesOptions
): Promise<AccountsBalancesRPCResponse> {
  const params: Record<string, unknown> = { accounts };

  // Only send the param if explicitly set to false (since true is the default)
  if (options?.includeOnlyConfirmed === false) {
    params.include_only_confirmed = false;
  }

  return await nanoRPCCall<AccountsBalancesRPCResponse>(
    context, config, 'accounts_balances', params
  );
}

/**
 * Get frontier blocks for multiple accounts
 */
export async function getAccountsFrontiers(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  accounts: string[]
): Promise<AccountsFrontiersRPCResponse> {
  return await nanoRPCCall<AccountsFrontiersRPCResponse>(
    context, config, 'accounts_frontiers', { accounts }
  );
}

/**
 * Get receivable/pending transactions for multiple accounts
 * @param accounts - Array of account addresses
 * @param options - Optional parameters for filtering and pagination
 */
export async function getAccountsReceivable(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  accounts: string[],
  options?: AccountsReceivableOptions
): Promise<ReceivableRPCResponse> {
  const params: Record<string, unknown> = { accounts };

  if (options?.count !== undefined) {
    params.count = options.count;
  }
  if (options?.threshold !== undefined) {
    params.threshold = options.threshold;
  }
  if (options?.source) {
    params.source = true;
  }
  if (options?.sorting) {
    params.sorting = true;
  }
  if (options?.offset !== undefined && options.offset > 0) {
    params.offset = options.offset;
  }

  return await nanoRPCCall<ReceivableRPCResponse>(context, config, 'accounts_receivable', params);
}

/**
 * Get representatives for multiple accounts
 */
export async function getAccountsRepresentatives(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  accounts: string[]
): Promise<AccountsRepresentativesRPCResponse> {
  return await nanoRPCCall<AccountsRepresentativesRPCResponse>(
    context, config, 'accounts_representatives', { accounts }
  );
}

/**
 * Validate account address
 */
export async function validateAccount(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  account: string,
): Promise<ValidateAccountRPCResponse> {
  return await nanoRPCCall<ValidateAccountRPCResponse>(context, config, 'validate_account_number', { account });
}

