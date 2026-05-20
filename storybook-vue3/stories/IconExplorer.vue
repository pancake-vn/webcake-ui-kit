<template>
  <div class="ix" :style="{ '--ix-top-offset': topOffset + 'px' }">
    <aside class="ix__sidebar">
      <h3 class="ix__sidebar-title">Categories</h3>
      <ul class="ix__sidebar-list">
        <li>
          <button
            type="button"
            :class="['ix__sidebar-btn', { 'ix__sidebar-btn--active': activeCategory === '__all__' }]"
            @click="jumpTo('__all__')"
          >
            <span>All</span>
            <span class="ix__sidebar-count">{{ totalIcons }}</span>
          </button>
        </li>
        <li v-for="cat in displayCategories" :key="cat.name">
          <button
            type="button"
            :class="['ix__sidebar-btn', { 'ix__sidebar-btn--active': activeCategory === cat.name }]"
            @click="jumpTo(cat.name)"
          >
            <span class="ix__sidebar-label">{{ cat.name }}</span>
            <span class="ix__sidebar-count">{{ cat.visibleCount }}</span>
          </button>
        </li>
      </ul>
    </aside>

    <main class="ix__main" ref="scrollRoot">
      <div class="ix__search">
        <input
          ref="searchInput"
          v-model="rawQuery"
          type="search"
          placeholder="Search icons — name, tags, categories"
          autocomplete="off"
          class="ix__search-input"
        />
        <div class="ix__search-hint">
          <span>{{ filteredCount }} / {{ totalIcons }}</span>
          <button v-if="rawQuery" type="button" class="ix__clear" @click="rawQuery = ''">clear</button>
        </div>
      </div>

      <div v-if="filteredCount === 0" class="ix__empty">
        <div class="ix__empty-glyph">⌕</div>
        <p class="ix__empty-title">No icons match “{{ query }}”</p>
        <p class="ix__empty-sub">Try a shorter term or one of: arrow, alert, chevron, file, user.</p>
      </div>

      <div v-else class="ix__groups">
        <section
          v-for="group in displayGroups"
          :key="group.name"
          :id="`ix-cat-${slugify(group.name)}`"
          class="ix__group"
        >
          <header class="ix__group-header">
            <h2 class="ix__group-title">
              {{ group.name }}
              <span class="ix__group-count">{{ group.icons.length }}</span>
            </h2>
            <p v-if="group.score" class="ix__group-meta">top score {{ group.score.toFixed(2) }}</p>
          </header>
          <div class="ix__grid">
            <button
              v-for="icon in group.icons"
              :key="group.name + '::' + icon.displayName"
              type="button"
              class="ix__cell"
              :data-icon-id="icon.displayName"
              :title="icon.displayName"
              @click.stop="openCopyMenu($event, icon)"
              @dblclick.stop="copyName(icon)"
            >
              <span class="ix__cell-glyph">
                <component
                  v-if="mountCursor >= icon._idx && resolved[icon.displayName]"
                  :is="resolved[icon.displayName]"
                  :size="28"
                />
                <span v-else class="ix__cell-placeholder"></span>
              </span>
              <span class="ix__cell-name">{{ icon.pascalName }}</span>
            </button>
          </div>
        </section>
      </div>

      <!-- Click popover for copy actions. -->
      <div
        v-if="copyMenu.open"
        class="ix__popover"
        :style="{ top: copyMenu.y + 'px', left: copyMenu.x + 'px' }"
        @click.stop
      >
        <p class="ix__popover-title">{{ copyMenu.icon.displayName }}</p>
        <button type="button" class="ix__popover-btn" @click="copyName">Copy name</button>
        <button type="button" class="ix__popover-btn" @click="copyImport">Copy import</button>
        <pre class="ix__popover-preview">{{ importLine(copyMenu.icon) }}</pre>
      </div>

      <transition name="ix-toast">
        <div v-if="toast" class="ix__toast">{{ toast }}</div>
      </transition>
    </main>
  </div>
</template>

<script>
// All icon components — imported eagerly. The Storybook bundle already
// includes the icons indirectly (the rest of the kit imports many of them
// transitively), and the IntersectionObserver-driven lazy MOUNT below keeps
// the runtime cost bounded regardless of import shape.
import * as Icons from '../../src/icons/index.js'

// Manifest is loaded statically at module init. Frozen so Vue doesn't
// proxify ~1700 objects.
import manifestJson from '../../scripts/generated/icons/manifest.json'

const UNCATEGORIZED = 'Uncategorized'
const COPY_IMPORT_PATH = 'webcake-ui-kit/src/icons'
const TOAST_MS = 1600

// ────────────────────────────────────────────────────────────────────────────
// Static data — computed ONCE per JS bundle load (not per Vue instance).
// ────────────────────────────────────────────────────────────────────────────

// Lucide icons from manifest (only those with a matching export).
const lucideSet = new Set(manifestJson.icons.map(i => i.displayName))
const lucideEntries = manifestJson.icons
  .filter(i => Icons[i.displayName])
  .map(i => {
    const tags = (i.metadata && i.metadata.tags) || []
    const categories = (i.metadata && i.metadata.categories) || []
    return {
      ...i,
      metadata: {
        tags: tags.slice(),
        categories: categories.length ? categories.slice() : [UNCATEGORIZED]
      }
    }
  })

// Hand-crafted "design" icons — exports not covered by the Lucide manifest.
const designEntries = Object.keys(Icons)
  .filter(key => !lucideSet.has(key))
  .sort()
  .map(key => {
    const pascal = key.replace(/^Wki/, '')
    const kebab = pascal.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    return {
      displayName: key,
      pascalName: pascal,
      kebabName: kebab,
      fileName: pascal + '.vue',
      metadata: { tags: [], categories: ['Others'] }
    }
  })

// Combined list — Lucide first, then design icons. _idx is a stable position
// used by the chunked-mount cursor.
const ICONS = Object.freeze(
  [...lucideEntries, ...designEntries].map((i, idx) =>
    Object.freeze({
      ...i,
      _idx: idx,
      metadata: Object.freeze({
        tags: Object.freeze(i.metadata.tags),
        categories: Object.freeze(i.metadata.categories)
      })
    })
  )
)

// Chunked mounting: how many icons to materialise per animation frame.
// 80/frame × 60fps → ~21 frames to mount 1700+ icons (≈0.35s wall-clock).
const MOUNT_CHUNK = 80

// Per-icon tokenized search field — combines kebab/pascal/display/tags/categories.
function tokenize(text) {
  return String(text)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function buildBM25(icons) {
  const N = icons.length
  const docFreq = Object.create(null)
  const docLen = new Array(N)
  const docTerms = new Array(N)
  let totalLen = 0

  for (let i = 0; i < N; i++) {
    const it = icons[i]
    const text = [it.kebabName, it.pascalName, it.displayName, ...it.metadata.tags, ...it.metadata.categories].join(' ')
    const toks = tokenize(text)
    docLen[i] = toks.length
    totalLen += toks.length
    const counts = Object.create(null)
    for (const t of toks) counts[t] = (counts[t] || 0) + 1
    docTerms[i] = counts
    for (const t in counts) docFreq[t] = (docFreq[t] || 0) + 1
  }

  const avgLen = totalLen / N || 1
  const idf = Object.create(null)
  for (const t in docFreq) {
    idf[t] = Math.log((N - docFreq[t] + 0.5) / (docFreq[t] + 0.5) + 1)
  }

  // Inverted index: term -> [docId, freq, docId, freq, ...] (flat for tightness).
  const invIdx = Object.create(null)
  for (let i = 0; i < N; i++) {
    for (const term in docTerms[i]) {
      if (!invIdx[term]) invIdx[term] = []
      invIdx[term].push(i, docTerms[i][term])
    }
  }

  // Pre-sorted term list for prefix lookup.
  const termList = Object.keys(invIdx).sort()

  return { N, avgLen, idf, invIdx, docLen, termList }
}

function bm25Search(idx, query, k1 = 1.5, b = 0.75) {
  const qToks = tokenize(query)
  if (!qToks.length) return null

  const scores = new Float64Array(idx.N)
  let hit = false

  for (const qt of qToks) {
    // Exact match + prefix match (for incremental feel as the user types).
    const matches = matchTerms(idx, qt)
    for (const term of matches) {
      const idfScore = idx.idf[term]
      const post = idx.invIdx[term]
      // Light decay for prefix-but-not-exact so "arrow" out-ranks "arrow-cycle".
      const decay = term === qt ? 1 : 0.6
      for (let i = 0; i < post.length; i += 2) {
        const docId = post[i]
        const freq = post[i + 1]
        const dl = idx.docLen[docId]
        const tfNorm = (freq * (k1 + 1)) / (freq + k1 * (1 - b + (b * dl) / idx.avgLen))
        scores[docId] += idfScore * tfNorm * decay
        hit = true
      }
    }
  }
  if (!hit) return []

  const results = []
  for (let i = 0; i < idx.N; i++) if (scores[i] > 0) results.push([i, scores[i]])
  results.sort((a, b) => b[1] - a[1])
  return results
}

function matchTerms(idx, qt) {
  // Binary-search the sorted term list for the first term >= qt, then walk
  // forward as long as the term starts with qt. Cheap prefix scan.
  const arr = idx.termList
  let lo = 0
  let hi = arr.length
  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (arr[mid] < qt) lo = mid + 1
    else hi = mid
  }
  const out = []
  for (let i = lo; i < arr.length && arr[i].startsWith(qt); i++) out.push(arr[i])
  return out
}

const BM25_INDEX = buildBM25(ICONS)

// Category buckets (alphabetical).
const ALL_CATEGORIES = (() => {
  const map = new Map()
  for (let i = 0; i < ICONS.length; i++) {
    for (const c of ICONS[i].metadata.categories) {
      if (!map.has(c)) map.set(c, [])
      map.get(c).push(i)
    }
  }
  const list = [...map.entries()].map(([name, idxs]) => ({
    name,
    icons: idxs.slice().sort((a, b) => ICONS[a].pascalName.localeCompare(ICONS[b].pascalName))
  }))
  const TAIL = new Set([UNCATEGORIZED, 'Others'])
  list.sort((a, b) => {
    const aT = TAIL.has(a.name),
      bT = TAIL.has(b.name)
    if (aT && bT) return a.name.localeCompare(b.name)
    if (aT) return 1
    if (bT) return -1
    return a.name.localeCompare(b.name)
  })
  return list
})()

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default {
  name: 'IconExplorer',
  data() {
    return {
      rawQuery: '',
      query: '',
      debounceTimer: null,
      activeCategory: '__all__',
      // Chunked-mount cursor: any icon whose _idx <= mountCursor has been
      // materialised. Seeded with the first chunk so the first paint shows
      // real icons (not placeholders); advances on each animation frame in
      // mounted() until every icon is mounted.
      mountCursor: MOUNT_CHUNK - 1,
      copyMenu: { open: false, icon: null, x: 0, y: 0 },
      toast: '',
      toastTimer: null,
      mountRaf: null,
      topOffset: 203
    }
  },
  computed: {
    totalIcons() {
      return ICONS.length
    },
    resolved() {
      // Lookup map for <component :is> rendering. Module-level — frozen.
      return Icons
    },
    // BM25 result indices when a query is active; otherwise null (no filter).
    bm25Hits() {
      if (!this.query.trim()) return null
      return bm25Search(BM25_INDEX, this.query)
    },
    // Filtered + sorted icon indices.
    filteredIconIdxs() {
      if (!this.bm25Hits) return null // no filter — use category grouping as-is
      // Map of docId → score for category bucketing.
      const map = new Map()
      for (const [docId, score] of this.bm25Hits) map.set(docId, score)
      return map
    },
    filteredCount() {
      return this.filteredIconIdxs ? this.filteredIconIdxs.size : ICONS.length
    },
    // Either filtered (when querying) or full category list.
    displayGroups() {
      if (!this.filteredIconIdxs) {
        return ALL_CATEGORIES.map(g => ({
          name: g.name,
          icons: g.icons.map(i => ICONS[i]),
          score: 0
        }))
      }
      const out = []
      for (const g of ALL_CATEGORIES) {
        const matching = g.icons.filter(i => this.filteredIconIdxs.has(i))
        if (!matching.length) continue
        let top = 0
        const sorted = matching
          .map(i => ({ idx: i, score: this.filteredIconIdxs.get(i) }))
          .sort((a, b) => b.score - a.score)
        for (const s of sorted) if (s.score > top) top = s.score
        out.push({
          name: g.name,
          icons: sorted.map(s => ICONS[s.idx]),
          score: top
        })
      }
      // When searching, order categories by their top BM25 score so the most
      // relevant section sits at the top.
      out.sort((a, b) => b.score - a.score)
      return out
    },
    displayCategories() {
      // Sidebar: per-category counts (visible counts when filtering).
      return this.displayGroups.map(g => ({ name: g.name, visibleCount: g.icons.length }))
    }
  },
  watch: {
    rawQuery(val) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.query = val
      }, 500)
    },
    bm25Hits(hits) {
      // The chunked mount walks ICONS in order. If the user searches before
      // the cursor has walked to the matching icons, advance the cursor to
      // cover them immediately so the search result never shows placeholders.
      if (!hits) return
      let maxIdx = -1
      for (const [docId] of hits) if (docId > maxIdx) maxIdx = docId
      if (maxIdx > this.mountCursor) this.mountCursor = maxIdx
    }
  },
  mounted() {
    // Kick off the chunked mount loop. Earlier this component used an
    // IntersectionObserver tied to .ix__main as root, but Storybook's docs
    // viewmode embeds the story inline — the actual scroll container is the
    // outer docs page, not .ix__main — so the observer never saw any cell
    // as intersecting and the grid stayed empty. requestAnimationFrame is
    // layout-agnostic and works in every Storybook viewmode.
    const total = ICONS.length
    const tick = () => {
      this.mountCursor = Math.min(this.mountCursor + MOUNT_CHUNK, total - 1)
      this.calculateHeight()
      if (this.mountCursor < total - 1) {
        this.mountRaf = requestAnimationFrame(tick)
      } else {
        this.mountRaf = null
      }
    }
    this.mountRaf = requestAnimationFrame(tick)

    this.$nextTick(() => {
      this.calculateHeight()

      document.querySelectorAll('.docblock-emptyblock').forEach(el => {
        el.style.display = 'none'
      })

      document.querySelectorAll('.sbdocs-wrapper').forEach(el => {
        el.style.paddingBottom = '0px'
        el.style.paddingTop = '20px'
      })

      setTimeout(() => {
        this.calculateHeight()
      }, 50)
    })

    window.addEventListener('resize', this.calculateHeight)
    document.addEventListener('click', this.onDocClick, true)
  },
  beforeUnmount() {
    if (this.mountRaf) cancelAnimationFrame(this.mountRaf)
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    window.removeEventListener('resize', this.calculateHeight)
    document.removeEventListener('click', this.onDocClick, true)
    if (this.toastTimer) clearTimeout(this.toastTimer)
  },
  methods: {
    slugify(name) {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    },
    importLine(icon) {
      return `import { ${icon.displayName} } from '${COPY_IMPORT_PATH}'`
    },
    jumpTo(name) {
      this.activeCategory = name
      if (name === '__all__') {
        if (this.$refs.scrollRoot) this.$refs.scrollRoot.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const id = `ix-cat-${this.slugify(name)}`
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    openCopyMenu(evt, icon) {
      evt.stopPropagation()
      const rect = evt.currentTarget.getBoundingClientRect()
      const rootRect = this.$refs.scrollRoot.getBoundingClientRect()
      this.copyMenu = {
        open: true,
        icon,
        x: Math.max(8, rect.left - rootRect.left + rect.width / 2 - 110),
        y: rect.bottom - rootRect.top + 8 + this.$refs.scrollRoot.scrollTop
      }
    },
    onDocClick(e) {
      if (!this.copyMenu.open) return
      // close if clicking outside any cell + popover
      const t = e.target
      if (t.closest && (t.closest('.ix__popover') || t.closest('.ix__cell'))) return
      this.copyMenu.open = false
    },
    copyName(iconOrEvent) {
      const target = iconOrEvent && iconOrEvent.displayName ? iconOrEvent : this.copyMenu.icon
      this.copyToClipboard(target.displayName)
      this.showToast(`Copied — ${target.displayName}`)
      this.copyMenu.open = false
    },
    copyImport() {
      const line = this.importLine(this.copyMenu.icon)
      this.copyToClipboard(line)
      this.showToast(`Copied import — ${this.copyMenu.icon.displayName}`)
      this.copyMenu.open = false
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
    },
    showToast(msg) {
      this.toast = msg
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => {
        this.toast = ''
      }, TOAST_MS)
    },
    calculateHeight() {
      if (!this.$el) return
      if (window.innerWidth <= 720) {
        this.topOffset = 0
        return
      }
      const rect = this.$el.getBoundingClientRect()

      // Calculate bottom spacing from ancestors
      let bottomSpacing = 0
      let parent = this.$el.parentElement
      while (parent) {
        const style = window.getComputedStyle(parent)
        const paddingBottom = parseFloat(style.paddingBottom) || 0
        const marginBottom = parseFloat(style.marginBottom) || 0
        const borderBottom = parseFloat(style.borderBottomWidth) || 0
        bottomSpacing += paddingBottom + marginBottom + borderBottom
        parent = parent.parentElement
      }

      const topOffset = rect.top + window.scrollY
      this.topOffset = Math.max(0, topOffset + bottomSpacing)
    }
  }
}
</script>

<style scoped>
.ix {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 0;
  width: 100%;
  height: calc(100vh - var(--ix-top-offset, 203px));
  min-height: 0;
  background: #fff;
  color: #111;
  font:
    14px / 1.45 -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

@media (max-width: 720px) {
  .ix {
    grid-template-columns: 1fr;
    height: auto;
  }
  .ix__sidebar {
    position: static;
    max-height: 220px;
    border-right: none;
    border-bottom: 1px solid #eee;
  }
}

/* Sidebar */
.ix__sidebar {
  border-right: 1px solid #eee;
  overflow: auto;
  padding: 16px 8px;
  background: #fafafa;
  position: sticky;
  top: 0;
  align-self: start;
  height: 100%;
}
.ix__sidebar-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin: 4px 12px 8px;
}
.ix__sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ix__sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  font: inherit;
  text-align: left;
  border-radius: 6px;
  transition: background 0.12s ease;
}
.ix__sidebar-btn:hover {
  background: #efefef;
}
.ix__sidebar-btn--active {
  color: #13823b;
  font-weight: 600;
}
.ix__sidebar-label {
  text-transform: capitalize;
}
.ix__sidebar-count {
  font-variant-numeric: tabular-nums;
  color: #888;
  font-size: 12px;
}

/* Main */
.ix__main {
  position: relative;
  overflow: auto;
  padding: 0 24px 32px;
}
.ix__search {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  padding: 16px 0 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 12px;
  align-items: center;
}
.ix__search-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  font: inherit;
  outline: none;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}
.ix__search-input:focus {
  border-color: #13823b;
  box-shadow: 0 0 0 3px rgba(38, 194, 30, 0.15);
}
.ix__search-hint {
  font-size: 12px;
  color: #777;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: flex-end;
}
.ix__clear {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #13823b;
  padding: 2px 6px;
  font: inherit;
  font-size: 12px;
}

/* Groups */
.ix__groups {
  padding-top: 16px;
}
.ix__group {
  margin-bottom: 28px;
  scroll-margin-top: 80px;
}
.ix__group-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}
.ix__group-title {
  margin: 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ix__group-count {
  font-size: 11px;
  background: #eee;
  color: #555;
  padding: 1px 7px;
  border-radius: 999px;
  font-weight: 600;
}
.ix__group-meta {
  margin: 0;
  font-size: 11px;
  color: #aaa;
}

/* Grid */
.ix__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
  gap: 6px;
}

/* Cell */
.ix__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 12px 6px 8px;
  cursor: pointer;
  font: inherit;
  color: #333;
  text-align: center;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    transform 0.06s ease;
  position: relative;
}
.ix__cell:hover {
  background: #f4f6ff;
  border-color: #c7d2fa;
  transform: translateY(-1px);
}
.ix__cell:focus-visible {
  outline: none;
  border-color: #13823b;
  box-shadow: 0 0 0 3px rgba(31, 71, 230, 0.18);
}
.ix__cell-glyph {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #222;
}
.ix__cell-placeholder {
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  display: inline-block;
}
.ix__cell-name {
  font-size: 11px;
  color: #666;
  word-break: break-word;
  font-feature-settings: 'tnum' 0;
  line-height: 1.25;
}

/* Empty */
.ix__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: #888;
  text-align: center;
}
.ix__empty-glyph {
  font-size: 48px;
  color: #ccc;
  line-height: 1;
  margin-bottom: 12px;
}
.ix__empty-title {
  margin: 0 0 6px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}
.ix__empty-sub {
  margin: 0;
  font-size: 13px;
  color: #888;
}

/* Popover */
.ix__popover {
  position: absolute;
  z-index: 50;
  background: #fff;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 10px 12px;
  min-width: 240px;
  font-size: 13px;
}
.ix__popover-title {
  margin: 0 0 8px;
  font-weight: 600;
  color: #222;
}
.ix__popover-btn {
  display: block;
  width: 100%;
  text-align: left;
  background: #f4f6ff;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font: inherit;
  color: #13823b;
  margin-bottom: 6px;
}
.ix__popover-btn:hover {
  background: #e3eaff;
}
.ix__popover-preview {
  margin: 6px 0 0;
  padding: 6px 8px;
  background: #f6f6f6;
  border-radius: 4px;
  font:
    11px/1.4 ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    monospace;
  color: #555;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Toast */
.ix__toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  z-index: 100;
}
.ix-toast-enter-active,
.ix-toast-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.ix-toast-enter-from,
.ix-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

/* Dark mode (storybook-dark-mode toggles .dark on <html>) */
:global(.dark) .ix {
  background: #1c2128;
  color: #e6edf3;
}
:global(.dark) .ix__sidebar {
  background: #161a20;
  border-right-color: #2a2f37;
}
:global(.dark) .ix__sidebar-title {
  color: #8b949e;
}
:global(.dark) .ix__sidebar-btn {
  color: #c9d1d9;
}
:global(.dark) .ix__sidebar-btn:hover {
  background: #21262d;
}
:global(.dark) .ix__sidebar-btn--active {
  background: #1c2a55;
  color: #79b8ff;
}
:global(.dark) .ix__sidebar-count {
  color: #6e7681;
}
:global(.dark) .ix__search {
  background: #1c2128;
  border-bottom-color: #2a2f37;
}
:global(.dark) .ix__search-input {
  background: #161a20;
  border-color: #2a2f37;
  color: #e6edf3;
}
:global(.dark) .ix__search-input:focus {
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
}
:global(.dark) .ix__search-hint {
  color: #8b949e;
}
:global(.dark) .ix__group-title {
  color: #c9d1d9;
}
:global(.dark) .ix__group-count {
  background: #21262d;
  color: #8b949e;
}
:global(.dark) .ix__cell {
  background: transparent;
  color: #c9d1d9;
}
:global(.dark) .ix__cell:hover {
  background: #21262d;
  border-color: #30363d;
}
:global(.dark) .ix__cell-glyph {
  color: #e6edf3;
}
:global(.dark) .ix__cell-name {
  color: #8b949e;
}
:global(.dark) .ix__cell-placeholder {
  background: #21262d;
}
:global(.dark) .ix__empty-glyph {
  color: #30363d;
}
:global(.dark) .ix__empty-title {
  color: #c9d1d9;
}
:global(.dark) .ix__empty-sub {
  color: #8b949e;
}
:global(.dark) .ix__popover {
  background: #1c2128;
  border-color: #2a2f37;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
:global(.dark) .ix__popover-title {
  color: #e6edf3;
}
:global(.dark) .ix__popover-btn {
  background: #1c2a55;
  color: #79b8ff;
}
:global(.dark) .ix__popover-btn:hover {
  background: #243a76;
}
:global(.dark) .ix__popover-preview {
  background: #161a20;
  color: #8b949e;
}
:global(.dark) .ix__toast {
  background: #c9d1d9;
  color: #161a20;
}
</style>
