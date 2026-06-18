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
        <WkButton @click="openDialog = true">
          <template #icon>
            <WkiSection />
          </template>
        </WkButton>
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
            <WkButton @click="openDialog2 = true">
              <template #icon>
                <WkiSection />
              </template>
            </WkButton>

            <WkTooltip
              side="right"
              title="To learn more about how this works, check out the docs. If you have any questions, please reach out to us."
              :max-width="205"
            >
              <WkButton variant="outline">Export File</WkButton>
            </WkTooltip>
          </div>
        </WkDialog>
        <WkDialog :open="openDialog2" @cancel="openDialog2 = false" @ok="openDialog2 = false" :zIndex="2000">
          <template #header>
            <div>Dialog 22222</div>
          </template>
          <p>abcccc</p>
        </WkDialog>
      </section>

      <section class="section">
        <h2>Typography</h2>
        <WkTypography variant="heading-1">Heading 1 — the quick brown fox</WkTypography>
        <WkTypography variant="heading-2">Heading 2 — the quick brown fox</WkTypography>
        <WkTypography variant="heading-3">Heading 3 — the quick brown fox</WkTypography>
        <WkTypography variant="heading-4">Heading 4 — the quick brown fox</WkTypography>
        <WkTypography variant="paragraph-large">Paragraph Large — body copy at 18px.</WkTypography>
        <WkTypography variant="paragraph-regular">Paragraph Regular — body copy at 16px.</WkTypography>
        <WkTypography variant="paragraph-regular" weight="medium">Paragraph Regular (medium) — 500.</WkTypography>
        <WkTypography variant="paragraph-regular" weight="bold">Paragraph Regular (bold) — 600.</WkTypography>
        <WkTypography variant="paragraph-small">Paragraph Small — 14px.</WkTypography>
        <WkTypography variant="paragraph-mini">Paragraph Mini — 12px.</WkTypography>
        <WkTypography variant="caption">CAPTION — 14px with tracking.</WkTypography>
        <WkTypography variant="caption-mini">CAPTION MINI — 10px.</WkTypography>
        <WkTypography variant="monospaced">monospaced — const code = true</WkTypography>
        <WkTypography variant="paragraph-regular" color="muted-fg">Color: muted-fg</WkTypography>
        <WkTypography variant="paragraph-regular" color="destructive">Color: destructive</WkTypography>
        <WkTypography variant="paragraph-regular" align="center">Aligned center</WkTypography>
        <WkTypography variant="paragraph-regular" align="right">Aligned right</WkTypography>
        <WkTypography variant="heading-3" as="div">heading-3 rendered as &lt;div&gt; via as prop</WkTypography>
      </section>

      <section class="section">
        <h2>Avatar</h2>
        <div class="row">
          <WkAvatar name="CN" />
          <WkAvatar name="CN" size="small" />
          <WkAvatar name="CN" size="tiny" />
          <WkAvatar name="CN" size="extra-tiny" />
          <WkAvatar name="CN" roundness="roundrect" />
          <WkAvatar name="CN" roundness="roundrect" size="small" />
          <WkAvatar name="CN" online />
          <WkAvatar src="https://i.pravatar.cc/80?img=12" alt="User 1" />
          <WkAvatar src="https://i.pravatar.cc/80?img=14" alt="User 2" roundness="roundrect" />
          <WkAvatar src="https://i.pravatar.cc/80?img=15" alt="User 3" online />
          <WkAvatar src="https://broken-url-fallback-test.invalid/x.png" alt="Falls back to initials" name="FB" />
        </div>
      </section>

      <section class="section">
        <h2>Avatar Stack</h2>
        <div class="stack">
          <span class="row__item">3 items, no overflow</span>
          <WkAvatarStack :items="avatarStackItems.slice(0, 3)" />
          <span class="row__item">10 items, max=3 → shows 3 + “+7”</span>
          <WkAvatarStack :items="avatarStackItems" :max="3" />
          <span class="row__item">Size = small, 10 items, max=4</span>
          <WkAvatarStack :items="avatarStackItems" :max="4" size="small" />
          <span class="row__item">Custom overflow slot (uppercase label)</span>
          <WkAvatarStack :items="avatarStackItems" :max="2">
            <template #overflow="{ count }">+{{ count }} more</template>
          </WkAvatarStack>
          <span class="row__item">animation = pulse (whole stack)</span>
          <WkAvatarStack :items="avatarStackItems" :max="3" animation="pulse" />
          <span class="row__item">animation = bounce (whole stack)</span>
          <WkAvatarStack :items="avatarStackItems" :max="3" animation="bounce" />
          <span class="row__item">animation = ring (whole stack)</span>
          <WkAvatarStack :items="avatarStackItems" :max="3" animation="ring" />
        </div>
      </section>

      <section class="section">
        <h2>Empty — variants</h2>
        <div class="empty-grid">
          <div v-for="v in emptyVariants" :key="v" class="empty-cell">
            <span class="row__item">{{ v }}</span>
            <WkEmpty :variant="v" title="Title" description="Description">
              <template #media>
                <WkEmptyIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
                    <path d="M4 10h16" stroke="currentColor" stroke-width="1.5" />
                  </svg>
                </WkEmptyIcon>
              </template>
              <WkButton>Button</WkButton>
              <a href="#" class="empty-link" @click.prevent>Link</a>
            </WkEmpty>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Empty — example states</h2>
        <div class="empty-grid">
          <div class="empty-cell">
            <WkEmpty
              variant="outline-dashed"
              title="Cloud Storage Empty"
              description="Upload files to your cloud storage to access them anywhere."
            >
              <template #media>
                <WkEmptyIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M7 18a4 4 0 1 1 .9-7.9A6 6 0 0 1 18 11a3.5 3.5 0 0 1 0 7H7Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 14v-4m0 0-2 2m2-2 2 2"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </WkEmptyIcon>
              </template>
              <WkButton>Upload Files</WkButton>
            </WkEmpty>
          </div>
          <div class="empty-cell">
            <WkEmpty
              variant="background"
              title="No Notifications"
              description="You're all caught up. New notifications will appear here."
            >
              <template #media>
                <WkEmptyIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M6 9a6 6 0 1 1 12 0v3l1.5 3h-15L6 12V9Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </WkEmptyIcon>
              </template>
              <WkButton variant="outline">Refresh</WkButton>
            </WkEmpty>
          </div>
          <div class="empty-cell">
            <WkEmpty
              title="User Offline"
              description="This user is currently offline. You can leave a message to notify them or try again later."
            >
              <template #media>
                <WkAvatar src="https://i.pravatar.cc/80?img=12" alt="" />
              </template>
              <WkButton>Leave Message</WkButton>
            </WkEmpty>
          </div>
          <div class="empty-cell">
            <WkEmpty title="No Team Members" description="Invite your team to collaborate on this project.">
              <template #media>
                <WkAvatarStack :items="avatarStackItems.slice(0, 3)" />
              </template>
              <WkButton>Invite Members</WkButton>
            </WkEmpty>
          </div>
          <div class="empty-cell">
            <WkEmpty
              title="404 — Not Found"
              description="The page you're looking for doesn't exist. Try searching for what you need below."
            />
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Field — Vertical layout (wraps existing inputs)</h2>
        <div class="field-grid">
          <WkField label="Label">
            <WkInput v-model="fieldText" placeholder="Value" />
          </WkField>
          <WkField label="Label">
            <WkSelect :value="fieldSelect" :options="fieldOptions" @change="fieldSelect = $event" />
          </WkField>
          <WkField label="Label" align="start">
            <WkRadioGroup :value="fieldRadio" :options="fieldOptions" @change="fieldRadio = $event" />
          </WkField>
          <WkField label="Label" align="start">
            <textarea class="field-textarea" placeholder="Type your message here." />
          </WkField>
          <WkField label="Label" align="start">
            <div class="field-checkbox-list">
              <WkCheckboxGroup label="Option 1" :checked="true" />
              <WkCheckboxGroup label="Option 2" />
              <WkCheckboxGroup label="Option 3" />
            </div>
          </WkField>
          <WkField label="Label">
            <WkSlider :value="fieldSlider" @change="fieldSlider = $event" />
          </WkField>
        </div>
      </section>

      <section class="section">
        <h2>Field — Horizontal layout</h2>
        <div class="field-grid">
          <WkField layout="horizontal" label="Label">
            <WkInput v-model="fieldText" placeholder="Value" />
          </WkField>
          <WkField layout="horizontal" label="Label">
            <WkSelect :value="fieldSelect" :options="fieldOptions" @change="fieldSelect = $event" />
          </WkField>
          <WkField layout="horizontal" label="Label" align="start">
            <WkRadioGroup
              :value="fieldRadio"
              :options="fieldOptions.slice(0, 2)"
              direction="horizontal"
              @change="fieldRadio = $event"
            />
          </WkField>
          <WkField layout="horizontal" label="Label" align="start">
            <textarea class="field-textarea" placeholder="Type your message here." />
          </WkField>
          <WkField layout="horizontal" label="Label" align="start">
            <div class="field-checkbox-list">
              <WkCheckboxGroup label="Option 1" />
              <WkCheckboxGroup label="Option 2" />
              <WkCheckboxGroup label="Option 3" />
            </div>
          </WkField>
          <WkField layout="horizontal" label="Label">
            <WkSlider :value="fieldSlider" @change="fieldSlider = $event" />
          </WkField>
        </div>
      </section>

      <section class="section">
        <h2>Field — example states</h2>
        <div class="field-form">
          <WkField label="Name" required error-text="This field is require">
            <WkInput placeholder="Enter your name..." :error="true" />
          </WkField>
          <WkField label="E-mail address" help-text="This field is require">
            <WkInput placeholder="Enter your e-mail address..." />
          </WkField>
          <WkField label="Category">
            <WkSelect :options="fieldOptions" />
          </WkField>
          <WkField label="Message" align="start">
            <textarea class="field-textarea" placeholder="Type your message here." />
          </WkField>
        </div>
        <div class="field-form field-form--horizontal">
          <WkField layout="horizontal" label="Width">
            <WkInput placeholder="Value" />
          </WkField>
          <WkField layout="horizontal" label="Max. width">
            <WkInput placeholder="Value" />
          </WkField>
          <WkField layout="horizontal" label="Height">
            <WkInput placeholder="Value" />
          </WkField>
          <WkField layout="horizontal" label="Max. height">
            <WkInput placeholder="Value" />
          </WkField>
        </div>
      </section>

      <section class="section">
        <h2>Tooltip — sides (hover the boxes, or toggle 'open' to pin)</h2>
        <div class="tooltip-grid">
          <div v-for="s in tooltipSides" :key="s" class="tooltip-cell">
            <span class="row__item">side = {{ s }}</span>
            <WkTooltip :side="s" title="Tooltip text" :open="tooltipsPinned">
              <span class="tooltip-anchor" tabindex="0">Hover me</span>
            </WkTooltip>
          </div>
        </div>
        <div class="row">
          <label class="row__item">
            <input type="checkbox" v-model="tooltipsPinned" />
            Pin all tooltips open (showcase mode)
          </label>
        </div>
      </section>

      <section class="section">
        <h2>Tooltip — examples</h2>
        <div class="tooltip-examples">
          <WkTooltip side="top" title="Add to library" :open="tooltipsPinned">
            <button class="tooltip-icon-button" type="button" aria-label="Add to library">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </WkTooltip>
          <WkTooltip
            side="right"
            title="To learn more about how this works, check out the docs. If you have any questions, please reach out to us."
            :max-width="205"
          >
            <WkButton variant="outline">Export File</WkButton>
          </WkTooltip>
        </div>
      </section>

      <section class="section">
        <h2>Tooltip — color & arrow</h2>

        <WkiAArrowDown color="var(--green-500)" fill="var(--green-500)" />
        <WkiAArrowUp color="var(--blue-500)" :size="64" :stroke-width="1" />

        <WkDropdown :items="dropdownItems">
          <WkButton>Dropdown</WkButton>
        </WkDropdown>
      </section>

      <section class="section">
        <h2>Table — data-driven, bordered, sortable</h2>
        <WkTable :columns="tableColumns" :data-source="tableData" bordered>
          <template #bodyCell="{ column, text }">
            <WkButton v-if="column.dataIndex === 'operation'" size="xs" variant="ghost">Edit</WkButton>
            <template v-else>{{ text }}</template>
          </template>
        </WkTable>

        <h2 style="margin-top: 24px">Table — row selection</h2>
        <WkTable
          :columns="tableColumns"
          :data-source="tableData"
          row-selection
          :selected-row-keys="tableSelectedKeys"
          @update:selectedRowKeys="tableSelectedKeys = $event"
        />
        <p>Selected keys: {{ tableSelectedKeys.join(', ') || '(none)' }}</p>

        <h2 style="margin-top: 24px">Table — empty</h2>
        <WkTable :columns="tableColumns" :data-source="[]" bordered />

        <h2 style="margin-top: 24px">Table — fixed scroll (x: 600, y: 494) + height 524</h2>
        <WkTable
          :columns="tableColumns"
          :data-source="tableScrollData"
          bordered
          :scroll="{ y: 494, x: 600 }"
          :height="524"
        />

        <h2 style="margin-top: 24px">Table — virtual scrolling (10,000 rows)</h2>
        <WkTable
          :columns="tableColumns"
          :data-source="tableHugeData"
          bordered
          virtual
          :height="500"
          :row-height="39"
          row-selection
          :selected-row-keys="tableHugeSelectedKeys"
          @update:selectedRowKeys="tableHugeSelectedKeys = $event"
        />
        <p>Selected keys: {{ tableHugeSelectedKeys.join(', ') || '(none)' }}</p>

        <WkTag> </WkTag>
      </section>

      <section class="section">
        <h2>Textarea — size × roundness, states</h2>
        <div style="display: flex; gap: 64px; align-items: flex-start">
          <div style="display: flex; flex-direction: column; gap: 16px; width: 320px">
            <span style="font-size: 12px; color: #9747ff">Roundness: Default</span>
            <WkTextarea placeholder="Type your message here." />
            <WkTextarea value="Value" />
            <WkTextarea error value="Value" />
            <WkTextarea disabled value="Value" />
            <WkTextarea size="mini" placeholder="Mini · type your message here." />
            <WkTextarea size="mini" value="Mini value" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px; width: 320px">
            <span style="font-size: 12px; color: #9747ff">Roundness: Round</span>
            <WkTextarea roundness="round" placeholder="Type your message here." />
            <WkTextarea roundness="round" value="Value" />
            <WkTextarea roundness="round" error value="Value" />
            <WkTextarea roundness="round" disabled value="Value" />
            <WkTextarea roundness="round" size="mini" placeholder="Mini · type your message here." />
            <WkTextarea roundness="round" size="mini" value="Mini value" />
          </div>
        </div>

        <h2 style="margin-top: 24px">Textarea — v-model + non-resizable</h2>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 320px">
          <WkTextarea v-model="textareaModel" placeholder="Edit me" />
          <p>Model: {{ textareaModel }}</p>
          <WkTextarea :resizable="false" value="Resize handle disabled" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { WkiAArrowDown, WkiAArrowUp } from '../../src/icons'
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
      textareaModel: 'Editable value',
      loading: false,
      openDialog: false,
      openDialog2: false,
      selected: '',
      tableColumns: [
        { title: 'Name', dataIndex: 'name', width: '30%' },
        { title: 'Age', dataIndex: 'age', align: 'right', sorter: true },
        { title: 'Address', dataIndex: 'address' },
        { title: 'Action', dataIndex: 'operation', align: 'right' }
      ],
      tableData: [
        { key: '1', name: 'Edward King', age: 32, address: 'London, Park Lane no. 0' },
        { key: '2', name: 'Jim Green', age: 42, address: 'London, Park Lane no. 1' },
        { key: '3', name: 'Joe Black', age: 28, address: 'Sydney No. 1 Lake Park' }
      ],
      tableSelectedKeys: ['2'],
      tableScrollData: Array.from({ length: 20 }, (_, i) => ({
        key: 'r' + i,
        name: 'User ' + (i + 1),
        age: 20 + (i % 30),
        address: 'Street No. ' + (i + 1) + ', Some City'
      })),
      tableHugeSelectedKeys: ['v500'],
      tableHugeData: Array.from({ length: 10000 }, (_, i) => ({
        key: 'v' + i,
        name: 'User ' + (i + 1),
        age: 20 + (i % 30),
        address: 'Street No. ' + (i + 1) + ', Some City'
      })),
      dropdownItems: [
        {
          key: 'edit',
          label: 'Edit',
          icon: WkiAArrowDown,
          destructive: true,
          children: [
            { key: 'edit', label: 'Edit', icon: WkiAArrowDown, destructive: true },
            { key: 'delete', label: 'Delete', icon: WkiAArrowUp }
          ]
        },
        { key: 'delete', label: 'Delete', icon: WkiAArrowUp }
      ],
      avatarStackItems: [
        { name: 'AB' },
        { name: 'CD' },
        { name: 'EF' },
        { name: 'GH' },
        { name: 'IJ' },
        { name: 'KL' },
        { name: 'MN' },
        { name: 'OP' },
        { name: 'QR' },
        { name: 'ST' }
      ],
      emptyVariants: ['default', 'outline', 'background', 'outline-dashed'],
      fieldText: '',
      fieldSelect: '',
      fieldRadio: 'a',
      fieldSlider: 50,
      fieldOptions: [
        { label: 'Option 1', value: 'a' },
        { label: 'Option 2', value: 'b' },
        { label: 'Option 3', value: 'c' }
      ],
      tooltipSides: ['top', 'bottom', 'left', 'right'],
      tooltipsPinned: true,
      iconNames: [
        'search',
        'x',
        'check',
        'chevron-down',
        'chevron-up',
        'chevron-left',
        'chevron-right',
        'eye',
        'eye-off',
        'plus',
        'minus',
        'trash',
        'edit',
        'loader',
        'info',
        'warning',
        'circle-check',
        'circle-x'
      ],
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
      inputSizes: ['regular', 'large', 'small', 'xs'],
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
  components: {
    WkiAArrowDown,
    WkiAArrowUp
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
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-10);
  width: 80px;
}
.icon-label {
  font-size: 10px;
  color: var(--muted-fg);
  text-align: center;
  word-break: break-all;
}

.empty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(372px, 1fr));
  gap: 24px;
  width: 100%;
}
.empty-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 420px;
}
.empty-link {
  font: var(--font-paragraph-small);
  font-weight: var(--paragraph-medium-font-weight);
  color: var(--primary-brand-fg);
  text-decoration: none;
}
.empty-link:hover {
  text-decoration: underline;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 720px;
}
.field-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 342px;
  max-width: 100%;
}
.field-form--horizontal {
  margin-top: var(--spacing-2xl);
}
.field-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
.field-textarea {
  display: block;
  width: 100%;
  min-height: 76px;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-family: var(--font-family-body);
  font-size: var(--paragraph-small-font-size);
  line-height: var(--paragraph-small-line-height);
  color: var(--primary-fg);
  background: var(--primary-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--rounded-xl);
  resize: vertical;
  box-sizing: border-box;
}
.field-textarea::placeholder {
  color: var(--muted-fg);
}
.field-textarea:focus-visible {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.tooltip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, max-content));
  gap: 48px 32px;
  padding: 32px;
}
.tooltip-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.tooltip-anchor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 36px;
  padding: 0 12px;
  background: var(--accent-bg);
  border: 1px dashed var(--border-primary);
  border-radius: var(--rounded-lg);
  font-size: var(--paragraph-small-font-size);
  color: var(--secondary-fg);
  cursor: default;
}
.tooltip-anchor:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--focus-ring);
}
.tooltip-examples {
  display: flex;
  align-items: center;
  gap: 64px;
  padding: 48px 32px;
}
.tooltip-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: var(--ghost-hover);
  color: var(--primary-fg);
  border: 1px solid var(--border-primary);
  border-radius: var(--rounded-xl);
  cursor: pointer;
}
.tooltip-icon-button > svg {
  width: 16px;
  height: 16px;
}
.tooltip-icon-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--focus-ring);
}
</style>
