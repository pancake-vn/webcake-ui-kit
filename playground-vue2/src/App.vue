<template>
  <div :class="['app', isDark && 'dark']">
    <div class="page">
      <header class="page__header">
        <div class="page__header-text">
          <h1>Webcake UI Kit</h1>
          <p>Button + Checkbox showcase. Tab through controls to see focus rings; hover to see hover bg.</p>
        </div>
        <WkButton
          variant="outline"
          roundness="round"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="isDark = !isDark"
        >
          <svg v-if="isDark" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.75" />
            <path
              d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.2 4.2l1 1M14.8 14.8l1 1M4.2 15.8l1-1M14.8 5.2l1-1"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
            />
          </svg>
          <svg v-else viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 11.5a6.5 6.5 0 0 1-7.5-7.5 6.5 6.5 0 1 0 7.5 7.5z"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linejoin="round"
            />
          </svg>
        </WkButton>
      </header>

      <section>
        <WkButton @click="openDialog = true">Open Dialog</WkButton>
        <WkDialog
          centered
          :open="openDialog"
          @cancel="openDialog = false"
          @ok="handleOk"
          :confirmLoading="loading"
          width="1000"
          fullscreen
          :title="'Sửa sản phẩm'"
          :subText="'Sản phẩm abc'"
          back
        >
          <div>
            <WkButton @click="openDialog2 = true">Open Dialog 2</WkButton>
          </div>
        </WkDialog>
        <WkDialog :open="openDialog2" @cancel="openDialog2 = false" @ok="openDialog2 = false" :zIndex="2000">
          <template #header>
            <div>Dialog 22222</div>
          </template>
          <p>abcccc</p>
        </WkDialog>
      </section>
    </div>
  </div>
</template>

<script>
const HOUSE_ICON =
  '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">' +
  '<path d="m1.5 8 6.5-5.5L14.5 8M3 7v6.5h10V7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />' +
  '</svg>'
const ELLIPSIS_ICON =
  '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">' +
  '<circle cx="3" cy="8" r="1.25" fill="currentColor" />' +
  '<circle cx="8" cy="8" r="1.25" fill="currentColor" />' +
  '<circle cx="13" cy="8" r="1.25" fill="currentColor" />' +
  '</svg>'

export default {
  data() {
    return {
      loading: false,
      openDialog: false,
      openDialog2: false,
      selected: '',
      checkboxValue: true,
      accordionValue: [],
      isDark: false,
      single: false,
      rich1: true,
      rich2: false,
      clickCount: 0,
      loadingDemo: false,
      variants: ['primary', 'neutral', 'secondary', 'outline', 'ghost', 'destructive'],
      sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
      options: [
        { value: 'a', label: 'Apples', checked: true },
        { value: 'b', label: 'Bananas', checked: false },
        { value: 'c', label: 'Cherries', checked: false }
      ],
      toggleA: false,
      toggleB: true,
      tgAlign: 'left',
      tgFormat: ['bold'],
      tgView: 'grid',
      inputValue: '',
      inputSizes: ['regular', 'large', 'small', 'mini'],
      inputRoundness: ['default', 'round'],
      breadcrumbCounts: [1, 2, 3, 4, 5, 6],
      breadcrumbWithIcon: [
        { icon: HOUSE_ICON, href: '#' },
        { label: 'Components', href: '#' },
        { label: 'Breadcrumb' }
      ],
      breadcrumbCollapsed: [
        { label: 'Home', href: '#' },
        { icon: ELLIPSIS_ICON, href: '#' },
        { label: 'Level x-2', href: '#' },
        { label: 'Level x-1', href: '#' },
        { label: 'Level x' }
      ],
      breadcrumbSlash: [
        { label: 'Breadcrumbs', href: '#' },
        { label: 'With', href: '#' },
        { label: 'Custom', href: '#' },
        { label: 'Separator' }
      ],
      dialogDefault: false,
      dialogCentered: false,
      dialogNoFooter: false,
      dialogNoMask: false,
      dialogLong: false,
      dialogAsync: false,
      dialogAsyncLoading: false,
      dialogLastAction: '',
      dialogMinimizable: false,
      dialogFullscreen: false,
      accordionLine: null,
      accordionLineMulti: ['a'],
      alertDelete: false,
      alertLeave: false,
      alertCustomFooter: false,
      alertAsync: false,
      alertAsyncLoading: false,
      alertLastAction: '',
      paginationPage: 7,
      paginationDemoRows: [
        { label: 'current=1, total=10', current: 1, total: 10, pageSize: 1, siblings: 1, boundary: 1, showIcon: false },
        {
          label: 'current=5, total=10 (middle)',
          current: 5,
          total: 10,
          pageSize: 1,
          siblings: 1,
          boundary: 1,
          showIcon: false
        },
        {
          label: 'current=10, total=10',
          current: 10,
          total: 10,
          pageSize: 1,
          siblings: 1,
          boundary: 1,
          showIcon: false
        },
        {
          label: 'current=1, total=7 (just fits)',
          current: 1,
          total: 7,
          pageSize: 1,
          siblings: 1,
          boundary: 1,
          showIcon: false
        },
        { label: 'current=2, total=2', current: 2, total: 2, pageSize: 1, siblings: 1, boundary: 1, showIcon: false },
        {
          label: 'current=15, total=30 (siblings=2)',
          current: 15,
          total: 30,
          pageSize: 1,
          siblings: 2,
          boundary: 1,
          showIcon: true
        },
        {
          label: 'current=50, total=100 (boundary=2)',
          current: 50,
          total: 100,
          pageSize: 1,
          siblings: 1,
          boundary: 2,
          showIcon: false
        }
      ]
    }
  },
  computed: {
    optionsState() {
      return (
        this.options
          .filter(o => o.checked)
          .map(o => o.label)
          .join(', ') || '(none)'
      )
    }
  },
  methods: {
    async handleOk() {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 5000))
      this.openDialog = false
      this.loading = false
    },
    handleChangeToggle(value) {
      console.log(value)
      this.toggleValue = value
    },
    handlePressEnter(value) {
      console.log(value)
    },
    handleInputChange(value) {
      console.log(value)
      this.inputValue = value
    },
    handleCheckboxChange(value) {
      console.log(value)
      this.checkboxValue = value
    },
    handleClickItem(item, index, e) {
      console.log(item)
      console.log(index)
      console.log(e)
    },
    handleChangeAccordion(value) {
      console.log(value)
      this.accordionValue = value
    },
    handleClickButton(value, e) {
      console.log(value)
      console.log(e)
    },
    simulateLoad() {
      this.loadingDemo = true
      setTimeout(() => {
        this.loadingDemo = false
      }, 1500)
    },
    breadcrumbItemsFor(n) {
      const arr = []
      for (let i = 1; i <= n; i++) {
        arr.push({ label: `Level ${i}`, href: i === n ? undefined : '#' })
      }
      return arr
    },
    onAsyncOpen() {
      this.dialogAsync = true
    },
    onAsyncOk() {
      this.dialogAsyncLoading = true
      setTimeout(() => {
        this.dialogAsyncLoading = false
        this.dialogAsync = false
        this.dialogLastAction = 'async-ok'
      }, 1500)
    },
    onAlertOk(label) {
      this.alertLastAction = `ok-${label}`
      this.alertDelete = false
      this.alertLeave = false
      this.alertCustomFooter = false
    },
    onAlertAsyncOk() {
      this.alertAsyncLoading = true
      setTimeout(() => {
        this.alertAsyncLoading = false
        this.alertAsync = false
        this.alertLastAction = 'async-confirmed'
      }, 1500)
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--body-background);
  color: var(--primary-fg);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 32px 96px;
  font-family: 'Inter', sans-serif;
  color: var(--primary-fg);
}

.page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid var(--border-primary);
  padding-bottom: 32px;
  margin-bottom: 32px;
}
.page__header-text {
  flex: 1 1 auto;
  min-width: 0;
}
.page__header h1 {
  font-size: var(--heading-1-font-size);
  line-height: var(--heading-1-line-height);
  letter-spacing: var(--heading-1-letter-spacing);
  font-weight: 600;
  margin: 0 0 16px;
}
.page__header p {
  font-size: var(--paragraph-regular-font-size);
  line-height: var(--paragraph-regular-line-height);
  color: var(--foreground-alt);
  margin: 0;
}

.section {
  padding: 32px 0;
  border-top: 1px solid var(--border-secondary);
}
.section:first-of-type {
  border-top: 0;
}
.section h2 {
  font-size: var(--heading-3-font-size);
  line-height: var(--heading-3-line-height);
  letter-spacing: var(--heading-3-letter-spacing);
  font-weight: 600;
  margin: 0 0 24px;
}
.section__sub {
  font-size: var(--paragraph-regular-font-size);
  line-height: var(--paragraph-regular-line-height);
  font-weight: 600;
  color: var(--secondary-fg);
  margin: 32px 0 12px;
}

.matrix {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  border: 1px solid var(--border-primary);
  border-radius: var(--rounded-lg);
  overflow: hidden;
}
.matrix th,
.matrix td {
  padding: 16px 20px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-secondary);
  border-right: 1px solid var(--border-secondary);
  background: var(--card);
  font-weight: 400;
  font-size: var(--paragraph-small-font-size);
  line-height: var(--paragraph-small-line-height);
}
.matrix thead th {
  background: var(--accent-bg);
  font-weight: 500;
  color: var(--secondary-fg);
}
.matrix tbody th {
  background: var(--accent-bg);
  color: var(--muted-fg);
  white-space: nowrap;
  width: 1%;
}
.matrix tr:last-child th,
.matrix tr:last-child td {
  border-bottom: 0;
}
.matrix th:last-child,
.matrix td:last-child {
  border-right: 0;
}

.cell-block {
  width: 240px;
}
.cell-rich {
  width: 240px;
}
.cell-input {
  width: 280px;
}

.row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.row__item {
  display: inline-flex;
  align-items: center;
  font-size: var(--paragraph-small-font-size);
  color: var(--secondary-fg);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  max-width: 360px;
}

.state {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--accent-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--rounded-md);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 12px;
  color: var(--secondary-fg);
}

.dialog-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  padding: 24px;
  font-size: 14px;
  color: var(--muted-fg);
}

.dialog-content {
  padding: 24px;
  font-size: var(--paragraph-small-font-size);
  line-height: var(--paragraph-small-line-height);
  color: var(--secondary-fg);
}
.dialog-content p {
  margin: 0 0 12px 0;
}
.dialog-content p:last-child {
  margin-bottom: 0;
}

.cell-dialog {
  width: 320px;
  background: var(--card);
  border: 1px solid var(--border-primary);
  border-radius: var(--rounded-xl);
  overflow: hidden;
}
</style>
