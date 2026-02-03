import type { IExecuteFunctions } from 'n8n-workflow';
import { nanoRPCCall } from './core';
import type {
  INanoRPCConfig,
  KeyPairResponse,
  SignOptions,
  SignRPCResponse,
  DeterministicKeyRPCResponse,
} from '../../../types/rpc';

/**
 * Derive deterministic keypair from seed based on index
 */
export async function getDeterministicKey(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  seed: string,
  index: number
): Promise<DeterministicKeyRPCResponse> {
  const response = await nanoRPCCall<DeterministicKeyRPCResponse>(context, config, 'deterministic_key', { seed, index });
  return {
    private: response.private,
    public: response.public,
    account: response.account,
  };
}

/**
 * Generate a new random keypair
 */
export async function createKey(context: IExecuteFunctions, config: INanoRPCConfig): Promise<KeyPairResponse> {
  const response = await nanoRPCCall<KeyPairResponse>(context, config, 'key_create');
  return {
    private: response.private,
    public: response.public,
    account: response.account,
  };
}

/**
 * Expand a private key to get public key and account
 */
export async function expandKey(context: IExecuteFunctions, config: INanoRPCConfig, key: string): Promise<KeyPairResponse> {
  const response = await nanoRPCCall<KeyPairResponse>(context, config, 'key_expand', { key });
  return {
    private: response.private,
    public: response.public,
    account: response.account,
  };
}

/**
 * Sign a block hash with a private key
 * @deprecated Use signBlock for more options
 */
export async function sign(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  key: string,
  hash: string
): Promise<string> {
  const response = await nanoRPCCall<{ signature: string }>(context, config, 'sign', { key, hash });
  return response.signature;
}

/**
 * Sign a block or hash (v18.0+)
 * Can sign with private key or wallet+account
 * When signing a block, returns the block with updated signature
 */
export async function signBlock(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  options: SignOptions
): Promise<SignRPCResponse> {
  const params: Record<string, unknown> = {};

  // Set signing credentials - either key or wallet+account
  if (options.key) {
    params.key = options.key;
  } else if (options.wallet && options.account) {
    params.wallet = options.wallet;
    params.account = options.account;
  }

  // Set what to sign - either block or hash
  if (options.block) {
    params.json_block = 'true';
    params.block = options.block;
  } else if (options.hash) {
    params.hash = options.hash;
  }

  const response = await nanoRPCCall<SignRPCResponse>(context, config, 'sign', params);
  return response;
}
