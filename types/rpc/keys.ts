/**
 * Key-related RPC types
 */

// ============ Response Types ============

/** Response from deterministic_key */
export interface DeterministicKeyRPCResponse {
	private: string;
	public: string;
	account: string;
}

/** Key pair response type (from key_create) */
export interface KeyPairResponse {
	private: string;
	public: string;
	account: string;
}

/** Response from sign RPC operation */
export interface SignRPCResponse {
	/** The generated signature */
	signature: string;
	/** The signed block with updated signature (if block was provided) */
	block?: Record<string, unknown>;
}

// ============ Options Types ============

/** Options for signing */
export interface SignOptions {
	/** Private key to sign with (alternative to wallet+account) */
	key?: string;
	/** Wallet ID (alternative to key, requires account) */
	wallet?: string;
	/** Account in wallet to sign with (requires wallet) */
	account?: string;
	/** Block to sign (alternative to hash) */
	block?: Record<string, unknown>;
	/** Hash to sign directly (requires rpc.enable_sign_hash config) */
	hash?: string;
}
