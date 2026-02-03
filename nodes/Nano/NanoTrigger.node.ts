import {
	type IHookFunctions,
	type IWebhookFunctions,
	type IWebhookResponseData,
	type INodeType,
	type INodeTypeDescription,
    type IDataObject,
} from 'n8n-workflow';

import { rawToNano } from '../../utils/conversions';

import type { BlockContents } from '../../types';

import { NanoTriggerDescription } from './NanoTrigger.description';

/**
 * Filter options for Nano confirmations
 */
export interface NanoFilterOptions {
	accounts?: string;
	subtypes?: string[];
	minAmount?: number;
	maxAmount?: number;
}

/**
 * Advanced options for Nano trigger
 */
export interface NanoAdvancedOptions {
	includeBlock?: boolean;
	validateSignature?: boolean;
	enrichAccountInfo?: boolean;
	deduplicateHash?: boolean;
}

export class NanoTrigger implements INodeType {
	description: INodeTypeDescription = NanoTriggerDescription;

	// Deduplication constants
	private static readonly MAX_HASH_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
	private static readonly CLEANUP_THRESHOLD = 1000; // Cleanup when exceeding this many entries

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				// Static data is automatically cleaned up by n8n
				return true;
			},
		},
    };

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Get node parameters
		const filterOptions = this.getNodeParameter('filterOptions', {}) as NanoFilterOptions;
		const advancedOptions = this.getNodeParameter('advancedOptions', {}) as NanoAdvancedOptions;

		// Default advanced options
		const includeBlock = advancedOptions.includeBlock !== false;
		const deduplicateHash = advancedOptions.deduplicateHash !== false;

		// Parse incoming request data
		const bodyData = parseRequestBody(this);
		let parsedBlock: BlockContents

		try {
			parsedBlock  = JSON.parse(bodyData.block);
		} catch (error) {
			throw new Error(`Failed to parse block data from webhook payload, ${error.message}`);
		}

		// Convert amount to Nano
        const amountNano = Number(rawToNano(bodyData.amount));

		// Get workflow-scoped static data for deduplication
		let seenHashes: Record<string, number> = {};
		if (deduplicateHash) {
			const staticData = this.getWorkflowStaticData('node');
			if (!staticData.seenHashes) {
				staticData.seenHashes = {};
			}
			seenHashes = staticData.seenHashes as Record<string, number>;

			// Periodic cleanup of old entries
			if (Object.keys(seenHashes).length > NanoTrigger.CLEANUP_THRESHOLD) {
				const cutoff = Date.now() - NanoTrigger.MAX_HASH_AGE_MS;
				for (const hash of Object.keys(seenHashes)) {
					if (seenHashes[hash] < cutoff) {
						delete seenHashes[hash];
					}
				}
			}
		}

		// Apply filters
		if (shouldFilterWebhook(bodyData, filterOptions, amountNano, seenHashes, deduplicateHash)) {
			return { noWebhookResponse: true };
		}

		// Build base response
		const webhookData = buildWebhookResponse(bodyData, parsedBlock, amountNano, includeBlock);

		// Optional: Validate block signature
		if (advancedOptions.validateSignature && bodyData.hash) {
			webhookData.signatureValid = await validateBlockSignature(this, bodyData.hash);
		}

		// Optional: Enrich with account info
		if (advancedOptions.enrichAccountInfo && bodyData.account) {
			webhookData.accountInfo = await fetchAccountInfo(this, bodyData.account);
		}

		return {
			workflowData: [this.helpers.returnJsonArray([webhookData])],
		};
	}
}



/**
 * Raw HTTP callback payload from Nano node
 */
export interface NanoCallbackPayload {
	account: string;
	hash: string;
	block: string;
	amount: string;
	subtype: string;
}

/**
 * Account info response from RPC
 */
export interface NanoAccountInfo {
	balance: bigint;
	balanceRaw: string;
	representative: string;
	blockCount: string;
	weight: string;
	pending: string;
}

/**
 * Webhook response data
 */
export interface NanoWebhookData  extends IDataObject {
	topic: string;
    receivedAt: string;

	account: string;
	hash: string;
    subtype: string;

	amountRaw: string;
    amountNano: number;

	block?: BlockContents;
	signatureValid?: boolean;
	accountInfo?: NanoAccountInfo | null;
}


/**
 * Parses the request body data
 */
function parseRequestBody(context: IWebhookFunctions): NanoCallbackPayload {
	let bodyData: any;

	try {
		bodyData = context.getBodyData();
	} catch (error) {
		bodyData = {};
	}

	// Fallback to raw body if needed
	if (!bodyData || Object.keys(bodyData).length === 0) {
		const req = context.getRequestObject();
		const rawBody = (req as any).rawBody || (req as any).body;

		if (typeof rawBody === 'string') {
			try {
				bodyData = JSON.parse(rawBody);
			} catch (e) {
				// Failed to parse
			}
		} else if (rawBody) {
			bodyData = rawBody;
		}
	}

	return bodyData;
}

/**
 * Validates block signature via RPC call
 */
async function validateBlockSignature(
	context: IWebhookFunctions,
	hash: string,
): Promise<boolean> {
	try {
		const credentials = await context.getCredentials('nanoApi');
		const rpcUrl = credentials.rpcUrl as string;

		const httpRequestWithAuthentication = context.helpers.httpRequestWithAuthentication.bind(context);

		const validationResult = await httpRequestWithAuthentication('nanoApi',{
			method: 'POST',
			url: rpcUrl,
			body: {
				action: 'block_info',
				json_block: true,
				hash,
			},
			json: true,
		});

		return !!validationResult;
	} catch (e) {
		return false;
	}
}

/**
 * Fetches account information via RPC call
 */
async function fetchAccountInfo(
	context: IWebhookFunctions,
	account: string,
): Promise<NanoAccountInfo | null> {
	try {
		const credentials = await context.getCredentials('nanoApi');
		const rpcUrl = credentials.rpcUrl as string;

		const httpRequestWithAuthentication = context.helpers.httpRequestWithAuthentication.bind(context);

		const accountInfo = await httpRequestWithAuthentication('nanoApi', {
			method: 'POST',
			url: rpcUrl,
			body: {
				action: 'account_info',
				account,
				representative: true,
				weight: true,
				pending: true,
			},
			json: true,
        });

		return {
			balance: BigInt(rawToNano(accountInfo.balance)),
			balanceRaw: accountInfo.balance,
			representative: accountInfo.representative,
			blockCount: accountInfo.block_count,
			weight: accountInfo.weight,
			pending: accountInfo.pending,
		};
	} catch (e) {
		// Account might not exist yet
		return null;
	}
}


function buildWebhookResponse(
	bodyData: NanoCallbackPayload,
	parsedBlock: BlockContents,
	amountNano: number,
	includeBlock: boolean,
): NanoWebhookData {
	const webhookData: NanoWebhookData = {
		topic: 'confirmation',
        receivedAt: new Date().toISOString(),
        account: bodyData.account,
        hash: bodyData.hash,
        subtype: bodyData.subtype,
        amountRaw: bodyData.amount,
        amountNano: amountNano,
	};

	// Block data (all other block fields are inside this object)
	if (parsedBlock && includeBlock) {
        webhookData.block = parsedBlock;
    }

	return webhookData;
}



/**
 * Validates if a block hash has been seen before (deduplication)
 * Uses a Record with timestamps for automatic cleanup of old entries
 */
export function isDuplicateHash(
	hash: string,
	seenHashes: Record<string, number>,
): boolean {
	if (seenHashes[hash]) {
		return true;
	}

	// Store hash with current timestamp
	seenHashes[hash] = Date.now();
	return false;
}

/**
 * Validates if account matches filter criteria
 */
export function isAccountAllowed(
	account: string | undefined,
	filterAccounts: string | undefined,
): boolean {
	if (!filterAccounts || !account) {
		return true; // No filter or no account = pass through
	}

	const allowedAccounts = filterAccounts
		.split(',')
		.map((a) => a.trim())
		.filter((a) => a);

	if (allowedAccounts.length === 0) {
		return true;
	}

	return allowedAccounts.includes(account);
}

/**
 * Validates if block subtype matches filter criteria
 */
export function isSubtypeAllowed(
	subtype: string | undefined,
	filterSubtypes: string[] | undefined,
): boolean {
	if (!filterSubtypes || filterSubtypes.length === 0) {
		return true; // No filter = pass through
	}

	if (!subtype) {
		return false; // Filter exists but no subtype = reject
	}

	return filterSubtypes.includes(subtype);
}

/**
 * Validates if amount is within min/max range
 */
export function isAmountInRange(
	amountNano: number | undefined,
	minAmount: number | undefined,
	maxAmount: number | undefined,
): boolean {
	if (amountNano === undefined) {
		return true; // No amount data = pass through
	}

	if (minAmount && minAmount > 0) {
		if (amountNano < minAmount) {
			return false;
		}
	}

	if (maxAmount && maxAmount > 0) {
		if (amountNano > maxAmount) {
			return false;
		}
	}

	return true;
}

/**
 * Applies all filters to determine if webhook should trigger
 * Returns true if the webhook should be rejected (filtered out)
 */
export function shouldFilterWebhook(
	bodyData: NanoCallbackPayload,
	filterOptions: NanoFilterOptions,
	amountNano: number | undefined,
	seenHashes: Record<string, number>,
	deduplicateHash: boolean,
): boolean {
	// Deduplication check
	if (deduplicateHash && bodyData.hash) {
		if (isDuplicateHash(bodyData.hash, seenHashes)) {
			return true;
		}
	}

	// Account filter
	if (!isAccountAllowed(bodyData.account, filterOptions.accounts)) {
		return true;
	}

	// Subtype filter
	if (!isSubtypeAllowed(bodyData.subtype, filterOptions.subtypes)) {
		return true;
	}

	// Amount filter
	if (!isAmountInRange(amountNano, filterOptions.minAmount, filterOptions.maxAmount)) {
		return true;
	}

	return false; // All filters passed
}