# Change Log

## 0.2.0 - 2018-11-16 - [diff](https://github.com/adriano-di-giovanni/reaves/compare/v0.1.0...v0.2.0)

### Changed

* redis keys changed completely and there is no backward compatibility with v0.1.0
* compliance check now takes package version into account
* the `createdAt` param for `insert` is now optional. It defaults to `Date.now()` when omitted

## 0.2.1 - 2018-11-16 . [diff](https://github.com/adriano-di-giovanni/reaves/compare/v0.2.0...v0.2.1)

### Changed

* The `order` param is now optional. It defaults to `ascending` when omitted

### Added

* The `searchByValueIgnoreCase` method to perform case-insensitive searches regardless of the
case-sensitivity of the entity attribute.

### Fixed

* The `searchByValue` now respects the case-sensitivity of the attribute
