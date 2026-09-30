# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Project docs: privacy policy, security policy, code of conduct, contributing
  guide, and issue / pull request templates.

## [1.0.0] - 2026-09-30

### Added

- Hide Portuguese-language posts on X (Twitter) timelines using a stopword
  heuristic, including posts loaded by infinite scroll (`MutationObserver`).
- Cross-browser builds from a single `src/` tree: Chrome, Edge, Firefox, and a
  Safari conversion path (`npm run build:safari`).
- Dependency-free build tooling: per-browser packaging with a bundled ZIP
  writer.
- Unit, DOM, manifest, and ZIP test suites (`node --test`).
- CI (lint, format, tests, build) and a manually triggered release workflow.

### Fixed

- A duplicated `quando` stopword no longer counts as two hits, which hid posts
  containing that single word (e.g. Italian ones).

[Unreleased]: https://github.com/leo-aa88/x-pt-filter/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/leo-aa88/x-pt-filter/releases/tag/v1.0.0
