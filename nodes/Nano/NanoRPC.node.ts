import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { createNanoRPC } from '../../libs/nano-rpc/nano-rpc';

import {
	nanoToRaw,
	rawToNano,
	formatNanoAmount,
} from '../../utils/conversions';

import {
	isValidBlockHash,
	isValidNanoAddress,
	isValidWalletId,
} from '../../utils/validation';

import type * as rpcTypes from '../../types';

import { NanoRPCDescription } from './NanoRPC.description';

export class NanoRPC implements INodeType {
	description: INodeTypeDescription = NanoRPCDescription;

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0);

		// Get credentials
		const credentials = await this.getCredentials('nanoApi');
		const rpcUrl = credentials.rpcUrl as string;
		const credentialsWalletId = credentials.walletId as string;
		const defaultSourceAccount = credentials.sourceAccount;

		// Initialize RPC client
		const rpc = createNanoRPC(this, { rpcUrl });

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: rpcTypes.NanoOperationResponse;

				switch (operation) {
					case 'send': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const destination = this.getNodeParameter('destination', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const sourceAccount = this.getNodeParameter(
							'sourceAccount',
							i,
							defaultSourceAccount,
						) as string;
						const sendId = this.getNodeParameter('sendId', i, '') as string;
						const sendWork = this.getNodeParameter('sendWork', i, '') as string;

						// Validate addresses
						if (!isValidNanoAddress(destination)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid destination address: ${destination}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(sourceAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid source address: ${sourceAccount}`,
								{ itemIndex: i },
							);
						}

						// Convert amount to raw
						const amountRaw = nanoToRaw(amount);

						// Send payment
						const blockHash = await rpc.send(
							manualWalletId.length > 0 ? manualWalletId : credentialsWalletId,
							sourceAccount,
							destination,
							amountRaw,
							sendId || undefined,
							sendWork || undefined
						);

						responseData = {
							success: true,
							blockHash,
							destination,
							amount,
							amountRaw,
							source: sourceAccount,
							id: sendId || undefined,
							timestamp: new Date().toISOString(),
						};
						break;
					}

					case 'balance': {
						const account = this.getNodeParameter('account', i) as string;
						const includeOnlyConfirmed = this.getNodeParameter('balanceIncludeOnlyConfirmed', i, true) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const balanceData = await rpc.getBalance(account, includeOnlyConfirmed);

						responseData = {
							account,
							balance: rawToNano(balanceData.balance),
							balanceRaw: balanceData.balance,
							pending: rawToNano(balanceData.pending),
							pendingRaw: balanceData.pending,
							receivable: rawToNano(balanceData.receivable),
							receivableRaw: balanceData.receivable,
							balanceFormatted: formatNanoAmount(balanceData.balance),
							pendingFormatted: formatNanoAmount(balanceData.pending),
						};
						break;
					}

					case 'accountInfo': {
						const account = this.getNodeParameter('account', i) as string;
						const includeRepresentative = this.getNodeParameter('accountInfoRepresentative', i, true) as boolean;
						const includeWeight = this.getNodeParameter('accountInfoWeight', i, true) as boolean;
						const includePending = this.getNodeParameter('accountInfoPending', i, true) as boolean;
						const includeConfirmed = this.getNodeParameter('accountInfoIncludeConfirmed', i, false) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const accountInfo = await rpc.getAccountInfo(account, {
							representative: includeRepresentative,
							weight: includeWeight,
							pending: includePending,
							receivable: includePending,
							includeConfirmed: includeConfirmed || undefined,
						});

						responseData = {
							frontier: accountInfo.frontier,
							openBlock: accountInfo.open_block,
							representativeBlock: accountInfo.representative_block,
							account,
							balance: rawToNano(accountInfo.balance),
							balanceRaw: accountInfo.balance,
							blockCount: accountInfo.block_count,
							// Optional fields (v9.0+)
							...(accountInfo.representative && { representative: accountInfo.representative }),
							...(accountInfo.weight && { weight: accountInfo.weight }),
							...(accountInfo.pending && {
								pending: rawToNano(accountInfo.pending),
								pendingRaw: accountInfo.pending,
							}),
							...(accountInfo.receivable && {
								receivable: rawToNano(accountInfo.receivable),
								receivableRaw: accountInfo.receivable,
							}),
							// Confirmed fields (v22.0+, only present if includeConfirmed is true)
							...(accountInfo.confirmed_balance && {
								confirmedBalance: rawToNano(accountInfo.confirmed_balance),
								confirmedBalanceRaw: accountInfo.confirmed_balance,
							}),
							...(accountInfo.confirmed_height && { confirmedHeight: accountInfo.confirmed_height }),
							...(accountInfo.confirmed_frontier && { confirmedFrontier: accountInfo.confirmed_frontier }),
							...(accountInfo.confirmed_representative && { confirmedRepresentative: accountInfo.confirmed_representative }),
							...(accountInfo.confirmed_receivable && {
								confirmedReceivable: rawToNano(accountInfo.confirmed_receivable),
								confirmedReceivableRaw: accountInfo.confirmed_receivable,
							}),
						};
						break;
					}

					case 'history': {
						const account = this.getNodeParameter('account', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const head = this.getNodeParameter('historyHead', i, '') as string;
						const offset = this.getNodeParameter('historyOffset', i, 0) as number;
						const reverse = this.getNodeParameter('historyReverse', i, false) as boolean;
						const accountFilterStr = this.getNodeParameter('historyAccountFilter', i, '') as string;
						const includeLinkedAccount = this.getNodeParameter('historyIncludeLinkedAccount', i, false) as boolean;
						const raw = this.getNodeParameter('historyRaw', i, true) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						// Parse account filter (comma-separated)
						const accountFilter = accountFilterStr
							? accountFilterStr.split(',').map((a) => a.trim()).filter((a) => a)
							: undefined;

						const historyOptions = {
							...(raw === false && { raw: false }),
							...(head && { head }),
							...(offset > 0 && { offset }),
							...(reverse && { reverse }),
							...(accountFilter && accountFilter.length > 0 && { accountFilter }),
							...(includeLinkedAccount && { includeLinkedAccount }),
						};

						const historyData = await rpc.getAccountHistory(
							account,
							count,
							Object.keys(historyOptions).length > 0 ? historyOptions : undefined,
						);

						// Format history - include all raw fields since we use raw: true
						const formattedHistory = historyData.history?.map((tx) => ({
							type: tx.type,
							subtype: tx.subtype,
							account: tx.account,
							amount: rawToNano(tx.amount),
							amountRaw: tx.amount,
							hash: tx.hash,
							height: tx.height,
							confirmed: tx.confirmed === 'true',
							localTimestamp: tx.local_timestamp ? new Date(parseInt(tx.local_timestamp) * 1000).toISOString() : undefined,
							// Raw block fields
							...(tx.previous && { previous: tx.previous }),
							...(tx.representative && { representative: tx.representative }),
							...(tx.balance && { balance: tx.balance }),
							...(tx.link && { link: tx.link }),
							...(tx.link_as_account && { linkAsAccount: tx.link_as_account }),
							...(tx.signature && { signature: tx.signature }),
							...(tx.work && { work: tx.work }),
							// Linked account (v28.0+)
							...(tx.linked_account && { linkedAccount: tx.linked_account }),
						})) || [];

						responseData = {
							account,
							history: formattedHistory,
							// previous is used for pagination in normal mode
							...(historyData.previous && { previous: historyData.previous }),
							// next is used for pagination in reverse mode
							...(historyData.next && { next: historyData.next }),
						};
						break;
					}

					case 'accountBlockCount': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const blockCount = await rpc.getAccountBlockCount(account);

						responseData = {
							account,
							blockCount,
						};
						break;
					}

					case 'accountKey': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const publicKey = await rpc.getAccountKey(account);

						responseData = {
							account,
							publicKey,
						};
						break;
					}

					case 'accountRepresentative': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const representative = await rpc.getAccountRepresentative(account);

						responseData = {
							account,
							representative,
						};
						break;
					}

					case 'accountWeight': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const weight = await rpc.getAccountWeight(account);

						responseData = {
							account,
							weight,
							weightFormatted: formatNanoAmount(weight),
						};
						break;
					}

					case 'receivable': {
						const account = this.getNodeParameter('account', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const threshold = this.getNodeParameter('threshold', i, '') as string;
						const source = this.getNodeParameter('receivableSource', i, true) as boolean;
						const includeActive = this.getNodeParameter('receivableIncludeActive', i, false) as boolean;
						const minVersion = this.getNodeParameter('receivableMinVersion', i, false) as boolean;
						const sorting = this.getNodeParameter('receivableSorting', i, false) as boolean;
						const includeOnlyConfirmed = this.getNodeParameter('receivableIncludeOnlyConfirmed', i, true) as boolean;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const receivableOptions = {
							count,
							...(threshold && { threshold }),
							...(source && { source }),
							...(includeActive && { includeActive }),
							...(minVersion && { minVersion }),
							...(sorting && { sorting }),
							// Only include if false (true is default)
							...(!includeOnlyConfirmed && { includeOnlyConfirmed: false }),
						};

						const { blocks } = await rpc.getReceivable(account, receivableOptions);

						responseData = {
							account,
							receivable: blocks,
						};
						break;
					}

					case 'blockAccount': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const account = await rpc.getBlockAccount(blockHash);

						responseData = {
							blockHash,
							account,
						};
						break;
					}

					case 'blockCount': {
						const blockCountData = await rpc.getBlockCount();

						responseData = {
							count: blockCountData.count,
							unchecked: blockCountData.unchecked,
							cemented: blockCountData.cemented,
						};
						break;
					}

					case 'processBlock': {
						const blockJson = this.getNodeParameter('blockJson', i) as rpcTypes.BlockContents;
						const subtype = this.getNodeParameter('subtype', i, 'send') as rpcTypes.BlockSubtype;
						const force = this.getNodeParameter('processForce', i, false) as boolean;
						const asyncProcess = this.getNodeParameter('processAsync', i, false) as boolean;

						const processOptions = {
							subtype,
							...(force && { force }),
							...(asyncProcess && { async: true }),
						};

						const result = await rpc.process(blockJson, processOptions);

						responseData = {
							success: true,
							...(result.hash && { hash: result.hash }),
							...(result.started && { started: result.started === '1' }),
							subtype,
							async: asyncProcess,
						};
						break;
					}

					case 'version': {
						const versionInfo = await rpc.getVersion();

						responseData = {
							...versionInfo,
						};
						break;
					}

					case 'representativesOnline': {
						const includeWeight = this.getNodeParameter('includeWeight', i, false) as boolean;
						const filterAccountsStr = this.getNodeParameter('filterAccounts', i, '') as string;
						const filterAccounts = filterAccountsStr
							? filterAccountsStr.split(',').map((a) => a.trim()).filter((a) => a.length > 0)
							: undefined;

						const { representatives } = await rpc.getRepresentativesOnline({
							weight: includeWeight || undefined,
							accounts: filterAccounts,
						});

						responseData = {
							representatives,
						};
						break;
					}

					case 'delegators': {
						const account = this.getNodeParameter('account', i) as string;
						const threshold = this.getNodeParameter('delegatorsThreshold', i, '') as string;
						const countParam = this.getNodeParameter('delegatorsCount', i, 0) as number;
						const start = this.getNodeParameter('delegatorsStart', i, '') as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const options: { threshold?: string; count?: number; start?: string } = {};
						if (threshold) options.threshold = threshold;
						if (countParam > 0) options.count = countParam;
						if (start) options.start = start;

						const delegators = await rpc.getDelegators(
							account,
							Object.keys(options).length > 0 ? options : undefined
						);

						responseData = {
							account,
							delegators,
							delegatorCount: Object.keys(delegators).length,
						};
						break;
					}

					case 'delegatorsCount': {
						const account = this.getNodeParameter('account', i) as string;

						if (!isValidNanoAddress(account)) {
							throw new NodeOperationError(this.getNode(), `Invalid account address: ${account}`, {
								itemIndex: i,
							});
						}

						const count = await rpc.getDelegatorsCount(account);

						responseData = {
							account,
							delegatorCount: count,
						};
						break;
					}

					case 'receive': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const receivingAccount = this.getNodeParameter('receivingAccount', i) as string;
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const work = this.getNodeParameter('receiveWork', i, '') as string;

						if (!isValidWalletId(manualWalletId.length > 0 ? manualWalletId : credentialsWalletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${manualWalletId.length > 0 ? manualWalletId : credentialsWalletId}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(receivingAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid receiving account address: ${receivingAccount}`,
								{ itemIndex: i },
							);
						}

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const receiveBlockHash = await rpc.receive(
							manualWalletId.length > 0 ? manualWalletId : credentialsWalletId,
							receivingAccount,
							blockHash,
							work || undefined,
						);

						responseData = {
							success: true,
							receivingAccount,
							receivedBlockHash: receiveBlockHash,
							originalBlockHash: blockHash,
							timestamp: new Date().toISOString(),
						};
						break;
					}

					case 'validate': {
						const addressToValidate = this.getNodeParameter('addressToValidate', i) as string;

						const isValid = await rpc.validateAccount(addressToValidate);

						responseData = {
							address: addressToValidate,
							valid: isValid,
						};
						break;
					}

					case 'blockInfo': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const jsonBlock = this.getNodeParameter('jsonBlock', i, true) as boolean;
						const includeLinkedAccount = this.getNodeParameter('includeLinkedAccount', i, false) as boolean;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const blockInfo = await rpc.getBlockInfo(blockHash, jsonBlock, includeLinkedAccount);

						responseData = {
							hash: blockHash,
							...blockInfo,
							amount: blockInfo.amount ? rawToNano(blockInfo.amount) : undefined,
							balance: blockInfo.balance ? rawToNano(blockInfo.balance) : undefined,
						};
						break;
					}

					case 'createAccount': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const accountIndex = this.getNodeParameter('accountIndex', i, -1) as number;
						const createAccountWork = this.getNodeParameter('createAccountWork', i, true) as boolean;

						const createOptions: { index?: number; work?: boolean } = {};
						if (accountIndex >= 0) {
							createOptions.index = accountIndex;
						}
						if (!createAccountWork) {
							createOptions.work = false;
						}

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const newAccount = await rpc.createAccount(walletId, createOptions);

						responseData = {
							success: true,
							account: newAccount,
							wallet: walletId,
							...(accountIndex >= 0 && { index: accountIndex }),
							workGenerated: createAccountWork,
							timestamp: new Date().toISOString(),
						};
						break;
					}

					case 'listAccounts': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const accounts = await rpc.listAccounts(walletId);

						responseData = {
							wallet: walletId,
							accountCount: accounts.length,
							accounts,
						};
						break;
					}

					case 'accountMove': {
						const sourceWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const targetWallet = this.getNodeParameter('targetWallet', i) as string;
						const accountsToMoveStr = this.getNodeParameter('accountsToMove', i) as string;
						const accountsToMove = accountsToMoveStr.split(',').map((a) => a.trim());

						const walletId = sourceWalletId.length > 0 ? sourceWalletId : credentialsWalletId

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						for (const account of accountsToMove) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}



						const moved = await rpc.accountMove(walletId, targetWallet,  accountsToMove);

						responseData = {
							success: true,
							moved,
						};
						break;
					}

					case 'accountRemove': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const accountToRemove = this.getNodeParameter('accountToRemove', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(accountToRemove)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${accountToRemove}`,
								{ itemIndex: i },
							);
						}


						const removed = await rpc.accountRemove(walletId, accountToRemove);

						responseData = {
							success: true,
							removed,
						};
						break;
					}

					case 'accountRepresentativeSet': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;
						const representativeAddress = this.getNodeParameter(
							'representativeAddress',
							i,
						) as string;
						const accountRepSetWork = this.getNodeParameter('accountRepSetWork', i, '') as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(representativeAddress)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid representative address: ${representativeAddress}`,
								{ itemIndex: i },
							);
						}


						const block = await rpc.accountRepresentativeSet(
							walletId,
							walletAccount,
							representativeAddress,
							accountRepSetWork ? { work: accountRepSetWork } : undefined,
						);

						responseData = {
							success: true,
							block,
						};
						break;
					}

					case 'accountsCreate': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const accountCount = this.getNodeParameter('accountCount', i) as number;
						const accountsCreateWork = this.getNodeParameter('accountsCreateWork', i, false) as boolean;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const accounts = await rpc.accountsCreate(walletId, accountCount, { work: accountsCreateWork });

						responseData = {
							success: true,
							accounts,
						};
						break;
					}

					case 'passwordChange': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletPassword = this.getNodeParameter('walletPassword', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const changed = await rpc.passwordChange(walletId, walletPassword);

						responseData = {
							success: true,
							changed,
						};
						break;
					}

					case 'passwordEnter': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletPassword = this.getNodeParameter('walletPassword', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const valid = await rpc.passwordEnter(walletId, walletPassword);

						responseData = {
							success: true,
							valid,
						};
						break;
					}

					case 'passwordValid': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const valid = await rpc.passwordValid(walletId);

						responseData = {
							valid,
						};
						break;
					}

					case 'receiveMinimum': {
						const amount = await rpc.receiveMinimum();

						responseData = {
							amount,
							amountFormatted: formatNanoAmount(amount),
						};
						break;
					}

					case 'receiveMinimumSet': {
						const minimumAmount = this.getNodeParameter('minimumAmount', i) as string;

						const success = await rpc.receiveMinimumSet(minimumAmount);

						responseData = {
							success,
						};
						break;
					}

					case 'searchReceivable': {
						const searchWallet = this.getNodeParameter('searchWallet', i) as string;

						const started = await rpc.searchReceivable(searchWallet);

						responseData = {
							success: true,
							started,
						};
						break;
					}

					case 'searchReceivableAll': {
						const success = await rpc.searchReceivableAll();

						responseData = {
							success,
						};
						break;
					}

					case 'walletAdd': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletPrivateKey = this.getNodeParameter('walletPrivateKey', i) as string;
						const walletAddDisableWork = this.getNodeParameter('walletAddDisableWork', i, false) as boolean;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const account = await rpc.walletAdd(
							walletId,
							walletPrivateKey,
							walletAddDisableWork ? { work: false } : undefined,
						);

						responseData = {
							success: true,
							account,
						};
						break;
					}

					case 'walletAddWatch': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const watchAccountsStr = this.getNodeParameter('watchAccounts', i) as string;
						const watchAccounts = watchAccountsStr.split(',').map((a) => a.trim());

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						for (const account of watchAccounts) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}


						const success = await rpc.walletAddWatch(walletId, watchAccounts);

						responseData = {
							success,
						};
						break;
					}

					case 'walletBalances': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const balanceThreshold = this.getNodeParameter('balanceThreshold', i, '') as string;


						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const balances = await rpc.walletBalances(walletId, balanceThreshold || undefined);

						responseData = {
							wallet: walletId,
							balances,
						};
						break;
					}

					case 'walletChangeSeed': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const newSeed = this.getNodeParameter('newSeed', i) as string;
						const restoreCount = this.getNodeParameter('restoreCount', i, 0) as number;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const result = await rpc.walletChangeSeed(walletId, newSeed, restoreCount || undefined);

						responseData = {
							success: result.success,
							lastRestoredAccount: result.last_restored_account,
							restoredCount: result.restored_count,
						};
						break;
					}

					case 'walletContains': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const exists = await rpc.walletContains(walletId, walletAccount);

						responseData = {
							wallet: walletId,
							account: walletAccount,
							exists,
						};
						break;
					}

					case 'walletCreate': {
						const initialSeed = this.getNodeParameter('initialSeed', i, '') as string;

						const result = await rpc.walletCreate(initialSeed || undefined);

						responseData = {
							success: true,
							wallet: result.wallet,
							lastRestoredAccount: result.last_restored_account,
							restoredCount: result.restored_count,
						};
						break;
					}

					case 'walletDestroy': {
						const walletToDestroy = this.getNodeParameter('walletToDestroy', i) as string;

						const destroyed = await rpc.walletDestroy(walletToDestroy);

						responseData = {
							success: true,
							destroyed,
						};
						break;
					}

					case 'walletExport': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const json = await rpc.walletExport(walletId);

						responseData = {
							wallet: walletId,
							json,
						};
						break;
					}

					case 'walletFrontiers': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const frontiers = await rpc.walletFrontiers(walletId);

						responseData = {
							wallet: walletId,
							frontiers,
						};
						break;
					}

					case 'walletHistory': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const modifiedSince = this.getNodeParameter('modifiedSince', i, 0) as number;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const history = await rpc.walletHistory(walletId, modifiedSince || undefined);

						responseData = {
							wallet: walletId,
							history,
						};
						break;
					}

					case 'walletInfo': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const {accounts_block_count, accounts_cemented_block_count, accounts_count, adhoc_count, balance, deterministic_count, deterministic_index, pending, receivable } = await rpc.walletInfo(walletId);

						responseData = {
							wallet: walletId,
							balance,
							pending,
							receivable,
							accountsCount: Number(accounts_count),
							adhocCount: Number(adhoc_count),
							deterministicCount: Number(deterministic_count),
							deterministicIndex: Number(deterministic_index),
							accountsBlockCount: Number(accounts_block_count),
							accountsCementedBlockCount: Number(accounts_cemented_block_count),
						};
						break;
					}

					case 'walletLedger': {
						const includeRepresentative = this.getNodeParameter(
							'includeRepresentative',
							i,
							false,
						) as boolean;
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const includeWeight = this.getNodeParameter('includeWeight', i, false) as boolean;
						const includeReceivable = this.getNodeParameter('includeReceivable', i, false) as boolean;
						const modifiedSince = this.getNodeParameter('modifiedSince', i, 0) as number;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const accounts = await rpc.walletLedger(walletId, {
							representative: includeRepresentative || undefined,
							weight: includeWeight || undefined,
							receivable: includeReceivable || undefined,
							modifiedSince: modifiedSince || undefined,
						});

						responseData = {
							wallet: walletId,
							accounts,
						};
						break;
					}

					case 'walletLock': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const locked = await rpc.walletLock(walletId);

						responseData = {
							success: true,
							locked,
						};
						break;
					}

					case 'walletLocked': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const locked = await rpc.walletLocked(walletId);

						responseData = {
							wallet: walletId,
							locked,
						};
						break;
					}

					case 'walletReceivable': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const balanceThreshold = this.getNodeParameter('balanceThreshold', i, '') as string;
						const includeSource = this.getNodeParameter('includeSource', i, true) as boolean;
						const includeActive = this.getNodeParameter('walletReceivableIncludeActive', i, false) as boolean;
						const includeOnlyConfirmed = this.getNodeParameter('walletReceivableIncludeOnlyConfirmed', i, true) as boolean;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const blocks = await rpc.walletReceivable(walletId, {
							count,
							threshold: balanceThreshold || undefined,
							source: includeSource,
							includeActive,
							includeOnlyConfirmed,
						});

						responseData = {
							wallet: walletId,
							blocks,
						};
						break;
					}

					case 'walletRepresentative': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const representative = await rpc.walletRepresentative(walletId);

						responseData = {
							wallet: walletId,
							representative,
						};
						break;
					}

					case 'walletRepresentativeSet': {
						const representativeAddress = this.getNodeParameter(
							'representativeAddress',
							i,
						) as string;
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const updateExisting = this.getNodeParameter('updateExisting', i, true) as boolean;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(representativeAddress)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid representative address: ${representativeAddress}`,
								{ itemIndex: i },
							);
						}


						const set = await rpc.walletRepresentativeSet(
							walletId,
							representativeAddress,
							updateExisting,
						);

						responseData = {
							success: true,
							set,
						};
						break;
					}

					case 'walletRepublish': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const republishCount = this.getNodeParameter('republishCount', i, 1) as number;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const blocks = await rpc.walletRepublish(walletId, republishCount);

						responseData = {
							success: true,
							blocks,
						};
						break;
					}

					case 'walletWorkGet': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						const works = await rpc.walletWorkGet(walletId);

						responseData = {
							wallet: walletId,
							works,
						};
						break;
					}

					case 'workGet': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}


						const work = await rpc.workGet(walletId, walletAccount);

						responseData = {
							wallet: walletId,
							account: walletAccount,
							work,
						};
						break;
					}

					case 'workSet': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const walletAccount = this.getNodeParameter('walletAccount', i) as string;
						const workValue = this.getNodeParameter('workValue', i) as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						if (!isValidNanoAddress(walletAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${walletAccount}`,
								{ itemIndex: i },
							);
						}


						const success = await rpc.workSet(walletId, walletAccount, workValue);

						responseData = {
							success,
						};
						break;
					}

					case 'confirmBlock': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const confirmed = await rpc.confirmBlock(blockHash);

						responseData = {
							success: confirmed,
						};
						break;
					}

					case 'getBlocks': {
						const blockHashesStr = this.getNodeParameter('blockHashes', i) as string;
						const blockHashes = blockHashesStr.split(',').map((h) => h.trim());

						for (const hash of blockHashes) {
							if (!isValidBlockHash(hash)) {
								throw new NodeOperationError(this.getNode(), `Invalid block hash: ${hash}`, {
									itemIndex: i,
								});
							}
						}

						const blocks = await rpc.getBlocks(blockHashes);

						responseData = {
							blocks,
						};
						break;
					}

					case 'getBlocksInfo': {
						const blockHashesStr = this.getNodeParameter('blockHashes', i) as string;
						const blockHashes = blockHashesStr.split(',').map((h) => h.trim());
						const includeNotFound = this.getNodeParameter('blocksInfoIncludeNotFound', i, false) as boolean;
						const includePending = this.getNodeParameter('blocksInfoPending', i, false) as boolean;
						const includeSource = this.getNodeParameter('blocksInfoSource', i, false) as boolean;
						const includeReceiveHash = this.getNodeParameter('blocksInfoReceiveHash', i, false) as boolean;
						const includeLinkedAccount = this.getNodeParameter('blocksInfoIncludeLinkedAccount', i, false) as boolean;

						for (const hash of blockHashes) {
							if (!isValidBlockHash(hash)) {
								throw new NodeOperationError(this.getNode(), `Invalid block hash: ${hash}`, {
									itemIndex: i,
								});
							}
						}

						const blocksInfoOptions = {
							...(includeNotFound && { includeNotFound }),
							...(includePending && { pending: true }),
							...(includeSource && { source: true }),
							...(includeReceiveHash && { receiveHash: true }),
							...(includeLinkedAccount && { includeLinkedAccount }),
						};

						const blocksInfoResult = await rpc.getBlocksInfo(
							blockHashes,
							Object.keys(blocksInfoOptions).length > 0 ? blocksInfoOptions : undefined,
						);

						responseData = {
							blocks: blocksInfoResult.blocks,
							...(blocksInfoResult.blocks_not_found && { blocksNotFound: blocksInfoResult.blocks_not_found }),
						};
						break;
					}

					case 'receivableExists': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const includeActive = this.getNodeParameter('receiveExistsIncludeActive', i, false) as boolean;
						const includeOnlyConfirmed = this.getNodeParameter('receiveExistsIncludeOnlyConfirmed', i, true) as boolean;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const options: rpcTypes.ReceivableExistsOptions = {};
						if (includeActive) options.includeActive = true;
						if (!includeOnlyConfirmed) options.includeOnlyConfirmed = false;

						const exists = await rpc.receivableExists(blockHash, Object.keys(options).length > 0 ? options : undefined);

						responseData = {
							hash: blockHash,
							exists,
						};
						break;
					}

					case 'getChain': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const offset = this.getNodeParameter('chainOffset', i, 0) as number;
						const reverse = this.getNodeParameter('chainReverse', i, false) as boolean;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const options: { offset?: number; reverse?: boolean } = {};
						if (offset > 0) options.offset = offset;
						if (reverse) options.reverse = true;

						const chain = await rpc.getChain(blockHash, count, Object.keys(options).length > 0 ? options : undefined);

						responseData = {
							startingBlock: blockHash,
							chain,
						};
						break;
					}

					case 'getLedger': {
						const startingAccount = this.getNodeParameter('startingAccount', i) as string;
						const count = this.getNodeParameter('ledgerCount', i, 10) as number;
						const representative = this.getNodeParameter('ledgerRepresentative', i, false) as boolean;
						const weight = this.getNodeParameter('ledgerWeight', i, false) as boolean;
						const receivable = this.getNodeParameter('ledgerReceivable', i, false) as boolean;
						const modifiedSince = this.getNodeParameter('ledgerModifiedSince', i, 0) as number;
						const sorting = this.getNodeParameter('ledgerSorting', i, false) as boolean;
						const threshold = this.getNodeParameter('ledgerThreshold', i, '') as string;

						if (!isValidNanoAddress(startingAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${startingAccount}`,
								{ itemIndex: i },
							);
						}

						const ledger = await rpc.getLedger(startingAccount, {
							count,
							representative,
							weight,
							receivable,
							modifiedSince,
							sorting,
							threshold: threshold || undefined,
						});

						responseData = {
							startingAccount,
							accounts: ledger.accounts,
						};
						break;
					}

					case 'getFrontiers': {
						const startingAccount = this.getNodeParameter('startingAccount', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						if (!isValidNanoAddress(startingAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${startingAccount}`,
								{ itemIndex: i },
							);
						}

						const frontiers = await rpc.getFrontiers(startingAccount, count);

						responseData = {
							startingAccount,
							frontiers,
						};
						break;
					}

					case 'getConfirmationInfo': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const includeRepresentatives = this.getNodeParameter('includeRepresentatives', i, false) as boolean;
						const includeContents = this.getNodeParameter('includeContents', i, true) as boolean;
						const jsonBlock = this.getNodeParameter('confirmationJsonBlock', i, true) as boolean;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const confirmationInfo = await rpc.getConfirmationInfo(blockHash, {
							representatives: includeRepresentatives,
							contents: includeContents,
							json_block: jsonBlock,
						});

						responseData = {
							hash: blockHash,
							...confirmationInfo,
						};
						break;
					}

					case 'generateWork': {
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const difficulty = this.getNodeParameter('difficulty', i, '') as string;
						const multiplier = this.getNodeParameter('workMultiplier', i, 0) as number;
						const usePeers = this.getNodeParameter('usePeers', i, false) as boolean;
						const workAccount = this.getNodeParameter('workAccount', i, '') as string;
						const workVersion = this.getNodeParameter('workVersion', i, '') as string;
						const workBlockJson = this.getNodeParameter('workBlock', i, '') as string;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						// Build options object
						const options: Record<string, unknown> = {};
						if (difficulty) {
							options.difficulty = difficulty;
						}
						if (multiplier && multiplier > 0) {
							options.multiplier = multiplier;
						}
						if (usePeers) {
							options.usePeers = true;
							if (workAccount) {
								options.account = workAccount;
							}
						}
						if (workVersion) {
							options.version = workVersion;
						}
						if (workBlockJson) {
							try {
								options.block = typeof workBlockJson === 'string'
									? JSON.parse(workBlockJson)
									: workBlockJson;
							} catch {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in Block field', {
									itemIndex: i,
								});
							}
						}

						const workResult = await rpc.generateWork(blockHash, options);

						responseData = {
							hash: workResult.hash,
							work: workResult.work,
							difficulty: workResult.difficulty,
							multiplier: workResult.multiplier,
						};
						break;
					}

					case 'validateWork': {
						const work = this.getNodeParameter('work', i) as string;
						const blockHash = this.getNodeParameter('blockHash', i) as string;
						const difficulty = this.getNodeParameter('difficulty', i, '') as string;
						const multiplier = this.getNodeParameter('workMultiplier', i, 0) as number;
						const version = this.getNodeParameter('workVersion', i, '') as string;

						if (!isValidBlockHash(blockHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${blockHash}`, {
								itemIndex: i,
							});
						}

						const validationResult = await rpc.validateWork(work, blockHash, {
							difficulty: difficulty || undefined,
							multiplier: multiplier > 0 ? multiplier : undefined,
							version: version || undefined,
						});

						responseData = {
							work,
							hash: blockHash,
							valid: validationResult.valid,
							validAll: validationResult.validAll,
							validReceive: validationResult.validReceive,
							difficulty: validationResult.difficulty,
							multiplier: validationResult.multiplier,
						};
						break;
					}

					case 'createKey': {
						const keyPair = await rpc.createKey();

						responseData = {
							success: true,
							...keyPair,
						};
						break;
					}

					case 'sign': {
						const manualWalletId = this.getNodeParameter('manualWalletId', i) as string;
						const signMethod = this.getNodeParameter('signMethod', i, 'key') as string;
						const signInput = this.getNodeParameter('signInput', i, 'block') as string;

						const walletId = manualWalletId.length > 0 ? manualWalletId : credentialsWalletId;

						if (!isValidWalletId(walletId)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid wallet ID: ${walletId}`,
								{ itemIndex: i },
							);
						}

						// Build sign options
						const signOptions: Record<string, unknown> = {};

						// Set signing credentials
						if (signMethod === 'key') {
							const signPrivateKey = this.getNodeParameter('signPrivateKey', i) as string;
							signOptions.key = signPrivateKey;
						} else {
							// wallet method
							signOptions.wallet = walletId;
							const signAccount = this.getNodeParameter('signAccount', i) as string;
							signOptions.account = signAccount;
						}

						// Set what to sign
						if (signInput === 'block') {
							const signBlockJson = this.getNodeParameter('signBlock', i) as string;
							try {
								signOptions.block = typeof signBlockJson === 'string'
									? JSON.parse(signBlockJson)
									: signBlockJson;
							} catch {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in Block to Sign field', {
									itemIndex: i,
								});
							}
						} else {
							// hash input
							const hashToSign = this.getNodeParameter('hashToSign', i) as string;

							if (!isValidBlockHash(hashToSign)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${hashToSign}`, {
								itemIndex: i,
							});
						}

							signOptions.hash = hashToSign;
						}

						const signResult = await rpc.signBlock(signOptions);

						responseData = {
							signature: signResult.signature,
							...(signResult.block && { block: signResult.block }),
						};
						break;
					}

					case 'expandKey': {
						const privateKey = this.getNodeParameter('privateKey', i) as string;

						const expanded = await rpc.expandKey(privateKey);

						responseData = {
							privateKey,
							...expanded,
						};
						break;
					}

					case 'getDeterministicKey': {
						const seed = this.getNodeParameter('seed', i) as string;
						const index = this.getNodeParameter('index', i) as number;

						const keyPair = await rpc.getDeterministicKey(seed, index);

						responseData = {
							seed,
							index,
							...keyPair,
						};
						break;
					}

					case 'getAccountsBalances': {
						const accountsStr = this.getNodeParameter('accounts', i) as string;
						const accounts = accountsStr.split(',').map((a) => a.trim());
						const includeOnlyConfirmed = this.getNodeParameter('accountsBalancesIncludeOnlyConfirmed', i, true) as boolean;

						// Validate all accounts
						for (const account of accounts) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const balances = await rpc.getAccountsBalances(accounts, {
							includeOnlyConfirmed,
						});

						responseData = {
							balances,
						};
						break;
					}

					case 'getAccountFromPublicKey': {
						const publicKey = this.getNodeParameter('publicKey', i) as string;

						const account = await rpc.getAccountFromPublicKey(publicKey);

						responseData = {
							publicKey,
							account,
						};
						break;
					}

					case 'getAvailableSupply': {
						const supply = await rpc.getAvailableSupply();

						responseData = {
							availableSupply: rawToNano(supply),
							availableSupplyRaw: supply,
						};
						break;
					}

					case 'getPeers': {
						const peerDetails = this.getNodeParameter('peerDetails', i, false) as boolean;

						const { peers } = await rpc.getPeers(peerDetails ? { peer_details: true } : undefined);

						responseData = {
							peers,
						};
						break;
					}

					case 'getRepresentatives': {
						const sorting = this.getNodeParameter('sorting', i, false) as boolean;
						const countParam = this.getNodeParameter('count', i, 0) as number;
						const count = countParam > 0 ? countParam : undefined;

						const representatives = await rpc.getRepresentatives(count, sorting);

						responseData = {
							representatives,
						};
						break;
					}

					case 'getUptime': {
						const uptime = await rpc.getUptime();

						responseData = {
							seconds:
								typeof uptime === 'object' ? (uptime as { seconds: number }).seconds : uptime,
						};
						break;
					}

					case 'getTelemetry': {
						const raw = this.getNodeParameter('telemetryRaw', i, false) as boolean;
						const address = this.getNodeParameter('telemetryAddress', i, '') as string;
						const port = this.getNodeParameter('telemetryPort', i, 7075) as number;

						const telemetry = await rpc.getTelemetry({
							raw,
							address: address || undefined,
							port: address ? port : undefined,
						});

						responseData = {
							...telemetry,
						};
						break;
					}

					case 'getStats': {
						const statsType = this.getNodeParameter('statsType', i) as string;

						const stats = await rpc.getStats(statsType);

						responseData = {
							...stats,
						};
						break;
					}

					case 'getUnchecked': {
						const count = this.getNodeParameter('count', i, 10) as number;

						const { blocks } = await rpc.getUnchecked(count);

						responseData = {
							count,
							blocks,
						};
						break;
					}

					case 'bootstrap': {
						const bootstrapAddress = this.getNodeParameter('bootstrapAddress', i) as string;
						const bootstrapPort = this.getNodeParameter('bootstrapPort', i) as number;
						const bypassFrontierConfirmation = this.getNodeParameter(
							'bootstrapBypassFrontierConfirmation',
							i,
							false,
						) as boolean;
						const bootstrapId = this.getNodeParameter('bootstrapId', i, '') as string;

						await rpc.bootstrap(bootstrapAddress, bootstrapPort, {
							bypassFrontierConfirmation: bypassFrontierConfirmation || undefined,
							id: bootstrapId || undefined,
						});

						responseData = {
							success: true,
							address: bootstrapAddress,
							port: bootstrapPort,
						};
						break;
					}

					case 'stopNode': {
						await rpc.stopNode();

						responseData = {
							success: true,
						};
						break;
					}

					case 'getAccountsFrontiers': {
						const accountsListStr = this.getNodeParameter('accountsList', i) as string;
						const accountsList = accountsListStr.split(',').map((a) => a.trim());

						for (const account of accountsList) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const frontiers = await rpc.getAccountsFrontiers(accountsList);

						responseData = {
							accounts: accountsList,
							frontiers,
						};
						break;
					}

					case 'getAccountsReceivable': {
						const accountsListStr = this.getNodeParameter('accountsList', i) as string;
						const accountsList = accountsListStr.split(',').map((a) => a.trim());
						const count = this.getNodeParameter('accountsReceivableCount', i, 10) as number;
						const threshold = this.getNodeParameter('accountsReceivableThreshold', i, '') as string;
						const source = this.getNodeParameter('accountsReceivableSource', i, false) as boolean;
						const sorting = this.getNodeParameter('accountsReceivableSorting', i, false) as boolean;
						const offset = this.getNodeParameter('accountsReceivableOffset', i, 0) as number;

						for (const account of accountsList) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const receivable = await rpc.getAccountsReceivable(accountsList, {
							count,
							threshold: threshold || undefined,
							source,
							sorting,
							offset,
						});

						responseData = {
							accounts: accountsList,
							receivable,
						};
						break;
					}

					case 'getAccountsRepresentatives': {
						const accountsListStr = this.getNodeParameter('accountsList', i) as string;
						const accountsList = accountsListStr.split(',').map((a) => a.trim());

						for (const account of accountsList) {
							if (!isValidNanoAddress(account)) {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid account address: ${account}`,
									{ itemIndex: i },
								);
							}
						}

						const representatives = await rpc.getAccountsRepresentatives(accountsList);

						responseData = {
							accounts: accountsList,
							representatives,
						};
						break;
					}

					case 'createBlock': {
						const blockType = this.getNodeParameter('blockType', i) as 'state' | 'send' | 'receive' | 'change';

						const balance = this.getNodeParameter('balance', i, '') as string;
						const representative = this.getNodeParameter('representative', i) as string;
						const previous = this.getNodeParameter('previous', i) as string;

						const createBlockWallet = this.getNodeParameter('createBlockWallet', i, '') as string;
						const account = this.getNodeParameter('createBlockAccount', i, '') as string;
						const destination = this.getNodeParameter('destination', i, '') as string;
						const source = this.getNodeParameter('source', i, '') as string;
						const key = this.getNodeParameter('privateKey', i, '') as string;
						const link = this.getNodeParameter('link', i, '') as string;

						const workCreateBlock = this.getNodeParameter('workCreateBlock', i, '') as string;
						const jsonBlock = this.getNodeParameter('jsonBlock', i, true) as boolean;
						const workVersion = this.getNodeParameter('workVersion', i, '') as string;
						const difficulty = this.getNodeParameter('difficulty', i, '') as string;


						const { block } = await rpc.createBlock({
							type: blockType,
							json_block: jsonBlock,
							balance,
							representative: representative,
							previous: previous,
							wallet: createBlockWallet || undefined,
							account: account || undefined,
							key: key || undefined,
							destination: destination || undefined,
							source: source || undefined,
							link: link || undefined,
							work: workCreateBlock || undefined,
							version: workVersion || undefined,
							difficulty: difficulty || undefined,
						});

						responseData = {
							blockType,
							block,
						};
						break;
					}

					case 'getBlockHash': {
						const blockParamsStr = this.getNodeParameter('blockParams', i) as string;
						const jsonBlock = this.getNodeParameter('jsonBlock', i, true) as boolean;

						let blockParams;
						try {
							blockParams = JSON.parse(blockParamsStr);
						} catch {
							throw new NodeOperationError(this.getNode(), 'Invalid block parameters JSON', {
								itemIndex: i,
							});
						}

						const hash = await rpc.getBlockHash(blockParams, jsonBlock);

						responseData = {
							hash,
							block: blockParams,
						};
						break;
					}

					case 'epochUpgrade': {
						const epoch = this.getNodeParameter('epoch', i) as number;
						const epochKey = this.getNodeParameter('epochKey', i) as string;
						const count = this.getNodeParameter('count', i, 1) as number;

						const result = await rpc.epochUpgrade(epoch, epochKey, count);

						responseData = {
							success: true,
							epoch,
							count,
							result,
						};
						break;
					}

					case 'keepalive': {
						const peerAddress = this.getNodeParameter('peerAddress', i) as string;
						const peerPort = this.getNodeParameter('peerPort', i) as number;

						await rpc.keepalive(peerAddress, peerPort);

						responseData = {
							success: true,
							address: peerAddress,
							port: peerPort,
						};
						break;
					}

					case 'getNodeId': {
						const nodeId = await rpc.getNodeId();

						responseData = {
							nodeId,
						};
						break;
					}

					case 'populateBacklog': {
						await rpc.populateBacklog();

						responseData = {
							success: true,
						};
						break;
					}

					case 'republish': {
						const republishHash = this.getNodeParameter('republishHash', i) as string;
						const count = this.getNodeParameter('count', i, 1) as number;
						const sources = this.getNodeParameter('sources', i, 2) as number;
						const destinations = this.getNodeParameter('destinations', i, 2) as number;

						if (!isValidBlockHash(republishHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${republishHash}`, {
								itemIndex: i,
							});
						}

						const result = await rpc.republish(republishHash, count, sources, destinations);

						responseData = {
							success: true,
							hash: republishHash,
							count,
							sources,
							destinations,
							result,
						};
						break;
					}

					case 'getFrontierCount': {
						const count = await rpc.getFrontierCount();

						responseData = {
							count,
						};
						break;
					}

					case 'getSuccessors': {
						const startingBlock = this.getNodeParameter('startingBlock', i) as string;
						const count = this.getNodeParameter('count', i, 10) as number;
						const offset = this.getNodeParameter('chainOffset', i, 0) as number;
						const reverse = this.getNodeParameter('chainReverse', i, false) as boolean;

						const options: { offset?: number; reverse?: boolean } = {};
						if (offset > 0) options.offset = offset;
						if (reverse) options.reverse = true;

						const successors = await rpc.getSuccessors(startingBlock, count, Object.keys(options).length > 0 ? options : undefined);

						responseData = {
							startingBlock,
							successors,
						};
						break;
					}

					case 'getUnopened': {
						const unopenedAccount = this.getNodeParameter('unopenedAccount', i, '') as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						if (unopenedAccount && !isValidNanoAddress(unopenedAccount)) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid account address: ${unopenedAccount}`,
								{ itemIndex: i },
							);
						}

						const unopened = await rpc.getUnopened(unopenedAccount || undefined, count);

						responseData = {
							accounts: unopened,
						};
						break;
					}

					case 'getConfirmationActive': {
						const announcements = this.getNodeParameter('announcements', i, 0) as number;

						const confirmations = await rpc.getConfirmationActive(
							announcements > 0 ? { announcements } : undefined
						);

						responseData = {
							confirmations,
						};
						break;
					}

					case 'getConfirmationHistory': {
						const confirmationHash = this.getNodeParameter('confirmationHash', i, '') as string;

						if (!isValidBlockHash(confirmationHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${confirmationHash}`, {
								itemIndex: i,
							});
						}

						const history = await rpc.getConfirmationHistory(confirmationHash || undefined);

						responseData = {
							history,
						};
						break;
					}

					case 'getConfirmationQuorum': {
						const peerDetails = this.getNodeParameter('peerDetails', i, false) as boolean;

						const quorum = await rpc.getConfirmationQuorum(
							peerDetails ? { peer_details: true } : undefined
						);

						responseData = {
							quorum,
						};
						break;
					}

					case 'getElectionStatistics': {
						const statistics = await rpc.getElectionStatistics();

						responseData = {
							statistics,
						};
						break;
					}

					case 'cancelWork': {
						const workHash = this.getNodeParameter('workHash', i) as string;

						await rpc.cancelWork(workHash);

						responseData = {
							success: true,
							hash: workHash,
						};
						break;
					}

					case 'addWorkPeer': {
						const peerAddress = this.getNodeParameter('peerAddress', i) as string;
						const peerPort = this.getNodeParameter('peerPort', i) as number;

						await rpc.addWorkPeer(peerAddress, peerPort);

						responseData = {
							success: true,
							address: peerAddress,
							port: peerPort,
						};
						break;
					}

					case 'getWorkPeers': {
						const peers = await rpc.getWorkPeers();

						responseData = {
							workPeers: peers,
						};
						break;
					}

					case 'clearWorkPeers': {
						await rpc.clearWorkPeers();

						responseData = {
							success: true,
						};
						break;
					}

					case 'bootstrapAny': {
						const force = this.getNodeParameter('bootstrapAnyForce', i, false) as boolean;
						const bootstrapId = this.getNodeParameter('bootstrapId', i, '') as string;
						const account = this.getNodeParameter('bootstrapAnyAccount', i, '') as string;

						await rpc.bootstrapAny({
							force: force || undefined,
							id: bootstrapId || undefined,
							account: account || undefined,
						});

						responseData = {
							success: true,
						};
						break;
					}

					case 'bootstrapLazy': {
						const lazyHash = this.getNodeParameter('lazyHash', i) as string;
						const force = this.getNodeParameter('force', i, false) as boolean;
						const bootstrapId = this.getNodeParameter('bootstrapId', i, '') as string;

						await rpc.bootstrapLazy(lazyHash, {
							force: force || undefined,
							id: bootstrapId || undefined,
						});

						responseData = {
							success: true,
							hash: lazyHash,
							force,
						};
						break;
					}

					case 'getBootstrapPriorities': {
						const { priorities } = await rpc.getBootstrapPriorities();

						responseData = {
							priorities,
						};
						break;
					}

					case 'resetBootstrap': {
						await rpc.resetBootstrap();

						responseData = {
							success: true,
						};
						break;
					}

					case 'getBootstrapStatus': {
						const status = await rpc.getBootstrapStatus();

						responseData = {
							status,
						};
						break;
					}

					case 'getDatabaseTxnTracker': {
						const minReadTime = this.getNodeParameter('dbTxnMinReadTime', i, 1000) as number;
						const minWriteTime = this.getNodeParameter('dbTxnMinWriteTime', i, 0) as number;

						const tracker = await rpc.getDatabaseTxnTracker({
							minReadTime,
							minWriteTime,
						});

						responseData = {
							tracker,
						};
						break;
					}

					case 'clearStats': {
						await rpc.clearStats();

						responseData = {
							success: true,
						};
						break;
					}

					case 'clearUnchecked': {
						await rpc.clearUnchecked();

						responseData = {
							success: true,
						};
						break;
					}

					case 'getUncheckedBlock': {
						const uncheckedHash = this.getNodeParameter('uncheckedHash', i) as string;

						if (!isValidBlockHash(uncheckedHash)) {
							throw new NodeOperationError(this.getNode(), `Invalid block hash: ${uncheckedHash}`, {
								itemIndex: i,
							});
						}

						const block = await rpc.getUncheckedBlock(uncheckedHash);

						responseData = {
							hash: uncheckedHash,
							block,
						};
						break;
					}

					case 'getUncheckedKeys': {
						const uncheckedKey = this.getNodeParameter('uncheckedKey', i, '') as string;
						const count = this.getNodeParameter('count', i, 10) as number;

						const keys = await rpc.getUncheckedKeys(uncheckedKey || undefined, count);

						responseData = {
							keys: keys.unchecked,
						};
						break;
					}

					case 'nanoToRawRPC': {
						const convertAmount = this.getNodeParameter('convertAmount', i) as string;

						const raw = await rpc.nanoToRaw(convertAmount);

						responseData = {
							nano: convertAmount,
							raw,
						};
						break;
					}

					case 'rawToNanoRPC': {
						const convertAmount = this.getNodeParameter('convertAmount', i) as string;

						const nano = await rpc.rawToNano(convertAmount);

						responseData = {
							raw: convertAmount,
							nano,
						};
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
							itemIndex: i,
						});
				}

				// Add the response data to return array
				returnData.push({
					json: responseData as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							operation,
							itemIndex: i,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
