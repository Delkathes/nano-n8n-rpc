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
	const walletIdRegex = /^[0-9A-Fa-f]{64}$/;
	return walletIdRegex.test(walletId);
}

/**
 * Validate Nano block hash format (64-character hexadecimal)
 */
export function isValidBlockHash(hash: string): boolean {
	const blockHashRegex = /^[0-9A-Fa-f]{64}$/;
	return blockHashRegex.test(hash);
}

/**
 * Validate private key format (64-character hexadecimal)
 */
export function isValidPrivateKey(privateKey: string): boolean {
	return /^[0-9A-Fa-f]{64}$/.test(privateKey);
}

/**
 * Validate work value format (16-character hexadecimal)
 */
export function isValidWorkValue(work: string): boolean {
	return /^[0-9A-Fa-f]{16}$/.test(work);
}

/**
 * Validate positive finite Nano amount
 */
export function isValidPositiveNanoAmount(amount: number): boolean {
	return Number.isFinite(amount) && amount > 0;
}

/**
 * Validate raw amount string (unsigned integer)
 */
export function isValidRawAmount(rawAmount: string): boolean {
	return /^[0-9]+$/.test(rawAmount);
}
