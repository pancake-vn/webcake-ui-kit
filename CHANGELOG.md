# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.25] - 2026-05-16

### Fixed

- Fixed `WkTabs` `stretchItems` class binding in Vue 2 by removing the erroneous `this.` prefix from the template expression, which caused the binding to be silently ignored in Vue 2.
- Fixed `WkSidebarGroupLabel` horizontal padding by removing the extra `var(--spacing-sm)` side padding so all four sides use the uniform `var(--spacing-xs)` value.

## [1.0.24] - 2026-05-16

### Fixed

- Fixed `WkTabs` `stretchItems` prop having no effect by correcting a misplaced CSS rule: `.ui-tabs__item--stretch` was nested inside `.ui-tabs__item`, making it match only descendants instead of the item element itself, so `flex: 1` was never applied.

## [1.0.23] - 2026-05-16

### Fixed

- Fixed `WkDialog` body content overflowing its container by adding `max-width: 100%` to the body inner element.
- Fixed `WkSidebarGroupLabel` label text typography to use design-token-based `paragraph-mini` font values (size, line-height, letter-spacing) and updated spacing tokens for gap and padding to match the intended design.

## [1.0.22] - 2026-05-16

### Added

- `WkTabs` accepts a new `stretchItems` boolean prop (default `false`); when `true`, each tab item expands to fill an equal share of the tab bar width via `flex: 1`.

## [1.0.21] - 2026-05-16

### Added

- `WkTabs` tab items now support an `icon` property (a Vue component reference) on each tab data object; the icon is rendered automatically via `<component :is="tab.icon" />` without requiring a slot.
- `WkTabs` exposes a new `label` scoped slot (bound with `tab`) that wraps the full tab content (icon, label, and counter), enabling complete custom rendering per tab.
- `WkTabs` exposes a new `icon` scoped slot (bound with `tab`) for overriding how a tab's icon component is rendered while keeping the default label and counter.

### Changed

- `WkTabs` tab icon slot is renamed from `tab-icon` to `icon`; update any `<template #tab-icon="{ tab }">` usage to `<template #icon="{ tab }">`.

### Fixed

- Fixed `WkTabs` tab item layout by separating the outer button element (block `flex`, fills available width) from a new inner wrapper (`inline-flex`, sizes to content), correcting stretch and alignment behavior.
- Fixed `WkTabs` icon container not constraining nested SVG elements to the expected 20×20 px dimensions.

## [1.0.20] - 2026-05-15

### Fixed

- Fixed `WkiBottomLeft` icon not being importable via `webcake-ui-kit/src/icons` by adding its missing named export to `src/icons/index.js`.

## [1.0.19] - 2026-05-15

### Added

- New icon components `WkiBottom`, `WkiBottomRight`, `WkiCreateBom`, `WkiLeft`, `WkiLine`, `WkiRectangleDot`, `WkiRight`, `WkiSmallDot`, `WkiTop`, `WkiTopLeft`, and `WkiTopRight` added to `src/icons/`, each accepting `size` (Number, default `16`) and `color` (String, default `currentColor`) props and exported from `webcake-ui-kit/src/icons`.

## [1.0.18] - 2026-05-14

### Added

- New `WkAvatar` component with `size` (regular/small/tiny/extra-tiny), `roundness` (round/roundrect), `src`, `alt`, `name`, and `online` props; falls back to a name initial or slot content when the image fails to load.
- New `WkAvatarStack` component for displaying a row of overlapping avatars from an `items` array, with a `max` prop to cap the visible count and a customizable overflow badge showing the remaining count.
- New `WkEmpty` component for empty-state layouts supporting `default`, `outline`, `background`, and `outline-dashed` variants, with `title`, `description`, `media`, and default action slots.
- New `WkEmptyIcon` component for use inside empty states; wraps slotted content in a 40×40 px rounded container and normalizes inner SVG icons to 24×24 px.
- New `WkField` component for form field composition, supporting `vertical` and `horizontal` layouts, `label`, `helpText`, `errorText`, `required`, and `error` props, with `label`, `message`, and `message-icon` slots.
- New `WkTooltip` component with configurable `side` (top/right/bottom/left), `color`, `title`, `arrow`, and `maxWidth` props; tooltip is triggered by hover or focus on the slotted trigger element.

### Fixed

- Fixed `WkButton` icon SVG sizing in Vue 2: replaced `:deep(svg)` with `::v-deep svg` in the size-variant CSS rules (xs, sm, md, lg, xl), restoring correct icon dimensions in Vue 2 builds.
- Fixed `WkDivider` vertical variant incorrectly stretching to fill its flex container's cross axis by removing the `align-self: stretch` rule.

## [1.0.17] - 2026-05-14

### Fixed

- Fixed `WkButton` icon-only size variants (`xs`, `sm`, `md`, `lg`, `xl`) incorrectly using `min-width` instead of `width`, which allowed the button to grow wider than its intended fixed dimension.

## [1.0.16] - 2026-05-14

### Fixed

- Fixed `WkiPadding` icon not being importable via `webcake-ui-kit/src/icons` by adding its missing named export to `src/icons/index.js`.

## [1.0.15] - 2026-05-14

### Added

- New `Padding` icon SFC added at `src/icons/Padding.vue`, accepting `size` (Number, default `16`) and `color` (String, default `currentColor`) props; available via direct import from `webcake-ui-kit/src/icons/Padding.vue`.

## [1.0.14] - 2026-05-14

### Fixed

- Fixed `WkDialog` width constraint on small viewports by replacing `min()` with equivalent `width` + `max-width` properties, improving compatibility with browsers that do not support the CSS `min()` function.

## [1.0.13] - 2026-05-14

### Changed

- `WkSelect` `size` prop value `"mini"` is renamed to `"xs"`; update `size="mini"` to `size="xs"` in any consumer to avoid the value silently falling back to the default size.
- `WkTabs` `size` prop value `"mini"` is renamed to `"xs"`; update `size="mini"` to `size="xs"` in any consumer.
- `WkAccordionItem`, `WkBreadcrumb`, `WkCheckbox`, `WkDialog`, `WkPagination`, `WkSelect`, `WkSidebarGroupLabel`, and `WkSpinner` now render their icons via a new shared icon component system instead of per-component inline SVGs, standardising stroke-width (1.75) and sizing across the library.

### Fixed

- Fixed `WkCheckbox` checkmark alignment: removed a 1 px top/left offset on the inner box element that caused the check icon to appear visually mispositioned.

## [1.0.12] - 2026-05-13

### Fixed

- Fixed `WkTabs` tab items not stretching to fill available width by adding `flex: 1` to the item element.

## [1.0.11] - 2026-05-13

### Fixed

- Fixed `WkSidebarItem` hover style: both collapsed and expanded items now show a unified background highlight (`--color-brand-neutrals-50`) on hover, replacing the previous split behavior of a background fill for collapsed and a box-shadow ring for expanded.

## [1.0.10] - 2026-05-13

### Added

- New `WkiImageMarquee` icon component exported from `src/icons/`.

### Changed

- `WkiButton`, `WkiSection`, `WkiSurvey`, and `WkiTab` icons now accept `size` (Number, default `16`) and `color` (String, default `currentColor`) props, replacing previously hardcoded pixel dimensions and fill colors.

### Fixed

- Storybook story titles for all components now use a flat two-level path (e.g., `Forms/Button`) instead of the incorrect three-level `Components/Forms/Button` prefix.

## [1.0.9] - 2026-05-13

### Fixed

- Fixed `WkSidebarItem` hover styles: collapsed items now show a background highlight on hover; expanded items show a box-shadow outline ring instead of a background fill.
- Fixed `WkSidebarItem` active state: background now uses `--color-brand-neutrals-200` and no longer overrides text color or font weight; default text color and collapsed icon color now use direct neutral tokens instead of deprecated sidebar-scoped tokens.

## [1.0.8] - 2026-05-12

### Fixed

- Fixed `WkSidebarItem` vertical padding (corrected token from `--spacing-5` to `--spacing-2xs`), enforced a fixed height of 32 px, and corrected the icon size from 16×16 px to 20×20 px.

## [1.0.7] - 2026-05-12

### Added

- New icon components `WkiButton` and `WkiTab` exported from `src/icons/index.js`.

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
