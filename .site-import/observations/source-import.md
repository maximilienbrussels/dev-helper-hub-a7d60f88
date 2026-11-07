# Source import verification

Source: https://github.com/maximilienbrussels/dev-helper-hub-5a4f3e56 (main ZIP). Import permission confirmed by the user.

This is a repository-source import, not a visual capture of GitHub. No source-site equivalence is claimed.

## Checked preview controls
- Desktop 1280×1800: home heading and local sheep photo visible; no horizontal overflow; Discover dropdown reveals four links; Escape dismisses it.
- Phone 390×844: home heading and local sheep photo visible; no horizontal overflow; navigation opens, Visit summary reveals Practical and Groups sections, and close returns to the page.
- Both layouts: wheel scrolling reaches footer; Academy CTA navigates to `/en/academy` on the preview origin.
- Evidence: `/tmp/browser/import-check/` screenshots and navigation-results.json.

## Limitations
- Source database/account export and source service connections are unavailable. Legacy data-backed features are not migrated to the newly provisioned Cloud backend.
- Residents, course records, authenticated administration, orders/bookings, payment, email delivery, and remote storage require service reconnection and real-data verification.
- Original bundled media and styling were copied; remotely served content may remain unavailable.
- Build check succeeded. Core routing/auth tests: 10 passed; other selected source tests: 36 passed, one pickup-date test failed. Supplemental-locale tests: seven passed, three pre-existing readiness failures.