/**
 * Type definitions for Nano node operations
 */

// ============ Block Types (RPC-level) ============

/** State block structure (current standard) */
export interface StateBlock {
  type: 'state';
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account?: string;
  signature: string;
  work: string;
}

/** Block subtype for state blocks */
export type BlockSubtype = 'send' | 'receive' | 'open' | 'change' | 'epoch';

/** Parameters for creating a block via RPC */
export interface CreateBlockParams {
  type: 'state' | 'send' | 'receive' | 'change';
  balance?: string;
  key?: string;
  representative?: string;
  link?: string;
  previous?: string;
  wallet?: string;
  account?: string;
  source?: string;
  destination?: string;
  /** Work value (16 hex digits). Uses work from external source */
  work?: string;
  /** Return block contents as JSON object instead of string (v19.0+, default false) */
  json_block?: boolean;
  /** Work version string (v21.0+). Currently "work_1" is the only valid option */
  version?: string;
  /** Difficulty value (16 hex digits, v21.0+). Uses difficulty to generate work */
  difficulty?: string;
  [key: string]: string | boolean | undefined;
}

/** Generic block type for RPC responses */
export interface BlockContents {
  type: string;
  account: string;
  previous: string;
  representative: string;
  balance: string;
  link: string;
  link_as_account?: string;
  signature: string;
  work: string;
}

// ============ RPC Response Types ============

/** Raw RPC response from account_info */
export interface AccountInfoRPCResponse {
  frontier: string;
  open_block: string;
  representative_block: string;
  balance: string;
  modified_timestamp: string;
  block_count: string;
  account_version: string;
  confirmation_height: string;
  confirmation_height_frontier: string;
  representative?: string;
  weight?: string;
  pending?: string;
  receivable?: string;
  // Confirmed fields (include_confirmed option, v22.0+)
  confirmed_balance?: string;
  confirmed_height?: string;
  confirmed_frontier?: string;
  confirmed_representative?: string;
  confirmed_receivable?: string;
}

/** Raw RPC response from account_history */
export interface AccountHistoryRPCResponse {
  account: string;
  history: Array<{
    type: string;
    account: string;
    amount: string;
    local_timestamp: string;
    height: string;
    hash: string;
    confirmed: string;
    // For raw mode
    subtype?: string;
    previous?: string;
    representative?: string;
    balance?: string;
    link?: string;
    link_as_account?: string;
    signature?: string;
    work?: string;
    // For include_linked_account option (v28.0+)
    linked_account?: string;
  }>;
  previous?: string;
  // For reverse mode
  next?: string;
}

/** Raw RPC response from receivable/pending */
export interface ReceivableRPCResponse {
  blocks: Record<string, string | { amount: string; source: string }>;
}

/** Raw RPC response from ledger */
export interface LedgerRPCResponse {
  accounts: Record<string, {
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
  }>;
}

/** Raw RPC response from block_info */
export interface BlockInfoRPCResponse {
  block_account: string;
  amount: string;
  balance: string;
  height: string;
  local_timestamp: string;
  successor: string;
  confirmed: string;
  contents: BlockContents;
  subtype: BlockSubtype;
  // Optional fields
  pending?: string; // v9.0+ with pending option
  source_account?: string; // v9.0+ with source option
  receive_hash?: string; // v24.0+ with receive_hash option
  linked_account?: string; // v28.0+ with include_linked_account option
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

/** Raw RPC response from confirmation_active */
export interface ConfirmationActiveRPCResponse {
  confirmations: string[];
  unconfirmed: string;
  confirmed: string;
}

/** Raw RPC response from confirmation_history */
export interface ConfirmationHistoryRPCResponse {
  confirmation_stats: {
    count: string;
    average: string;
  };
  confirmations: Array<{
    hash: string;
    duration: string;
    time: string;
    tally: string;
    final: string;
    blocks: string;
    voters: string;
    request_count: string;
  }>;
}

/** Raw RPC response from confirmation_info */
export interface ConfirmationInfoRPCResponse {
  announcements: string;
  voters: string;
  last_winner: string;
  total_tally: string;
  final_tally: string;
  blocks: Record<string, {
    tally: string;
    contents?: BlockContents;
    representatives?: Record<string, string>;
  }>;
}

/** Raw RPC response from confirmation_quorum */
export interface ConfirmationQuorumRPCResponse {
  quorum_delta: string;
  online_weight_quorum_percent: string;
  online_weight_minimum: string;
  online_stake_total: string;
  peers_stake_total: string;
  trended_stake_total: string;
}

/** Raw RPC response from election_statistics */
export interface ElectionStatisticsRPCResponse {
  normal: string;
  priority: string;
  hinted: string;
  optimistic: string;
  total: string;
  aec_utilization_percentage: string;
  max_election_age: string;
  average_election_age: string;
}

/** Raw RPC response from wallet_balances */
export interface WalletBalancesRPCResponse {
  balances: Record<string, {
    balance: string;
    pending: string;
    receivable: string;
  }>;
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
  accounts: Record<string, {
    frontier: string;
    open_block: string;
    representative_block: string;
    balance: string;
    modified_timestamp: string;
    block_count: string;
    representative?: string;
    weight?: string;
    pending?: string;
  }>;
}

/** Raw RPC response from wallet_pending/wallet_receivable */
export interface WalletReceivableRPCResponse {
  blocks: Record<string, string[] | Record<string, { amount: string; source: string }>>;
}

/** Raw RPC response from bootstrap_status */
export interface BootstrapStatusRPCResponse {
  bootstrap_threads: string;
  running_attempts_count: string;
  total_attempts_count: string;
  connections: {
    clients: string;
    connections: string;
    idle: string;
    target_connections: string;
    pulls: string;
  };
  attempts: Array<{
    id: string;
    mode: string;
    started: string;
    pulling: string;
    total_blocks: string;
    requeued_pulls: string;
    frontier_pulls: string;
    account_count: string;
  }>;
}

/** Raw RPC response from stats */
export interface StatsRPCResponse {
  type: string;
  created: string;
  entries: Array<{
    time: string;
    type: string;
    detail: string;
    dir: string;
    value: string;
  }>;
}

/** Raw RPC response from unchecked */
export interface UncheckedRPCResponse {
  blocks: Record<string, string | BlockContents>;
}

/** Raw RPC response from unchecked_keys */
export interface UncheckedKeysRPCResponse {
  unchecked: Array<{
    key: string;
    hash: string;
    modified_timestamp: string;
    contents: BlockContents;
  }>;
}

// ============ Node Response Types (transformed) ============

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

export interface ValidateResponse {
  address: string;
  valid: boolean;
  [key: string]: unknown;
}

export interface BlockInfoResponse {
  hash: string;
  amount?: string;
  balance?: string;
  [key: string]: unknown;
}

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

export interface ReceivableResponse {
  account: string;
  receivable: Record<string, unknown>;
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

export interface ProcessBlockResponse {
  success: boolean;
  hash: string;
  subtype: string;
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

export interface RepresentativesOnlineResponse {
  representatives: Record<string, unknown>;
  [key: string]: unknown;
}

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

export interface ReceivableExistsResponse {
  hash: string;
  exists: boolean;
  [key: string]: unknown;
}

export interface GetChainResponse {
  startingBlock: string;
  chain: string[];
  [key: string]: unknown;
}

export interface GetLedgerResponse {
  startingAccount: string;
  accounts: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetFrontiersResponse {
  startingAccount: string;
  frontiers: Record<string, string>;
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

export interface GetAccountsBalancesResponse {
  balances: Record<string, { balance: string; pending: string }>;
  [key: string]: unknown;
}

export interface GetAccountFromPublicKeyResponse {
  publicKey: string;
  account: string;
  [key: string]: unknown;
}

export interface GetAvailableSupplyResponse {
  availableSupply: string;
  availableSupplyRaw: string;
  [key: string]: unknown;
}

export interface GetPeersResponse {
  peers: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetRepresentativesResponse {
  representatives: Record<string, string>;
  [key: string]: unknown;
}

export interface GetUptimeResponse {
  seconds: number;
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

export interface GetStatsResponse {
  type: string;
  [key: string]: unknown;
}

export interface GetUncheckedResponse {
  count: number;
  blocks: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BootstrapResponse {
  success: boolean;
  address: string;
  port: number;
  [key: string]: unknown;
}

export interface StopNodeResponse {
  success: boolean;
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

export interface EpochUpgradeResponse {
  success: boolean;
  epoch: number;
  count: number;
  result: unknown;
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


export interface PopulateBacklogResponse {
  success: boolean;
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

export interface GetFrontierCountResponse {
  count: string;
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

export interface GetConfirmationQuorumResponse {
  quorum: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GetElectionStatisticsResponse {
  statistics: Record<string, unknown>;
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

export interface ClearStatsResponse {
  success: boolean;
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

// Wallet operation response types
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

export interface SearchPendingResponse {
  success: boolean;
  started: boolean;
  [key: string]: unknown;
}

export interface SearchReceivableResponse {
  success: boolean;
  started: boolean;
  [key: string]: unknown;
}

export interface SearchPendingAllResponse {
  success: boolean;
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

export type NanoOperationResponse =
  | SendPaymentResponse
  | BalanceResponse
  | AccountInfoResponse
  | AccountBlockCountResponse
  | AccountKeyResponse
  | AccountRepresentativeResponse
  | AccountWeightResponse
  | HistoryResponse
  | ReceiveResponse
  | PendingResponse
  | ReceivableResponse
  | ValidateResponse
  | BlockInfoResponse
  | BlockAccountResponse
  | BlockCountResponse
  | ProcessBlockResponse
  | CreateAccountResponse
  | ListAccountsResponse
  | VersionResponse
  | RepresentativesOnlineResponse
  | DelegatorsResponse
  | DelegatorsCountResponse
  | ConfirmBlockResponse
  | GetBlocksResponse
  | GetBlocksInfoResponse
  | ReceivableExistsResponse
  | GetChainResponse
  | GetLedgerResponse
  | GetFrontiersResponse
  | GetConfirmationInfoResponse
  | GenerateWorkResponse
  | ValidateWorkResponse
  | CreateKeyResponse
  | SignResponse
  | ExpandKeyResponse
  | GetDeterministicKeyResponse
  | GetAccountsBalancesResponse
  | GetAccountFromPublicKeyResponse
  | GetAvailableSupplyResponse
  | GetPeersResponse
  | GetRepresentativesResponse
  | GetUptimeResponse
  | GetTelemetryResponse
  | GetStatsResponse
  | GetUncheckedResponse
  | BootstrapResponse
  | StopNodeResponse
  | GetAccountsFrontiersResponse
  | GetAccountsReceivableResponse
  | GetAccountsRepresentativesResponse
  | CreateBlockResponse
  | GetBlockHashResponse
  | EpochUpgradeResponse
  | KeepaliveResponse
  | GetNodeIdResponse
  | PopulateBacklogResponse
  | RepublishResponse
  | GetFrontierCountResponse
  | GetSuccessorsResponse
  | GetUnopenedResponse
  | GetConfirmationActiveResponse
  | GetConfirmationHeightCurrentlyProcessingResponse
  | GetConfirmationHistoryResponse
  | GetConfirmationQuorumResponse
  | GetElectionStatisticsResponse
  | CancelWorkResponse
  | AddWorkPeerResponse
  | GetWorkPeersResponse
  | ClearWorkPeersResponse
  | BootstrapAnyResponse
  | BootstrapLazyResponse
  | GetBootstrapPrioritiesResponse
  | ResetBootstrapResponse
  | GetBootstrapStatusResponse
  | GetDatabaseTxnTrackerResponse
  | ClearStatsResponse
  | ClearUncheckedResponse
  | GetUncheckedBlockResponse
  | GetUncheckedKeysResponse
  | NanoToRawRPCResponse
  | RawToNanoRPCResponse
  | AccountMoveResponse
  | AccountRemoveResponse
  | AccountRepresentativeSetResponse
  | AccountsCreateResponse
  | PasswordChangeResponse
  | PasswordEnterResponse
  | PasswordValidResponse
  | ReceiveMinimumResponse
  | ReceiveMinimumSetResponse
  | SearchPendingResponse
  | SearchReceivableResponse
  | SearchPendingAllResponse
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
  | WorkSetResponse;


