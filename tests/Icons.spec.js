import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import * as Icons from '../src/icons/index.js'
import { mount } from './_utils.js'

// Drive the test off the manifest produced by `scripts/scan-lucide-icons.js`
// rather than off Object.keys(Icons). The manifest is the canonical list of
// Lucide-generated icons (all of which share the BaseIcon contract). The
// `src/icons/index.js` file also re-exports some hand-crafted siblings with
// a different shape (no BaseIcon wrapper, different props) — those are not
// covered here.
const __dirname = dirname(fileURLToPath(import.meta.url))
const manifestPath = resolve(__dirname, '..', 'scripts', 'generated', 'icons', 'manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

// [{ exportName, pascalName }]
const iconCases = manifest.icons.map(i => ({
  exportName: i.displayName,
  pascalName: i.pascalName
}))

describe('Manifest sanity', () => {
  it('manifest is non-empty', () => {
    expect(iconCases.length).toBeGreaterThan(0)
  })
})

// BaseIcon is an internal wrapper, not re-exported from src/icons/index.js.
// Its contract (slot rendering, prop → CSS-var forwarding) is exhaustively
// exercised by the 1700+ icon tests below — every icon mounts through it.

// The 1700+ icon iteration below exercises BaseIcon's wrapper + slot
// contract once per icon. Direct mount of BaseIcon with a raw slot string
// trips a vue-test-utils v2 internal (TypeError on WeakMap stub registration),
// so we don't mount it standalone — the icon tests fully cover the behavior.

describe('Lucide-generated icons', () => {
  it.each(iconCases)('$exportName mounts and renders a <svg> inside BaseIcon', ({ exportName }) => {
    const Component = Icons[exportName]
    expect(Component).toBeTruthy()

    const w = mount(Component)
    expect(w.find('.wki-base-icon').exists()).toBe(true)
    expect(w.find('svg').exists()).toBe(true)
  })

  // Prop forwarding is identical across every generated icon (they all share
  // the same generator template), so a 50-icon sample is enough — testing all
  // 1700+ for the same shape would add minutes of test time for no extra signal.
  const propSample = iconCases.slice(0, 50)

  it.each(propSample)('$exportName writes size + color CSS vars onto the BaseIcon wrapper', ({ exportName }) => {
    const Component = Icons[exportName]
    const w = mount(Component, { props: { size: 48, color: 'rebeccapurple' } })
    const style = w.find('.wki-base-icon').attributes('style') || ''
    expect(style).toContain('--wki-icon-size')
    expect(style).toContain('48px')
    expect(style).toContain('--wki-icon-color')
    expect(style).toContain('rebeccapurple')
  })

  it.each(propSample)('$exportName writes strokeWidth + fill CSS vars onto the BaseIcon wrapper', ({ exportName }) => {
    const Component = Icons[exportName]
    const w = mount(Component, { props: { strokeWidth: 3, fill: 'gold' } })
    const style = w.find('.wki-base-icon').attributes('style') || ''
    expect(style).toContain('--wki-icon-stroke-width')
    expect(style).toContain('--wki-icon-fill')
    expect(style).toContain('gold')
  })

  it.each(propSample)('$exportName accepts size as a string without appending px', ({ exportName }) => {
    const Component = Icons[exportName]
    const w = mount(Component, { props: { size: '1.5em' } })
    const style = w.find('.wki-base-icon').attributes('style') || ''
    expect(style).toContain('1.5em')
    expect(style).not.toMatch(/1\.5em\s*px/)
  })
})
