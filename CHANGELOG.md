# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- RPC resiliency strategy in core calls:
  - request timeout support
  - transient-failure retries
- Additional parameter validators for:
  - private keys
  - work values
  - positive Nano amounts
  - raw amounts
- Node runtime options for:
  - timeout
  - max retries

### Changed

- Improved RPC failure diagnostics with action name, retry/attempt data, and redacted request context.
- Wired Nano node UI options to RPC runtime config so timeout/retry values are applied per item.
- Tightened validation for high-risk operations such as `send`, `receive`, `walletAdd`, `walletDestroy`,
  `accountMove`, `workSet`, `bootstrapLazy`, `cancelWork`, and `searchReceivable`.
- Updated wallet/hash validation to accept both uppercase and lowercase hexadecimal strings.
- Replaced placeholder README with full project documentation.

### Fixed

- `getConfirmationHistory` now correctly allows empty hash input (fetch recent confirmations) and
  validates only when a hash is provided.
- Added missing `startingBlock` hash validation in `getSuccessors`.

## [0.1.0] - 2026-03-14

### Added

- Initial release of `@nano/n8n-nodes-rpc-commands`.
- Nano RPC node with broad support for account, transaction, block, wallet, network, ledger,
  confirmation, work, key, administration, and conversion operations.
- Nano Trigger node for webhook-driven workflows.
