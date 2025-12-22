/**
 * Node Response Types
 * 
 * These types represent the transformed/formatted responses
 * returned by the n8n Nano node after processing RPC responses.
 * They are designed for end-user consumption in n8n workflows.
 */

// ============ Account Responses ============

export interface BalanceResponse {
  account: string;
  balance: string;
  balanceRaw: string;
  pending: string;
  pendingRaw: string;
  balanceFormatted: string;
  pendingFormatted: string;
  [key: string]: unknown;
}

export interface AccountInfoResponse {
  account: string;
  balance: string;
  balanceRaw: string;
  blockCount: string;
  representative: string;
  weight: string;
  pending: string;
  pendingRaw: string;
  [key: string]: unknown;
}

export interface AccountBlockCountResponse {
  account: string;
  blockCount: number;
  [key: string]: unknown;
}

export interface AccountKeyResponse {
  account: string;
  publicKey: string;
  [key: string]: unknown;
}

export interface AccountRepresentativeResponse {
  account: string;
  representative: string;
  [key: string]: unknown;
}

export interface AccountWeightResponse {
  account: string;
  weight: string;
  weightFormatted: string;
  [key: string]: unknown;
}

export interface HistoryTransaction {
  type: string;
  account: string;
  amount: string;
  amountRaw: string;
  hash: string;
  localTimestamp: string;
  [key: string]: unknown;
}

export interface HistoryResponse {
  account: string;
  history: HistoryTransaction[];
  previous?: string;
  [key: string]: unknown;
}

export interface GetAccountsBalancesResponse {
  balances: Record<string, { balance: string; pending: string }>;
  [key: string]: unknown;
}

export interface GetAccountFromPublicKeyResponse {
  publicKey: string;
  account: string;
  [key: string]: unknown;
}

export interface GetAccountsFrontiersResponse {
  accounts: string[];
  frontiers: Record<string, string>;
  [key: string]: unknown;
}

export interface GetAccountsReceivableResponse {
  accounts: string[];
  receivable: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetAccountsRepresentativesResponse {
  accounts: string[];
  representatives: Record<string, string>;
  [key: string]: unknown;
}

export interface ValidateResponse {
  address: string;
  valid: boolean;
  [key: string]: unknown;
}

// ============ Block Responses ============

export interface BlockInfoResponse {
  hash: string;
  amount?: string;
  balance?: string;
  [key: string]: unknown;
}

export interface BlockAccountResponse {
  blockHash: string;
  account: string;
  [key: string]: unknown;
}

export interface BlockCountResponse {
  count: string;
  unchecked: string;
  [key: string]: unknown;
}

export interface ConfirmBlockResponse {
  success: boolean;
  hash: string;
  [key: string]: unknown;
}

export interface GetBlocksResponse {
  blocks: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetBlocksInfoResponse {
  blocks: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CreateBlockResponse {
  success: boolean;
  blockType: string;
  block: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetBlockHashResponse {
  hash: string;
  block: Record<string, unknown>;
  [key: string]: unknown;
}

// ============ Transaction Responses ============

export interface SendPaymentResponse {
  success: boolean;
  blockHash: string;
  destination: string;
  amount: number;
  amountRaw: string;
  source: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface ReceiveResponse {
  success: boolean;
  receivingAccount: string;
  receivedBlockHash: string;
  originalBlockHash: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface PendingBlock {
  hash: string;
  amount: string;
  amountRaw: string;
  source: string;
  [key: string]: unknown;
}

export interface PendingResponse {
  account: string;
  pendingCount: number;
  pendingBlocks: PendingBlock[];
  [key: string]: unknown;
}

export interface ReceivableResponse {
  account: string;
  receivable: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ReceivableExistsResponse {
  hash: string;
  exists: boolean;
  [key: string]: unknown;
}

export interface ProcessBlockResponse {
  success: boolean;
  hash: string;
  subtype: string;
  [key: string]: unknown;
}

export interface EpochUpgradeResponse {
  success: boolean;
  epoch: number;
  count: number;
  result: unknown;
  [key: string]: unknown;
}

// ============ Wallet Responses ============

export interface CreateAccountResponse {
  success: boolean;
  account: string;
  wallet: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface ListAccountsResponse {
  wallet: string;
  accountCount: number;
  accounts: string[];
  [key: string]: unknown;
}

export interface AccountMoveResponse {
  success: boolean;
  moved: number;
  [key: string]: unknown;
}

export interface AccountRemoveResponse {
  success: boolean;
  removed: boolean;
  [key: string]: unknown;
}

export interface AccountRepresentativeSetResponse {
  success: boolean;
  block: string;
  [key: string]: unknown;
}

export interface AccountsCreateResponse {
  success: boolean;
  accounts: string[];
  [key: string]: unknown;
}

export interface PasswordChangeResponse {
  success: boolean;
  changed: boolean;
  [key: string]: unknown;
}

export interface PasswordEnterResponse {
  success: boolean;
  valid: boolean;
  [key: string]: unknown;
}

export interface PasswordValidResponse {
  valid: boolean;
  [key: string]: unknown;
}

export interface ReceiveMinimumResponse {
  amount: string;
  amountFormatted: string;
  [key: string]: unknown;
}

export interface ReceiveMinimumSetResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface SearchReceivableResponse {
  success: boolean;
  started: boolean;
  [key: string]: unknown;
}

export interface SearchReceivableAllResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface WalletAddResponse {
  success: boolean;
  account: string;
  [key: string]: unknown;
}

export interface WalletAddWatchResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface WalletBalancesResponse {
  wallet: string;
  balances: Record<string, { balance: string; pending: string }>;
  [key: string]: unknown;
}

export interface WalletChangeSeedResponse {
  success: boolean;
  lastRestoredAccount: string;
  restoredCount: number;
  [key: string]: unknown;
}

export interface WalletContainsResponse {
  wallet: string;
  account: string;
  exists: boolean;
  [key: string]: unknown;
}

export interface WalletCreateResponse {
  success: boolean;
  wallet: string;
  lastRestoredAccount?: string;
  restoredCount?: number;
  [key: string]: unknown;
}

export interface WalletDestroyResponse {
  success: boolean;
  destroyed: boolean;
  [key: string]: unknown;
}

export interface WalletExportResponse {
  wallet: string;
  json: string;
  [key: string]: unknown;
}

export interface WalletFrontiersResponse {
  wallet: string;
  frontiers: Record<string, string>;
  [key: string]: unknown;
}

export interface WalletHistoryResponse {
  wallet: string;
  history: Array<{
    type: string;
    account: string;
    amount: string;
    block_account: string;
    hash: string;
    local_timestamp: string;
  }>;
  [key: string]: unknown;
}

export interface WalletInfoResponse {
  wallet: string;
  balance: string;
  pending: string;
  accountsCount: number;
  adhocCount: number;
  deterministicCount: number;
  deterministicIndex: number;
  [key: string]: unknown;
}

export interface WalletLedgerResponse {
  wallet: string;
  accounts: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WalletLockResponse {
  success: boolean;
  locked: boolean;
  [key: string]: unknown;
}

export interface WalletLockedResponse {
  wallet: string;
  locked: boolean;
  [key: string]: unknown;
}

export interface WalletPendingResponse {
  wallet: string;
  blocks: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WalletReceivableResponse {
  wallet: string;
  blocks: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WalletRepresentativeResponse {
  wallet: string;
  representative: string;
  [key: string]: unknown;
}

export interface WalletRepresentativeSetResponse {
  success: boolean;
  set: boolean;
  [key: string]: unknown;
}

export interface WalletRepublishResponse {
  success: boolean;
  blocks: string[];
  [key: string]: unknown;
}

export interface WalletWorkGetResponse {
  wallet: string;
  works: Record<string, string>;
  [key: string]: unknown;
}

export interface WorkGetResponse {
  wallet: string;
  account: string;
  work: string;
  [key: string]: unknown;
}

export interface WorkSetResponse {
  success: boolean;
  [key: string]: unknown;
}

// ============ Network Responses ============

export interface GetAvailableSupplyResponse {
  availableSupply: string;
  availableSupplyRaw: string;
  [key: string]: unknown;
}

export interface KeepaliveResponse {
  success: boolean;
  address: string;
  port: number;
  [key: string]: unknown;
}

export interface GetNodeIdResponse {
  nodeId: string;
  [key: string]: unknown;
}

export interface GetPeersResponse {
  peers: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PopulateBacklogResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface GetRepresentativesResponse {
  representatives: Record<string, string>;
  [key: string]: unknown;
}

export interface RepresentativesOnlineResponse {
  representatives: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RepublishResponse {
  success: boolean;
  hash: string;
  count: number;
  sources: number;
  destinations: number;
  result: unknown;
  [key: string]: unknown;
}

export interface GetTelemetryResponse {
  block_count?: string;
  cemented_count?: string;
  unchecked_count?: string;
  account_count?: string;
  bandwidth_cap?: string;
  peer_count?: string;
  protocol_version?: string;
  uptime?: string;
  genesis_block?: string;
  major_version?: string;
  minor_version?: string;
  patch_version?: string;
  pre_release_version?: string;
  maker?: string;
  timestamp?: string;
  active_difficulty?: string;
  [key: string]: unknown;
}

export interface VersionResponse {
  rpc_version: string;
  store_version: string;
  protocol_version: string;
  node_vendor: string;
  store_vendor?: string;
  network: string;
  network_identifier: string;
  build_info: string;
  [key: string]: unknown;
}

export interface GetUptimeResponse {
  seconds: number;
  [key: string]: unknown;
}

// ============ Ledger Responses ============

export interface GetChainResponse {
  startingBlock: string;
  chain: string[];
  [key: string]: unknown;
}

export interface GetFrontiersResponse {
  startingAccount: string;
  frontiers: Record<string, string>;
  [key: string]: unknown;
}

export interface GetFrontierCountResponse {
  count: string;
  [key: string]: unknown;
}

export interface GetLedgerResponse {
  startingAccount: string;
  accounts: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetSuccessorsResponse {
  startingBlock: string;
  successors: string[];
  [key: string]: unknown;
}

export interface GetUnopenedResponse {
  accounts: Record<string, unknown>;
  [key: string]: unknown;
}

// ============ Confirmation Responses ============

export interface GetConfirmationActiveResponse {
  confirmations: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetConfirmationHeightCurrentlyProcessingResponse {
  processing: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetConfirmationHistoryResponse {
  history: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetConfirmationInfoResponse {
  hash: string;
  announcements?: string;
  voters?: string;
  last_winner?: string;
  total_tally?: string;
  blocks?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetConfirmationQuorumResponse {
  quorum: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetElectionStatisticsResponse {
  statistics: Record<string, unknown>;
  [key: string]: unknown;
}

// ============ Work Responses ============

export interface GenerateWorkResponse {
  /** Hash used for work generation (v20.0+) */
  hash: string;
  /** Generated work value */
  work: string;
  /** Difficulty of the generated work (v19.0+) */
  difficulty: string;
  /** Multiplier from base difficulty (v19.0+) */
  multiplier: string;
  [key: string]: unknown;
}

export interface ValidateWorkResponse {
  work: string;
  hash: string;
  valid: boolean;
  difficulty: string;
  [key: string]: unknown;
}

export interface CancelWorkResponse {
  success: boolean;
  hash: string;
  [key: string]: unknown;
}

export interface AddWorkPeerResponse {
  success: boolean;
  address: string;
  port: number;
  [key: string]: unknown;
}

export interface GetWorkPeersResponse {
  workPeers: string[];
  [key: string]: unknown;
}

export interface ClearWorkPeersResponse {
  success: boolean;
  [key: string]: unknown;
}

// ============ Key Responses ============

export interface CreateKeyResponse {
  success: boolean;
  private: string;
  public: string;
  account: string;
  [key: string]: unknown;
}

export interface SignResponse {
  hash: string;
  signature: string;
  [key: string]: unknown;
}

export interface ExpandKeyResponse {
  privateKey: string;
  private: string;
  public: string;
  account: string;
  [key: string]: unknown;
}

export interface GetDeterministicKeyResponse {
  seed: string;
  index: number;
  private: string;
  public: string;
  account: string;
  [key: string]: unknown;
}

// ============ Representative Responses ============

export interface DelegatorsResponse {
  account: string;
  delegators: Record<string, string>;
  delegatorCount: number;
  [key: string]: unknown;
}

export interface DelegatorsCountResponse {
  account: string;
  delegatorCount: number;
  [key: string]: unknown;
}

// ============ Debug/Admin Responses ============

export interface BootstrapResponse {
  success: boolean;
  address: string;
  port: number;
  [key: string]: unknown;
}

export interface BootstrapAnyResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface BootstrapLazyResponse {
  success: boolean;
  hash: string;
  force: boolean;
  [key: string]: unknown;
}

export interface GetBootstrapPrioritiesResponse {
  priorities: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ResetBootstrapResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface GetBootstrapStatusResponse {
  status: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetDatabaseTxnTrackerResponse {
  tracker: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetStatsResponse {
  type: string;
  [key: string]: unknown;
}

export interface ClearStatsResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface StopNodeResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface GetUncheckedResponse {
  count: number;
  blocks: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ClearUncheckedResponse {
  success: boolean;
  [key: string]: unknown;
}

export interface GetUncheckedBlockResponse {
  hash: string;
  block: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetUncheckedKeysResponse {
  keys: Record<string, unknown>;
  [key: string]: unknown;
}

// ============ Conversion Responses ============

export interface NanoToRawRPCResponse {
  nano: string;
  raw: string;
  [key: string]: unknown;
}

export interface RawToNanoRPCResponse {
  raw: string;
  nano: string;
  [key: string]: unknown;
}

// ============ Union Type ============

/**
 * Union of all possible node operation responses.
 * Used for generic response handling in the Nano node.
 */
export type NanoOperationResponse =
  // Account responses
  | BalanceResponse
  | AccountInfoResponse
  | AccountBlockCountResponse
  | AccountKeyResponse
  | AccountRepresentativeResponse
  | AccountWeightResponse
  | HistoryResponse
  | GetAccountsBalancesResponse
  | GetAccountFromPublicKeyResponse
  | GetAccountsFrontiersResponse
  | GetAccountsReceivableResponse
  | GetAccountsRepresentativesResponse
  | ValidateResponse
  // Block responses
  | BlockInfoResponse
  | BlockAccountResponse
  | BlockCountResponse
  | ConfirmBlockResponse
  | GetBlocksResponse
  | GetBlocksInfoResponse
  | CreateBlockResponse
  | GetBlockHashResponse
  // Transaction responses
  | SendPaymentResponse
  | ReceiveResponse
  | PendingResponse
  | ReceivableResponse
  | ReceivableExistsResponse
  | ProcessBlockResponse
  | EpochUpgradeResponse
  // Wallet responses
  | CreateAccountResponse
  | ListAccountsResponse
  | AccountMoveResponse
  | AccountRemoveResponse
  | AccountRepresentativeSetResponse
  | AccountsCreateResponse
  | PasswordChangeResponse
  | PasswordEnterResponse
  | PasswordValidResponse
  | ReceiveMinimumResponse
  | ReceiveMinimumSetResponse
  | SearchReceivableResponse
  | SearchReceivableAllResponse
  | WalletAddResponse
  | WalletAddWatchResponse
  | WalletBalancesResponse
  | WalletChangeSeedResponse
  | WalletContainsResponse
  | WalletCreateResponse
  | WalletDestroyResponse
  | WalletExportResponse
  | WalletFrontiersResponse
  | WalletHistoryResponse
  | WalletInfoResponse
  | WalletLedgerResponse
  | WalletLockResponse
  | WalletLockedResponse
  | WalletPendingResponse
  | WalletReceivableResponse
  | WalletRepresentativeResponse
  | WalletRepresentativeSetResponse
  | WalletRepublishResponse
  | WalletWorkGetResponse
  | WorkGetResponse
  | WorkSetResponse
  // Network responses
  | GetAvailableSupplyResponse
  | KeepaliveResponse
  | GetNodeIdResponse
  | GetPeersResponse
  | PopulateBacklogResponse
  | GetRepresentativesResponse
  | RepresentativesOnlineResponse
  | RepublishResponse
  | GetTelemetryResponse
  | VersionResponse
  | GetUptimeResponse
  // Ledger responses
  | GetChainResponse
  | GetFrontiersResponse
  | GetFrontierCountResponse
  | GetLedgerResponse
  | GetSuccessorsResponse
  | GetUnopenedResponse
  // Confirmation responses
  | GetConfirmationActiveResponse
  | GetConfirmationHeightCurrentlyProcessingResponse
  | GetConfirmationHistoryResponse
  | GetConfirmationInfoResponse
  | GetConfirmationQuorumResponse
  | GetElectionStatisticsResponse
  // Work responses
  | GenerateWorkResponse
  | ValidateWorkResponse
  | CancelWorkResponse
  | AddWorkPeerResponse
  | GetWorkPeersResponse
  | ClearWorkPeersResponse
  // Key responses
  | CreateKeyResponse
  | SignResponse
  | ExpandKeyResponse
  | GetDeterministicKeyResponse
  // Representative responses
  | DelegatorsResponse
  | DelegatorsCountResponse
  // Debug/Admin responses
  | BootstrapResponse
  | BootstrapAnyResponse
  | BootstrapLazyResponse
  | GetBootstrapPrioritiesResponse
  | ResetBootstrapResponse
  | GetBootstrapStatusResponse
  | GetDatabaseTxnTrackerResponse
  | GetStatsResponse
  | ClearStatsResponse
  | StopNodeResponse
  | GetUncheckedResponse
  | ClearUncheckedResponse
  | GetUncheckedBlockResponse
  | GetUncheckedKeysResponse
  // Conversion responses
  | NanoToRawRPCResponse
  | RawToNanoRPCResponse;
