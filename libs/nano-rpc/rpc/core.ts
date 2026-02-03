import type { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { INanoRPCConfig, INanoRPCResponse } from '../../../types/rpc';

// Re-export types for convenience from core
export type { INanoRPCConfig, INanoRPCResponse } from '../../../types/rpc';

/**
 * Make RPC call to Nano node using n8n's HTTP helper
 */
export async function nanoRPCCall<T = INanoRPCResponse>(
  context: IExecuteFunctions,
  config: INanoRPCConfig,
  action: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const requestBody = {
    action,
    ...params,
  };

  try {
    const data = await context.helpers.httpRequest({
      method: 'POST' as IHttpRequestMethods,
      url: config.rpcUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
      body: requestBody,
      json: true,
    });

    // Check for RPC errors
    if (data.error) {
      throw new Error(`Nano RPC Error: ${data.error}`);
    }

    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Nano RPC call failed: ${message}`);
  }
}
