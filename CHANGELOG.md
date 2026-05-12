# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2026-05-12

### Added

- New icon components `WkiSection` and `WkiSurvey` exported from `src/icons/index.js`.

### Fixed

- Fixed icon size in the collapsed state of `WkSidebarItem` (corrected from 18×18 px to 20×20 px).

## [1.0.4] - 2026-05-12

### Added

- New `WkTypography` component for rendering semantic text with design-system type styles; supports `variant` (heading-1–4, paragraph-large/regular/small/mini, caption, caption-mini, monospaced), `as` (tag override), `weight`, `color`, and `align` props, plus a default slot.
- Typography CSS utility classes (`wk-heading-1`, `wk-paragraph-regular`, etc.) and weight modifiers (`wk-weight-medium`, `wk-weight-bold`) are now included in `src/styles/typography.css` for use without the component.

### Fixed

- Fixed icon size inside `WkTabs` tab items being too small (16×16 px corrected to 20×20 px).

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
