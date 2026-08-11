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
        <WkSwitch></WkSwitch>

        <WkButton @click="openDialog = true" size="xs">
          <template #icon>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M9 13 7 11 4 14" />
              <path d="M14 10 12 12 17 17" />
            </svg>
          </template>
        </WkButton>
        <WkDialog
          centered
          :open="openDialog"
          @cancel="openDialog = false"
          @ok="handleOk"
          :confirmLoading="loading"
          width="1000"
          :title="'Sửa sản phẩm'"
          :subText="'Sản phẩm abcsdcjasoihcoasdhcouasidhclkjsdhklcsalkjflsdafhasdjfhasjdfhasdfjhsajdkchasjch qươ. cqwc qưohic. coqwoch ưq c. coáhcosd.  oidsfoasfyosa.   ódahfo sa.  oacosa c.  oácyoasc qư. ócaocy ó cdo.  cqwcoo'"
        >
          <div>
            <WkButton @click="openDialog2 = true">Open Dialog 2</WkButton>
            <div>Dialog 22222</div>
          </div>
        </WkDialog>
        <WkDialog :open="openDialog2" @cancel="openDialog2 = false" @ok="openDialog2 = false" :zIndex="2000">
          <template #header>
            <div>Dialog 22222</div>
          </template>
          <p>abcccc</p>
          <WkDropdown :items="dropdownOptions">
            <WkTooltip :title="'12312dssdfsdf'" side="bottom"> sadfsafssadfsdf </WkTooltip>
          </WkDropdown>
        </WkDialog>

        <WkTag size="sm">
          alooo
          <template #icon>
            <WkiChessBishop :size="12" />
          </template>
        </WkTag>
      </section>

      <section class="section">
        <h2>Pagination</h2>
        <div class="row">
          <WkPagination
            :current="paginationPage"
            :total="200"
            :page-size="10"
            :siblings="1"
            :boundary="1"
            :prevLabel="'ssss'"
            :nextLabel="'ssss'"
            @change="paginationPage = $event"
          />
          <span class="row__item">current = {{ paginationPage }} (click `…` to jump ±5 pages)</span>
        </div>
      </section>

      <section class="section">
        <h2>Toggle Group — all sizes</h2>
        <div class="stack">
          <div v-for="s in tgSizes" :key="s" class="row">
            <span class="row__item" style="width: 28px">{{ s }}</span>
            <WkToggleGroup :value="tgSizeValue[s]" :size="s" label="Text alignment" @change="tgSizeValue[s] = $event">
              <WkToggle value="left">
                <template #icon>
                  <WkiChessBishop :size="['mini', 'xs'].includes(s) ? 16 : 20" />
                </template>
              </WkToggle>
              <WkToggle value="center">
                <template #icon>
                  <WkiChessBishop :size="['mini', 'xs'].includes(s) ? 16 : 20" />
                </template>
              </WkToggle>
              <WkToggle value="right">
                <template #icon>
                  <WkiChessBishop :size="['mini', 'xs'].includes(s) ? 16 : 20" />
                </template>
              </WkToggle>
            </WkToggleGroup>
            <code style="font-size: 11px">{{ tgSizeValue[s] }}</code>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
            <WkButtonGroup>
              <WkButton variant="outline" size="sm">Bold</WkButton>
              <WkButton variant="outline" size="sm">Italic</WkButton>
              <WkButton variant="outline" size="sm">Underline</WkButton>
            </WkButtonGroup>
            <WkButtonGroup>
              <WkButton variant="outline" size="xs">Left</WkButton>
              <WkButton variant="outline" size="xs">Center</WkButton>
              <WkButton variant="outline" size="xs">Right</WkButton>
            </WkButtonGroup>
          </div>
        </div>

        <h2 style="margin-top: 24px">Toggle Group — multiple select (ghost variant)</h2>
        <div class="row">
          <WkToggleGroup :value="tgFormat" multiple size="md" @change="tgFormat = $event">
            <WkToggle value="bold" variant="ghost">Bold</WkToggle>
            <WkToggle value="italic" variant="ghost">Italic</WkToggle>
            <WkToggle value="underline" variant="ghost">Underline</WkToggle>
          </WkToggleGroup>
          <code style="font-size: 11px">{{ JSON.stringify(tgFormat) }}</code>
        </div>
      </section>

      <section>
        <WkBreadcrumb :items="breadcrumbSlash" />
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
        <WkButton :loading="true">Loading</WkButton>
        <WkButton :disabled="true">Disabled</WkButton>
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
          <!-- <WkAvatar src="https://broken-url-fallback-test.invalid/x.png" alt="Falls back to initials" name="FB" /> -->
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
          <WkField label="Label" help-text="aloooo">
            <WkInput v-model="fieldText" type="time" step="1" placeholder="Value">
              <template #prefix> fjasjfkkjsafkjsaf </template>
            </WkInput>
            <template #message-icon>&nbsp;</template>
          </WkField>
          <WkField label="Label">
            <WkInputNumber v-model="fieldText" placeholder="Value" size="xs">
              <template #prefix> fjasjfkkjsafkjsaf </template>
              <template #suffix> hsdhjfshjdf </template>
            </WkInputNumber>
          </WkField>
          <WkField label="Label">
            <WkSelect :value="fieldSelect" @change="fieldSelect = $event">
              <WkSelectOption v-for="opt in fieldOptions" :key="opt.value" :value="opt.value" size="lg">
                <template #prefix>
                  <WkiChessBishop :size="16" />
                </template>
                {{ opt.label }}
                <template #suffix>
                  <span>USD</span>
                </template>
              </WkSelectOption>
            </WkSelect>
          </WkField>
          <WkField label="Label" align="start">
            <WkRadioGroup :value="fieldRadio" :options="fieldOptions" @change="fieldRadio = $event" />
          </WkField>
          <WkField label="Label" align="start">
            <textarea class="field-textarea" placeholder="Type your message here." />
          </WkField>
          <WkField label="Label" align="start">
            <div class="field-checkbox-list">
              <WkCheckboxGroup label="Option 1" :modelValue="true" />
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
        <div class="tooltip-examples">
          <WkTooltip side="top" title="Default color" :open="tooltipsPinned">
            <span class="tooltip-anchor" tabindex="0">default</span>
          </WkTooltip>
          <WkTooltip side="top" title="Brand color" color="brand" :open="tooltipsPinned">
            <span class="tooltip-anchor" tabindex="0">brand</span>
          </WkTooltip>
          <WkTooltip side="top" title="Destructive" color="destructive" :open="tooltipsPinned">
            <span class="tooltip-anchor" tabindex="0">destructive</span>
          </WkTooltip>
          <WkTooltip side="top" title="No arrow" :arrow="false">
            <span class="tooltip-anchor" tabindex="0">arrow = false</span>
          </WkTooltip>
        </div>
      </section>

      <section class="section">
        <h2>Tooltip — color & arrow</h2>

        <WkiAArrowDown color="var(--green-500)" fill="var(--green-500)" />
        <WkiAArrowUp color="var(--blue-500)" :size="64" :stroke-width="1" />
        <WkiChessBishop color="var(--blue-500)" :size="64" :stroke-width="1" />
      </section>

      <section class="section" style="margin-bottom: 300px">
        <h2>Select — new features</h2>

        <div :style="{ marginTop: '50px', marginBottom: '50px' }">
          <WkPopover>
            <template #trigger>
              <WkButton>Mở popover</WkButton>
            </template>
            <div
              :style="{ width: '500px', height: '300px', display: 'flex', alignItems: 'end', justifyContent: 'end' }"
            >
              <WkButton>Nội dung popover</WkButton>
              <WkDropdown :items="dropdownOptions" :value="dropdownActive" @select="handleDropdownActive" size="lg">
                <WkButton>test</WkButton>
              </WkDropdown>
            </div>
          </WkPopover>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px">
          <div>
            <p style="font-size: 12px; color: var(--muted-fg); margin-bottom: 6px">Single (default)</p>
            <WkSelect
              :value="selectSingle"
              placeholder="Pick one"
              @change="selectSingle = $event"
              size="xs"
              option-size="sm"
              listHeight="max-content"
              showChecked
            >
              <WkSelectOption v-for="opt in selectOptions" :key="opt.value" :value="opt.value" :label="opt.label" />
              <template #contentHeader>
                <WkButton variant="secondary" :style="{ width: '100%', marginTop: '8px' }">Thêm mới</WkButton>
                <WkDivider />
              </template>
              <template #contentFooter>
                <WkDivider />
                <WkButton variant="secondary" :style="{ width: '100%', marginTop: '8px' }">Thêm mới</WkButton>
              </template>
            </WkSelect>
            <code style="font-size: 11px">{{ selectSingle }}</code>
          </div>
          <WkSelect
            :value="selectSingle"
            @change="selectSingle = $event"
            size="xs"
            optionSize="sm"
            :overlayStyle="{ minWidth: '160px' }"
          >
            <template v-if="eventIcon[selectSingle]" #icon>
              <component :is="eventIcon[selectSingle]" :size="16" />
            </template>

            <WkSelectOption value="add_to_cart">
              <template #prefix>
                <component :is="eventIcon.add_to_cart" :size="16" />
              </template>
              {{ 'elements.list_product.add_to_cart' }}
            </WkSelectOption>
            <WkSelectOption value="buy_now">
              <template #prefix>
                <component :is="eventIcon.buy_now" :size="16" />
              </template>
              {{ 'elements.list_product.buy_now' }}
            </WkSelectOption>
            <WkSelectOption value="open_popup">
              <template #prefix>
                <component :is="eventIcon.open_popup" :size="16" />
              </template>
              {{ 'trait.open_popup' }}
            </WkSelectOption>
            <WkSelectOption value="back_home">
              <template #prefix>
                <component :is="eventIcon.back_home" :size="16" />
              </template>
              {{ 'trait.back_home' }}
            </WkSelectOption>
            <WkSelectOption value="open_link">
              <template #prefix>
                <component :is="eventIcon.open_link" :size="16" />
              </template>
              {{ 'trait.redirect_link' }}
            </WkSelectOption>
          </WkSelect>
          <div>
            <p style="font-size: 12px; color: var(--muted-fg); margin-bottom: 6px">Searchable</p>
            <WkSelect
              size="xs"
              optionSize="sm"
              showChecked
              :value="selectSearchable"
              :options="eventPromotionOptions"
              searchable
              placeholder="Type to search"
              @change="selectSearchable = $event"
            />
            <code style="font-size: 11px">{{ selectSearchable }}</code>
          </div>
          <div>
            <p style="font-size: 12px; color: var(--muted-fg); margin-bottom: 6px">Multiple</p>
            <WkSelect
              :value="selectMultiple"
              :options="selectOptions"
              mode="multiple"
              placeholder="Pick many"
              @change="selectMultiple = $event"
            />
            <code style="font-size: 11px">{{ JSON.stringify(selectMultiple) }}</code>
          </div>
          <div>
            <p style="font-size: 12px; color: var(--muted-fg); margin-bottom: 6px">
              Tags mode (gõ + Enter tạo tag mới)
            </p>
            <WkSelect
              :value="selectMultiSearch"
              :options="[]"
              mode="tags"
              size="xs"
              placeholder="Gõ rồi Enter…"
              :list-height="384"
              @change="selectMultiSearch = $event"
              option-size="lg"
            >
              <template #empty>
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    height: 100%;
                    width: 100%;
                    justify-content: center;
                  "
                >
                  <img
                    style="width: 56px; height: 56px"
                    src="https://content.pancake.vn/web-media-262/2e/2a/0c/96/c2b58ae9f06c4dc2a3b83016e56d5b4132ff40637862ba23435e43a0-w:224-h:224-l:3927-t:image/png.png"
                    alt=""
                  />
                  <span style="font-size: 12px; color: var(--muted-fg)">Không có dữ liệu</span>
                </div>
              </template>
            </WkSelect>
            <code style="font-size: 11px">{{ JSON.stringify(selectMultiSearch) }}</code>
          </div>
          <div>
            <p style="font-size: 12px; color: var(--muted-fg); margin-bottom: 6px">filterOption (tìm theo name)</p>
            <WkSelect
              :value="selectFilter"
              :filter-option="customFilterOption"
              placeholder="Search by name"
              @change="selectFilter = $event"
              size="xs"
              :append="'allll'"
              :prepend="'xxxx'"
            >
              <WkSelectOption v-for="option in selectOptionsNamed" :key="option.value" :value="option.value">
                <WkDropdown :items="dropdownOptions">
                  <WkTooltip :title="option.name" side="top">
                    {{ option.name }}
                  </WkTooltip>
                </WkDropdown>
              </WkSelectOption>
            </WkSelect>
            <code style="font-size: 11px">{{ selectFilter }}</code>
          </div>
        </div>
      </section>

      <section>
        <!-- <WkTypography variant="paragraph-regular" align="right" color="primary-fg">Aligned right</WkTypography>
        <h2>Table — data-driven, bordered, sortable</h2>
        <WkTable
          :columns="tableColumns"
          :data-source="tableData"
          bordered
          :customRow="customRowExample"
          :customHeader="customHeaderExample"
        >
          <template #bodyCell="{ column, record }">
            <WkButton v-if="column.dataIndex === 'operation'" size="xs" variant="ghost">Edit</WkButton>
            <template v-else>{{ record.name + 'aaaa' }}</template>
          </template>
        </WkTable> -->

        <!-- <h2 style="margin-top: 24px">Table — row selection</h2>
        <WkTable :columns="tableColumns" :data-source="tableData">
          <template #bodyCell="{ column, record }">
            <WkTypography variant="heading-3" as="div" @dblclick="handleClickTypo"
              >heading-3 rendered as &lt;div&gt; via as prop</WkTypography
            >
            <WkButton v-if="column.dataIndex === 'operation'" size="xs" variant="ghost">Edit</WkButton>
            <template v-else>{{ record.name + 'aaaa' }}. 123123fds;k</template>
          </template>
        </WkTable>
        <p>Selected keys: {{ tableSelectedKeys.join(', ') || '(none)' }}</p>

        <h2 style="margin-top: 24px">Table — empty</h2>
        <WkTable :columns="tableColumns" :data-source="[]" bordered /> -->

        <h2 style="margin-top: 24px">Table — fixed scroll (x: 600, y: 494) + height 524</h2>
        <WkTable
          :columns="tableColumns"
          :data-source="tableScrollData"
          :scroll="{ y: 400, x: 1200 }"
          bordered
          row-selection
          :selected-row-keys="tableSelectedKeys"
          @update:selectedRowKeys="tableSelectedKeys = $event"
          isDrag
          :rowHeight="50"
        />

        <h2 style="margin-top: 24px">Table — drag &amp; drop rows</h2>
        <WkTable
          :columns="tableColumns"
          :data-source="tableDragData"
          isDrag
          @drag-record="onTableDragRecord"
          :rowHeight="50"
        />
        <p style="margin-top: 8px; font-size: 12px; color: var(--muted-fg)">
          Order: {{ tableDragData.map(r => r.name).join(' → ') }}
        </p>

        <!-- <h2 style="margin-top: 24px">Table — virtual scrolling (10,000 rows)</h2>
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
        <p>Selected keys: {{ tableHugeSelectedKeys.join(', ') || '(none)' }}</p> -->
      </section>

      <WkSidebarItem>
        sfhmvsjfjsda
        <template #icon>
          <WkiChessBishop :size="20" color="var(--primary-fg)" />
        </template>
      </WkSidebarItem>

      <WkDropdown :items="dropdownOptions" :value="dropdownActive" @select="handleDropdownActive" size="lg">
        <WkButton>test</WkButton>
      </WkDropdown>
      {{ dropdownActive }}
      <WkTypography variant="heading-3" as="div" @dblclick="handleClickTypo"
        >heading-3 rendered as &lt;div&gt; via as prop</WkTypography
      >

      <WkTag size="sm">
        <template #icon>
          <wki-chess-bishop :size="12" />
        </template>
        sjfjsdkjlfjfds
      </WkTag>

      <section class="section">
        <h2>Textarea — size × roundness, states</h2>
        <div style="display: flex; gap: 64px; align-items: flex-start">
          <div style="display: flex; flex-direction: column; gap: 16px; width: 320px">
            <span style="font-size: 12px; color: #9747ff">Roundness: Default</span>
            <WkTextarea placeholder="Type your message here." :autosize="true" v-model="textareaModel" showCount />
            <WkTextarea value="Value" v-model="textareaModel" :rows="10" />
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
          <WkTextarea :resizable="true" value="Resize handle disabled" />
        </div>
      </section>

      <section class="section">
        <h2>Alert — types</h2>
        <div class="alert-examples">
          <WkAlert
            v-for="t in alertTypes"
            :key="t"
            :type="t"
            title="Item added successfully"
            description="This is an alert with icon, title and description."
          />
        </div>
      </section>

      <section class="section">
        <h2>Alert — action &amp; closable</h2>
        <div class="alert-examples">
          <WkAlert type="neutral" title="Item added successfully" description="Line 2" closable @close="onAlertClose" />
          <WkAlert type="neutral" title="Item added successfully">
            <template #action>
              <WkButton variant="ghost" size="xs">Label</WkButton>
            </template>
          </WkAlert>
          <WkAlert
            type="error"
            title="Error! API call failed"
            description="This is an alert with icon, title and description."
            closable
            @close="onAlertClose"
          >
            <template #action>
              <WkButton variant="ghost" size="xs">Support</WkButton>
            </template>
          </WkAlert>
          <WkAlert type="info" title="Custom icon" description="Icon slot overrides the default.">
            <template #icon>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path
                  d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                />
              </svg>
            </template>
          </WkAlert>
        </div>
      </section>

      <section class="section">
        <h2>Progress</h2>
        <div style="display: flex; flex-direction: column; gap: 24px; max-width: 342px">
          <div
            v-for="v in [0, 10, 25, 33, 50, 66, 75, 90, 100]"
            :key="v"
            style="display: flex; align-items: center; gap: 16px"
          >
            <span style="width: 48px; font-size: 12px; color: var(--secondary-fg)">{{ v }}</span>
            <WkProgress :value="v" />
          </div>
          <div style="display: flex; align-items: center; gap: 16px">
            <span style="width: 48px; font-size: 12px; color: var(--secondary-fg)">3 / 4</span>
            <WkProgress :value="3" :max="4" />
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Message (wkMessage service)</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 12px">
          <WkButton @click="msgSuccess">Success</WkButton>
          <WkButton variant="outline" @click="msgError">Error</WkButton>
          <WkButton variant="outline" @click="msgInfo">Info</WkButton>
          <WkButton variant="outline" @click="msgWarning">Warning</WkButton>
          <WkButton variant="outline" @click="msgLoading">Loading (2.5s)</WkButton>
          <WkButton variant="outline" @click="msgUpdate">Loading → success</WkButton>
          <WkButton variant="outline" @click="msgBottom">Bottom placement</WkButton>
          <WkButton variant="outline" @click="msgCorner">Top-right (overlap)</WkButton>
          <WkButton variant="outline" @click="msgMaxCount">Spam (maxCount 3)</WkButton>
          <WkButton variant="ghost" @click="msgDestroyAll">Destroy all</WkButton>
        </div>
      </section>

      <section class="section">
        <h2>Date Picker</h2>
        <div class="dp-grid">
          <label>single</label>

          <div :style="{ width: '500px' }">
            <WkDatePicker v-model="dpSingle" />
            <WkSelect :value="fieldSelect" @change="fieldSelect = $event">
              <WkSelectOption v-for="opt in fieldOptions" :key="opt.value" :value="opt.value" size="lg">
                <template #prefix>
                  <WkiChessBishop :size="16" />
                </template>
                {{ opt.label }}
                <template #suffix>
                  <span>USD</span>
                </template>
              </WkSelectOption>
            </WkSelect>
          </div>
          <label>Range<WkDatePicker v-model="dpRange" mode="range" :months="2" placement="center" /></label>
          <label>Multiple<WkDatePicker v-model="dpMultiple" mode="multiple" :max-count="2" /></label>
          <label>Date + time<WkDatePicker v-model="dpDateTime" show-time /></label>
          <label>Min/Max (this month)<WkDatePicker v-model="dpMinMax" :min-date="dpMin" :max-date="dpMax" /></label>
          <label>Disabled weekends<WkDatePicker v-model="dpNoWeekend" :disabled-date="disableWeekends" /></label>
          <label>Custom format<WkDatePicker v-model="dpFormat" format="MMM DD, YYYY" /></label>
          <label>Month/Year selects<WkDatePicker v-model="dpSelects" show-select-year show-select-month /></label>
          <label>Disabled<WkDatePicker disabled /></label>
        </div>
        <div class="dp-values">
          <div>single: {{ dpSingle }}</div>
          <div>range: {{ dpRange }}</div>
          <div>multiple: {{ dpMultiple }}</div>
          <div>date+time: {{ dpDateTime }}</div>
        </div>
      </section>

      <section class="section">
        <h2>Tabs — all sizes</h2>
        <div class="stack">
          <div v-for="s in tabsSizes" :key="s" class="row">
            <span class="row__item" style="width: 32px">{{ s }}</span>
            <WkTabs :tabs="tabsItems" :value="tabsValue[s]" :size="s" @change="tabsValue[s] = $event" />
            <code style="font-size: 11px">{{ tabsValue[s] }}</code>
          </div>
        </div>

        <h2 style="margin-top: 24px">Tabs — icon-only</h2>
        <div class="stack">
          <div v-for="s in tabsSizes" :key="'icon-' + s" class="row">
            <span class="row__item" style="width: 32px">{{ s }}</span>
            <WkTabs :tabs="tabsIconItems" :value="tabsIconValue[s]" :size="s" @change="tabsIconValue[s] = $event" />
          </div>
        </div>

        <h2 style="margin-top: 24px">Tabs — with counter &amp; disabled</h2>
        <WkTabs size="sm" :tabs="tabsCounterItems" :value="tabsCounterValue" @change="tabsCounterValue = $event" />
      </section>

      <section class="section">
        <h2>Table V2 — base (header + body)</h2>
        <WkTableV2
          :emptyText="'sjdfljskdfljs'"
          bordered
          enableFixedLeft
          :columns="tableV2Columns"
          :data-source="tableV2Data"
          :height="1000"
          :rowSelection="rowSelection"
          :rowDraggable="rowDraggable"
          :custom-row="tableV2CustomRow"
          :custom-header-row="tableV2CustomHeaderRow"
          :rowHeight="60"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'name'">
              <div style="display: flex; align-items: center; gap: 8px">
                <WkAvatar :src="record?.avatar" :name="record?.name" size="small" />
                <span>{{ text }}</span>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <!-- <span
                :style="{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: text === 'Active' ? 'var(--success-muted, #dcfce7)' : 'var(--neutral-muted, #f4f4f5)',
                  color: text === 'Active' ? 'var(--success-fg, #16a34a)' : 'var(--muted-fg, #71717a)'
                }"
                >{{ text }}</span
              > -->

              <WkBadge :variant="text === 'Active' ? 'primary' : 'secondary'" :label="text" />
            </template>
            <template v-else-if="column.dataIndex === 'action'">
              <WkDropdown :items="tableV2ActionItems" @select="handleTableV2Action($event, record)">
                <WkTooltip title="Actions" side="top">
                  <button
                    type="button"
                    style="
                      background: none;
                      border: none;
                      cursor: pointer;
                      padding: 4px 8px;
                      border-radius: 4px;
                      color: var(--fg);
                      font-size: 18px;
                      line-height: 1;
                    "
                  >
                    ···
                  </button>
                </WkTooltip>
              </WkDropdown>
            </template>
          </template>
        </WkTableV2>
      </section>

      <section class="section">
        <h2>Input Counter — sizes × states</h2>
        <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
          <div v-for="s in ['xs', 'sm', 'md', 'lg']" :key="s" style="display: flex; align-items: center; gap: 12px">
            <span style="width: 32px; font-size: 12px; color: var(--muted-fg)">{{ s }}</span>
            <WkInputCounter :size="s" v-model="icQty" :min="0" :step="10" placeholder="Qty" />
          </div>
          <WkInputCounter v-model="icQty" placeholder="Prefix / suffix">
            <template #prefix><span>$</span></template>
            <template #suffix><span>USD</span></template>
          </WkInputCounter>
          <WkInputCounter :value="5" error placeholder="Error" />
          <WkInputCounter :value="5" disabled placeholder="Disabled" />
          <WkInputCounter v-model="icQty" roundness="round" placeholder="Round" />
          <code style="font-size: 11px">qty = {{ icQty }}</code>
        </div>
      </section>

      <section class="section">
        <h2>Popover — trigger: click (default)</h2>
        <div class="row">
          <WkPopover :width="300">
            <template #trigger>
              <button type="button" class="wk-demo-trigger">Filters (click)</button>
            </template>
            <template #default="{ close }">
              <strong>Filter results</strong>
              <label style="display: flex; gap: 8px; align-items: center">
                <input type="checkbox" /> Only active
              </label>
              <label style="display: flex; gap: 8px; align-items: center">
                <input type="checkbox" /> Include archived
              </label>
              <input
                type="text"
                placeholder="Search by name…"
                style="width: 100%; box-sizing: border-box; padding: 6px 8px"
              />
              <div style="display: flex; justify-content: flex-end; gap: 8px">
                <button type="button" class="wk-demo-trigger" @click="close">Apply</button>
              </div>
            </template>
          </WkPopover>
        </div>

        <h2>Popover — trigger: hover</h2>
        <div class="row">
          <WkPopover :trigger="['hover']" :width="260" placement="bottom-start">
            <template #trigger>
              <button type="button" class="wk-demo-trigger">Settings (hover)</button>
            </template>
            <strong>Quick settings</strong>
            <label style="display: flex; gap: 8px; align-items: center"> <input type="checkbox" /> Dark mode </label>
            <label style="display: flex; gap: 8px; align-items: center">
              <input type="checkbox" /> Notifications
            </label>
          </WkPopover>
        </div>

        <h2>Popover — trigger: click + hover</h2>
        <div class="row">
          <WkPopover :trigger="['click', 'hover']" :width="240" placement="bottom-start">
            <template #trigger>
              <button type="button" class="wk-demo-trigger">More options (click or hover)</button>
            </template>
            <span>Option A</span>
            <span>Option B</span>
            <span>Option C</span>
          </WkPopover>
        </div>
      </section>

      <section class="section">
        <h2>HoverCard — trigger: hover (default)</h2>
        <div class="row">
          <WkHoverCard :width="500" placement="bottom-start">
            <template #trigger>
              <a href="#" class="wk-demo-trigger" @click.prevent>@webcake-ui (hover)</a>
            </template>
            <div style="display: flex; gap: 12px; align-items: center">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--accent-bg)"></div>
              <div>
                <div style="font-weight: 600">Webcake UI Kit</div>
                <div style="font-size: 12px; color: var(--muted-fg)">Dual-compat Vue 2 + Vue 3 components</div>
              </div>
            </div>
          </WkHoverCard>
        </div>

        <h2>HoverCard — trigger: click</h2>
        <div class="row">
          <WkHoverCard :trigger="['click']" :width="260" placement="bottom-start">
            <template #trigger>
              <a href="#" class="wk-demo-trigger" @click.prevent>@webcake-ui (click)</a>
            </template>
            <div style="display: flex; gap: 12px; align-items: center">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--accent-bg)"></div>
              <div>
                <div style="font-weight: 600">Webcake UI Kit</div>
                <div style="font-size: 12px; color: var(--muted-fg)">Click-to-pin preview card</div>
              </div>
            </div>
          </WkHoverCard>
        </div>

        <h2>HoverCard — trigger: click + hover</h2>
        <div class="row">
          <WkHoverCard :trigger="['click', 'hover']" :width="260" placement="bottom-start">
            <template #trigger>
              <a href="#" class="wk-demo-trigger" @click.prevent>@webcake-ui (click or hover)</a>
            </template>
            <div style="display: flex; gap: 12px; align-items: center">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--accent-bg)"></div>
              <div>
                <div style="font-weight: 600">Webcake UI Kit</div>
                <div style="font-size: 12px; color: var(--muted-fg)">Hover to preview, click to pin</div>
              </div>
            </div>
          </WkHoverCard>
        </div>
      </section>

      <section class="demo-section" style="padding: 48px 32px">
        <h2>Drawer</h2>
        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <WkButton size="sm" @click=";((drawerPlacement = 'bottom'), (drawerOpen = true))">Bottom</WkButton>
          <WkButton size="sm" @click=";((drawerPlacement = 'top'), (drawerOpen = true))">Top</WkButton>
          <WkButton size="sm" @click=";((drawerPlacement = 'left'), (drawerOpen = true))">Left</WkButton>
          <WkButton size="sm" @click=";((drawerPlacement = 'right'), (drawerOpen = true))">Right</WkButton>
          <WkButton size="sm" variant="outline" @click="drawerHandle = !drawerHandle">
            Handle: {{ drawerHandle ? 'on' : 'off' }}
          </WkButton>
        </div>
        <WkDrawer
          :open="drawerOpen"
          :placement="drawerPlacement"
          :showHandle="drawerHandle"
          :blur="4"
          @change="drawerOpen = $event"
        >
          <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px; min-height: 500px">
            <h3 style="margin: 0">{{ drawerPlacement }} drawer</h3>
            <p style="margin: 0">Drag the handle, press Esc, or click the backdrop to close.</p>
            <WkButton size="sm" @click="drawerOpen = false">Close</WkButton>
          </div>
        </WkDrawer>
      </section>
    </div>
  </div>
</template>

<script>
import {
  WkiAArrowDown,
  WkiAArrowUp,
  WkiChessBishop,
  WkiPlus,
  WkiMinus,
  WkiShoppingCart,
  WkiShoppingBag,
  WkiMousePointerClick,
  WkiSquareArrowOutUpRight,
  WkiUndo2,
  WkiLink,
  WkiPackage,
  WkiShirt
} from '../../src/icons'
import { wkMessage } from '../../src/index.js'
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
    const _now = new Date()
    return {
      drawerOpen: false,
      drawerPlacement: 'bottom',
      drawerHandle: true,
      icQty: 3,
      dpSingle: null,
      dpRange: [],
      dpMultiple: [],
      dpDateTime: null,
      dpMinMax: null,
      dpNoWeekend: null,
      dpFormat: null,
      dpSelects: null,
      dpMin: new Date(_now.getFullYear(), _now.getMonth(), 1),
      dpMax: new Date(_now.getFullYear(), _now.getMonth() + 1, 0),
      tabsSizes: ['mini', 'xs', 'sm', 'md', 'lg'],
      tabsValue: { mini: 'inbox', xs: 'inbox', sm: 'inbox', md: 'inbox', lg: 'inbox' },
      tabsIconValue: { mini: 'a', xs: 'a', sm: 'a', md: 'a', lg: 'a' },
      tabsCounterValue: 'inbox',
      tabsStretchValue: 'inbox',
      tabsItems: [
        { value: 'inbox', label: 'Inbox', counter: 5 },
        { value: 'sent', label: 'Sent' },
        { value: 'drafts', label: 'Drafts' },
        { value: 'archived', label: 'Archived', disabled: true }
      ],
      tabsIconItems: [
        { value: 'a', icon: WkiChessBishop },
        { value: 'b', icon: WkiChessBishop },
        { value: 'c', icon: WkiChessBishop }
      ],
      tabsCounterItems: [
        { value: 'inbox', label: 'Inbox', counter: 12, icon: WkiChessBishop },
        { value: 'sent', label: 'Sent', icon: WkiChessBishop },
        { value: 'spam', label: 'Spam', counter: 3, icon: WkiChessBishop },
        { value: 'trash', label: 'Trash', disabled: true }
      ],
      tableV2Columns: [
        { title: 'Name', dataIndex: 'name', width: 180, ellipsis: true, resizable: true, maxWidth: 250 },
        { title: 'Age', dataIndex: 'age', align: 'center', width: 80, resizable: true },
        { title: 'Email', dataIndex: 'email', width: 220, ellipsis: true, resizable: true },
        { title: 'Phone', dataIndex: 'phone', width: 140, resizable: true },
        { title: 'Company', dataIndex: 'company', width: 180, ellipsis: true, resizable: true },
        { title: 'Status', dataIndex: 'status', align: 'center', width: 100, resizable: true },
        { title: 'Score', dataIndex: 'score', align: 'right', width: 90, resizable: true },
        { title: 'Address', dataIndex: 'address', width: 260, ellipsis: true, resizable: true },
        { title: 'Joined', dataIndex: 'joined', align: 'center', width: 120, fixed: 'right', resizable: true },
        { title: 'Action', dataIndex: 'action', align: 'center', width: 50, fixed: 'right' }
      ],
      tableV2Data: [
        {
          key: '1',
          name: 'Edward King',
          avatar: 'https://i.pravatar.cc/80?img=1',
          age: 32,
          email: 'edward@example.com',
          phone: '+1 202-555-0101',
          company: 'Acme Corp',
          status: 'Active',
          score: 87,
          address: 'London, Park Lane no. 0',
          joined: '2021-03-15'
        },
        {
          key: '2',
          name: 'Jim Green',
          avatar: 'https://i.pravatar.cc/80?img=2',
          age: 42,
          email: 'jim.green@example.com',
          phone: '+1 202-555-0132',
          company: 'Globex',
          status: 'Inactive',
          score: 54,
          address: 'Sydney No. 1 Lake Park',
          joined: '2019-07-22'
        },
        {
          key: '3',
          name: 'Joe Black',
          avatar: 'https://i.pravatar.cc/80?img=3',
          age: 28,
          email: 'joe.black@example.com',
          phone: '+1 202-555-0178',
          company: 'Initech',
          status: 'Active',
          score: 91,
          address: 'Tokyo No. 2 Center St',
          joined: '2022-11-01'
        },
        {
          key: '4',
          name: 'Sara Mills',
          avatar: 'https://i.pravatar.cc/80?img=4',
          age: 35,
          email: 'sara.mills@example.com',
          phone: '+1 202-555-0143',
          company: 'Umbrella',
          status: 'Active',
          score: 76,
          address: 'Paris, Rue de Rivoli',
          joined: '2020-05-09'
        },
        {
          key: '5',
          name: 'Tom Lane',
          avatar: 'https://i.pravatar.cc/80?img=5',
          age: 29,
          email: 'tom.lane@example.com',
          phone: '+1 202-555-0160',
          company: 'Acme Corp',
          status: 'Active',
          score: 63,
          address: 'Berlin, Unter den Linden',
          joined: '2023-01-18'
        },
        {
          key: '6',
          name: 'Nina Cruz',
          avatar: 'https://i.pravatar.cc/80?img=6',
          age: 38,
          email: 'nina.cruz@example.com',
          phone: '+1 202-555-0115',
          company: 'Globex',
          status: 'Inactive',
          score: 44,
          address: 'Madrid, Gran Via 10',
          joined: '2018-09-30'
        },
        {
          key: '7',
          name: 'Leo Hart',
          avatar: 'https://i.pravatar.cc/80?img=7',
          age: 45,
          email: 'leo.hart@example.com',
          phone: '+1 202-555-0189',
          company: 'Initech',
          status: 'Active',
          score: 99,
          address: 'Rome, Via del Corso',
          joined: '2017-12-05'
        },
        {
          key: '8',
          name: 'Mia Ford',
          avatar: 'https://i.pravatar.cc/80?img=8',
          age: 26,
          email: 'mia.ford@example.com',
          phone: '+1 202-555-0122',
          company: 'Umbrella',
          status: 'Active',
          score: 82,
          address: 'Amsterdam, Damrak',
          joined: '2024-02-14'
        },
        {
          key: '9',
          name: 'Ben Shaw',
          avatar: 'https://i.pravatar.cc/80?img=9',
          age: 33,
          email: 'ben.shaw@example.com',
          phone: '+1 202-555-0197',
          company: 'Acme Corp',
          status: 'Inactive',
          score: 37,
          address: 'Toronto, Bay St',
          joined: '2021-06-20'
        },
        {
          key: '10',
          name: 'Ella Ross',
          avatar: 'https://i.pravatar.cc/80?img=10',
          age: 31,
          email: 'ella.ross@example.com',
          phone: '+1 202-555-0108',
          company: 'Globex',
          status: 'Active',
          score: 78,
          address: 'Seoul, Gangnam-gu',
          joined: '2022-08-11'
        },
        {
          key: '11',
          name: 'Dan Fox',
          avatar: 'https://i.pravatar.cc/80?img=11',
          age: 40,
          email: 'dan.fox@example.com',
          phone: '+1 202-555-0155',
          company: 'Initech',
          status: 'Active',
          score: 66,
          address: 'Singapore, Orchard Rd',
          joined: '2020-03-27'
        },
        {
          key: '12',
          name: 'Amy Cole',
          avatar: 'https://i.pravatar.cc/80?img=12',
          age: 27,
          email: 'amy.cole@example.com',
          phone: '+1 202-555-0134',
          company: 'Umbrella',
          status: 'Inactive',
          score: 51,
          address: 'Dubai, Sheikh Zayed Rd',
          joined: '2023-10-03'
        }
      ],
      tableV2ActionItems: [
        { key: 'edit', label: 'Edit', icon: WkiChessBishop },
        { key: 'view', label: 'View detail' },
        { key: 'delete', label: 'Delete', destructive: true }
      ],
      alertTypes: ['neutral', 'error', 'warning', 'info'],
      textareaModel: 'Editable value',
      dropdownActive: [],
      loading: false,
      openDialog: false,
      openDialog2: false,
      selected: '',
      tableColumns: [
        { title: 'Name', dataIndex: 'name', width: '20%', resizable: true, fixed: 'left' },
        { title: 'Age', dataIndex: 'age', resizable: true },
        { title: 'Address', dataIndex: 'address' },
        { title: 'Action', dataIndex: 'operation', fixed: 'right', resizable: true }
      ],
      tableData: [
        { key: '1', name: 'Edward King', age: 32, address: 'London, Park Lane no. 0' },
        { key: '2', name: 'Jim Green', age: 42, address: 'London, Park Lane no. 1' },
        { key: '3', name: 'Joe Black', age: 28, address: 'Sydney No. 1 Lake Park' }
      ],
      tableDragData: [
        { key: 'd1', name: 'Alice', age: 24, address: 'New York' },
        { key: 'd2', name: 'Bob', age: 31, address: 'London' },
        { key: 'd3', name: 'Carol', age: 28, address: 'Tokyo' },
        { key: 'd4', name: 'Dave', age: 35, address: 'Paris' }
      ],
      tableSelectedKeys: ['2'],
      tableScrollData: Array.from({ length: 30 }, (_, i) => ({
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
      avatarStackItems: [
        { src: 'https://i.pravatar.cc/80?img=12' },
        { src: 'https://i.pravatar.cc/80?img=14' },
        { src: 'https://i.pravatar.cc/80?img=15' },
        { src: 'https://i.pravatar.cc/80?img=16' },
        { src: 'https://i.pravatar.cc/80?img=17' },
        { src: 'https://i.pravatar.cc/80?img=18' },
        { src: 'https://i.pravatar.cc/80?img=19' },
        { src: 'https://i.pravatar.cc/80?img=20' },
        { src: 'https://i.pravatar.cc/80?img=21' },
        { src: 'https://i.pravatar.cc/80?img=22' }
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
      selectSingle: '',
      selectSearchable: '',
      selectMultiple: [],
      selectMultiSearch: [],
      selectFilter: '',
      selectOptions: [
        {
          label: 'Apple',
          value: 'apple',
          placement: 'right-start',
          children: [
            {
              label: 'Sub Apple 1',
              value: 'sub-apple-1',
              placement: 'right-start',
              children: [
                {
                  label: 'Sub Sub Apple 1',
                  value: 'sub-sub-apple-1',
                  children: []
                }
              ]
            },
            {
              label: 'Sub Apple 2',
              value: 'sub-apple-2',
              children: [
                {
                  label: 'Sub Sub Apple 2',
                  value: 'sub-sub-apple-2',
                  placement: 'bottom',
                  offset: 12,
                  width: 200,
                  children: [
                    {
                      label: 'Sub Sub Sub Apple 1',
                      value: 'sub-sub-sub-apple-1',
                      children: []
                    },
                    {
                      label: 'Sub Sub Sub Apple 2',
                      value: 'sub-sub-sub-apple-2',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        { label: 'Banana', value: 'banana' },
        { label: 'Cherry', value: 'cherry' },
        { label: 'Durian', value: 'durian' },
        { label: 'Elderberry', value: 'elderberry' },
        { label: 'Fig', value: 'fig' },
        { label: 'Grape', value: 'grape' }
      ],
      selectOptionsNamed: [
        { label: 'Alice', value: 'alice', name: 'Alice Nguyen' },
        { label: 'Bob', value: 'bob', name: 'Bob Tran' },
        { label: 'Charlie', value: 'charlie', name: 'Charlie Le' },
        { label: 'Diana', value: 'diana', name: 'Diana Pham' }
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
      dropdownOptions: [
        { key: 'edit', label: 'test', icon: WkiChessBishop },
        {
          key: 'delete',
          label: 'deeeeeeee',
          destructive: true,
          colorIcon: 'var(--destructive)'
        }
      ],
      toggleValue: false,
      accordionValue: ['info', 'shipping'],
      checkboxValue: false,
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
      tgSizes: ['mini', 'xs', 'sm', 'md', 'lg'],
      tgSizeValue: { mini: 'left', xs: 'center', sm: 'right', md: 'left', lg: 'left' },
      inputValue: 'dsfdssd',
      inputSizes: ['regular', 'large', 'small', 'xs'],
      inputRoundness: ['default', 'round'],
      breadcrumbCounts: [1, 2, 3, 4, 5, 6],
      breadcrumbWithIcon: [
        { icon: HOUSE_ICON, href: '#' },
        { label: 'Components', href: '#' },
        { label: 'Breadcrumb' }
      ],
      breadcrumbCollapsed: [
        { label: 'Home', value: '#' },
        { icon: ELLIPSIS_ICON, value: '#' },
        { label: 'Level x-2', value: '#' },
        { label: 'Level x-1', value: '#' },
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
      ],
      selectedRowKeys: ['1']
    }
  },
  components: {
    WkiAArrowDown,
    WkiAArrowUp,
    WkiChessBishop,
    WkiPlus,
    WkiMinus,
    WkiShoppingCart,
    WkiShoppingBag,
    WkiMousePointerClick,
    WkiSquareArrowOutUpRight,
    WkiUndo2,
    WkiLink,
    WkiPackage,
    WkiShirt
  },
  computed: {
    optionsState() {
      return (
        this.options
          .filter(o => o.checked)
          .map(o => o.label)
          .join(', ') || '(none)'
      )
    },

    eventIcon() {
      return {
        open_cart: WkiShoppingCart,
        add_to_cart: WkiShoppingCart,
        buy_now: WkiMousePointerClick,
        open_popup: WkiSquareArrowOutUpRight,
        back_home: WkiUndo2,
        open_link: WkiLink,
        link_product: WkiShirt
      }
    },

    rowSelection() {
      return {
        columnWidth: 36,
        checkStrictly: false,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, 'select============')
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selectedRows, 'select_all============')
        }
      }
    },

    eventPromotionOptions() {
      const options = [
        {
          label: 'Thu gọn',
          value: 'collapse'
        },
        {
          label: 'Ẩn hiện',
          value: 'showhide'
        },
        {
          label: 'form_param.additional_price',
          value: 'custom_form_price'
        },
        {
          label: 'form_param.additional_discount',
          value: 'custom_form_discount'
        },
        {
          label: 'form_param.additional_shipping_fee',
          value: 'custom_form_shipping_fee'
        }
      ]

      options.push({
        label: 'Cổng thanh toán',
        value: 'payment_gateway',
        children: [
          {
            label: 'POS auto banking',
            value: 'tcb_auto_banking'
          },
          {
            label: 'Paypal payment',
            value: 'paypal_banking'
          },
          {
            label: 'Xendit payment',
            value: 'xendit_banking',
            children: [
              {
                label: 'Xendit default',
                value: 'xendit_banking_default'
              },
              {
                label: 'Gcash',
                value: 'xendit_banking_GCASH'
              }
            ]
          },
          {
            label: 'VNPAY payment',
            value: 'vnpay_banking'
          },
          {
            label: 'Momo payment',
            value: 'momopay_banking'
          },
          {
            label: 'Paymongo payment',
            value: 'paymongo_banking'
          },
          {
            label: 'Stripe payment',
            value: 'stripe_banking'
          },
          {
            label: 'Onepay payment',
            value: 'onepay_banking',
            children: [
              {
                label: 'Onepay default',
                value: 'onepay_banking_default'
              },
              {
                label: 'Card international',
                value: 'onepay_banking_INTERNATIONAL'
              },
              {
                label: 'Card domestic',
                value: 'onepay_banking_DOMESTIC'
              },
              {
                label: 'Googlepay',
                value: 'onepay_banking_GOOGLEPAY'
              },
              {
                label: 'Applepay',
                value: 'onepay_banking_APPLEPAY'
              },
              {
                label: 'VNpay',
                value: 'onepay_banking_MOBILEBANKING'
              },
              {
                label: 'Zalopay',
                value: 'onepay_banking_ZALOPAY'
              },
              {
                label: 'Shopeepay',
                value: 'onepay_banking_SHOPEEPAY'
              }
            ]
          },
          {
            label: 'Mercadopago payment',
            value: 'mercadopago_banking',
            children: [
              {
                label: 'Mercado pago (default)',
                value: 'mercadopago_banking_default'
              },
              {
                label: 'Mercado pago (OXXO payment)',
                value: 'mercadopago_banking_oxxo'
              }
            ]
          }
        ]
      })

      return options
    },

    rowDraggable() {
      return {
        enableAnimationFlip: true,
        handleReorder: (fromIndex, toIndex, dataSource) => {
          console.log(fromIndex, toIndex, dataSource, 'rowDraggable============')
          // this.tableV2Data = dataSource
        }
      }
    },

    tableV2CustomRow() {
      return (record, index) => ({
        onClick: event => {
          console.log('row click', record, index, event)
        },
        onDblclick: event => {
          console.log('row dblclick', record, index, event)
        },
        onContextmenu: event => {
          event.preventDefault()
          console.log('row contextmenu', record, index)
        }
        // onMouseenter: (event) => { console.log('row mouseenter', record.name) },
        // onMouseleave: (event) => { console.log('row mouseleave', record.name) },
      })
    },

    tableV2CustomHeaderRow() {
      return (columns, index) => ({
        onClick: event => {
          console.log('header row click', columns, index, event)
        }
      })
    }
  },
  methods: {
    handleTableV2Action(item, record) {
      console.log('table action', item.key, record)
    },
    disableWeekends(date) {
      const d = date.getDay()
      return d === 0 || d === 6
    },
    onTableDragRecord({ fromIndex, toIndex }) {
      const data = [...this.tableDragData]

      const [moved] = data.splice(fromIndex, 1)
      data.splice(toIndex, 0, moved)

      this.tableDragData = data
    },
    msgSuccess() {
      wkMessage.success('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        placement: 'top-right'
      })
    },
    msgError() {
      wkMessage.error('Something went wrong')
    },
    msgInfo() {
      wkMessage.info('Heads up — this is an info message')
    },
    msgWarning() {
      wkMessage.warning('Please double-check your input')
    },
    msgLoading() {
      wkMessage.loading('Loading...', 2500)
    },
    msgUpdate() {
      const key = 'updatable'
      wkMessage.loading({ content: 'Uploading...', key, duration: 0 })
      setTimeout(() => wkMessage.success({ content: 'Uploaded!', key, duration: 2000 }), 1500)
    },
    msgBottom() {
      wkMessage.config({ placement: 'bottom-left' })
      wkMessage.info('Now anchored to the bottom')
      // setTimeout(() => wkMessage.config({ placement: 'top' }), 2500)
    },
    msgCorner() {
      // Corner placements overlap: each new message paints over the earlier one.
      wkMessage.config({ placement: 'top-right' })
      wkMessage.info('First — will be covered')
      setTimeout(() => wkMessage.success('Second — on top'), 400)
      setTimeout(() => wkMessage.warning('Third — newest overwrites'), 800)
      setTimeout(() => wkMessage.config({ placement: 'top' }), 4500)
    },
    msgMaxCount() {
      wkMessage.config({ maxCount: 5 })
      for (let i = 1; i <= 6; i++) wkMessage.info('Message #' + i)
    },
    msgDestroyAll() {
      wkMessage.destroy()
    },
    onAlertClose() {
      console.log('alert closed')
    },
    customRowExample(record, index) {
      return {
        onClick: event => {
          console.log('Row clicked:', record, index, event)
        },
        onDblclick: event => {
          console.log('Row double-clicked:', record, index, event)
        },
        onContextmenu: event => {
          console.log('Row right-clicked:', record, index, event)
          event.preventDefault()
        }
      }
    },
    customHeaderExample(columns, index) {
      return {
        onClick: event => {
          console.log('Header row clicked:', columns, index, event)
        }
      }
    },
    handleClickTypo() {
      console.log('click typo')
    },
    handleDropdownActive(value) {
      const isExist = this.dropdownActive.includes(value)
      if (isExist) {
        this.dropdownActive = this.dropdownActive.filter(item => item !== value)
      } else {
        this.dropdownActive.push(value)
      }
    },
    customFilterOption(input, option) {
      var q = input.toLowerCase()
      return (option.label + ' ' + (option.name || '')).toLowerCase().indexOf(q) !== -1
    },
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
.dp-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.dp-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--secondary-fg);
}
.dp-values {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-family: monospace;
  font-size: 12px;
  color: var(--muted-fg);
}
.alert-examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 440px;
  padding: 24px 0;
}

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
