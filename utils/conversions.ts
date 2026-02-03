import NanoConverter from './nano-converter';

/**
 * Convert NANO to raw units (1 NANO = 10^30 raw)
 */
export function nanoToRaw(nano: string | number | undefined | null): string {
  if (nano === undefined || nano === null || nano === '') {
    return '0';
  }
  return NanoConverter.convert(nano, 'NANO', 'RAW');
}

/**
 * Convert raw units to NANO
 */
export function rawToNano(raw: string | undefined | null, decimals: number = 30): string {
  if (raw === undefined || raw === null || raw === '') {
    return '0';
  }
  const fullPrecision = NanoConverter.convert(raw, 'RAW', 'NANO');
  // Trim to desired decimal places
  const dotIndex = fullPrecision.indexOf('.');
  if (dotIndex === -1 || decimals >= 30) {
    return fullPrecision;
  }
  return fullPrecision.slice(0, dotIndex + decimals + 1);
}

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
 * Format amount for display
 */
export function formatNanoAmount(raw: string | undefined | null): string {
  if (raw === undefined || raw === null || raw === '') {
    return '0 NANO';
  }
  const nanoStr = NanoConverter.convert(raw, 'RAW', 'NANO', { trim: true });
  const nano = parseFloat(nanoStr);

  if (nano >= 1000000) {
    return (nano / 1000000).toFixed(2) + 'M NANO';
  } else if (nano >= 1000) {
    return (nano / 1000).toFixed(2) + 'K NANO';
  } else if (nano >= 1) {
    return nano.toFixed(6) + ' NANO';
  } else {
    return nano.toFixed(9) + ' NANO';
  }
}