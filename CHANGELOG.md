# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-05-12

### Added
- New `WkTypography` component with `variant` (heading-1–4, paragraph-large/regular/small/mini, caption, caption-mini, monospaced), `as`, `weight`, `color`, `align`, and `text` props; renders the semantically appropriate HTML element by default and falls back to `span`.
- Typography CSS shorthand token bundles (`--font-heading-*`, `--font-paragraph-*`, `--font-caption-*`, `--font-monospaced`) and utility classes (`.wk-heading-*`, `.wk-paragraph-*`, `.wk-caption-*`, `.wk-monospaced`, `.wk-weight-*`, `.wk-text-*`) added to `src/styles/typography.css`.

### Fixed
- Tab icon container in `WkTabs` resized from 16×16 px to 20×20 px to match design spec.
- Monospaced font family token now references `--font-family-monospace` (corrected from `--font-family-mono`).

## [1.0.3] - 2026-05-12

### Added

- New `WkTypography` component with `as` (h1–h6, p, span, label), `variant`, `weight`, `align`, `color`, `truncate`, and `lines` props.
- Expanded typography tokens in `src/styles/typography.css`.

### Fixed

- Tab icon styling in `WkTabs`.

### Docs

- New Storybook docs pages for Colors and Typography foundations.

## [1.0.2] - 2026-05-12

### Fixed

- Fixed layer color token in components.

### Added

- Storybook now includes a Changelog docs page sourced from `CHANGELOG.md`.

### Internal

- Release script (`scripts/release.js`) is now idempotent (safely resumes after a failed publish) and prompts for npm 2FA OTP; auto-creates a GitHub Release on publish.

## [1.0.1] - 2026-05-12

### Added

- New components: `WkPagination`, `WkSelect` / `WkSelectOption`, `WkDivider`, `WkRadio` / `WkRadioGroup`, `WkRichSwitchGroup`, `WkSidebarGroupLabel`, `WkSidebarItem`, `WkSlider`, `WkSpinner`, `WkSwitch` / `WkSwitchGroup`, `WkTabs`, `WkTag`.
- GitHub Actions workflow for CI/CD deploy (`.github/workflows/deploy.yml`).

### Changed

- All public exports are now prefixed with `Wk` (e.g. `Accordion` → `WkAccordion`, `Button` → `WkButton`). Update imports accordingly.
- Renamed component folders to kebab-case (`radio_group` → `radio-group`, `switch_group` → `switch-group`, `sidebar_item` → `sidebar-item`, `select_option` → `select-option`, `rich_switch_group` → `rich-switch-group`, `sidebar_group_label` → `sidebar-group-label`).
- Refined `Button`, `Select`, and `Spinner` styles.

### Fixed

- Vue 2 / Vue 3 playgrounds updated to register the new components and exercise them in showcase pages.
