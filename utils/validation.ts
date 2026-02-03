
/**
 * Validate Nano address format
 */
export function isValidNanoAddress(address: string): boolean {
  const nanoRegex = /^(nano|xrb)_[13][13-9a-km-uw-z]{59}$/;
  return nanoRegex.test(address);
}

/**
 * Validate Nano wallet id format
 */
export function isValidWalletId(walletId: string): boolean {
  // Nano wallet IDs used by the RPC are 64-hex-character identifiers
  const walletIdRegex = /^[0-9A-F]{64}$/;
  return walletIdRegex.test(walletId);
}

/**
 * Validate Nano block hash format (64-character hexadecimal)
 */
export function isValidBlockHash(hash: string): boolean {
  const blockHashRegex = /^[0-9A-F]{64}$/;
  return blockHashRegex.test(hash);
}
