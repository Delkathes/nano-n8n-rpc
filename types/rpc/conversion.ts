/**
 * Conversion-related RPC types
 */

// ============ RPC Response Types ============

/** Response from nano_to_raw and raw_to_nano */
export interface AmountConversionRPCResponse {
  amount: string;
}