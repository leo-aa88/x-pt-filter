# Security Policy

## Supported versions

The latest released version receives security fixes. Please make sure you're on
the newest release before reporting.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Instead, report privately using GitHub's
[**Report a vulnerability**](https://github.com/leo-aa88/x-pt-filter/security/advisories/new)
(Security → Advisories), or email **leonardo.aa88@gmail.com** with:

- a description of the issue and its impact,
- steps to reproduce, and
- affected browser(s) and version(s).

You can expect an acknowledgement within **7 days** and, where applicable, a
fix and coordinated disclosure. We'll credit you unless you prefer to remain
anonymous.

## Scope & threat model

This is a content-script-only extension that:

- requests no API permissions and stores nothing,
- makes **no network requests** and loads **no remote code**,
- runs only on X (`https://x.com/*`, `https://twitter.com/*`).

Relevant concerns we care about include: DOM-injection or XSS via the content
script, post content being able to break or hijack the filter, and any
accidental data exfiltration (there should be none). Reports along these lines
are very welcome.

## Out of scope

- A Portuguese post slipping through, or a non-Portuguese post being hidden
  (that's a heuristic bug — please file a normal issue).
- X changing its markup so the filter stops working (also a normal issue).
- Vulnerabilities in dev-only tooling that don't ship in the extension.
