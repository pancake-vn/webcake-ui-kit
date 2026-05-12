# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
