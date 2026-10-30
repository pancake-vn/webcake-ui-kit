<template>
  <div class="ui-select__options">
    <template v-for="option in options">
      <WkDivider v-if="option.type === 'divider'" :key="option.value" />

      <div v-else-if="option.type === 'group-header'" :key="option.value" class="ui-select__group-header">
        <component
          v-if="option.icon"
          :is="option.icon.component"
          :size="option.icon.size"
          :color="option.icon.color"
          :stroke-width="option.icon.strokeWidth"
          :fill="option.icon.fill"
        />
        <span>{{ option.label }}</span>
      </div>

      <template v-else>
        <WkTooltip v-if="showTooltip" :key="option.value" :title="option.label" side="top">
          <WkMenuItem v-bind="getMenuItemProps(option)" @click="selectCtx.actions.onSelect(option.value)">
            <template v-if="option.icon" #prefix>
              <component
                :is="option.icon.component"
                :size="option.icon.size"
                :color="option.icon.color"
                :stroke-width="option.icon.strokeWidth"
                :fill="option.icon.fill"
              />
            </template>
            <template v-if="showChecked && isSelected(option.value)" #suffix>
              <WkiCheck :size="16" />
            </template>
          </WkMenuItem>
        </WkTooltip>

        <WkMenuItem
          v-else
          :key="option.value"
          v-bind="getMenuItemProps(option)"
          @click="selectCtx.actions.onSelect(option.value)"
        >
          <template v-if="option.icon" #prefix>
            <component
              :is="option.icon.component"
              :size="option.icon.size"
              :color="option.icon.color"
              :stroke-width="option.icon.strokeWidth"
              :fill="option.icon.fill"
            />
          </template>
          <template v-if="showChecked && isSelected(option.value)" #suffix>
            <WkiCheck :size="16" />
          </template>
        </WkMenuItem>
      </template>
    </template>
  </div>
</template>

<script>
import WkMenuItem from '../menuitem/MenuItem.vue'
import WkDivider from '../divider/Divider.vue'
import WkTooltip from '../tooltip/Tooltip.vue'
import WkiCheck from '../../icons/Check.vue'

export default {
  inject: ['selectCtx'],
  components: {
    WkMenuItem,
    WkDivider,
    WkTooltip,
    WkiCheck
  },
  props: {
    optionSize: {
      type: String,
      default: 'md',
      validator: v => ['sm', 'md', 'lg'].indexOf(v) !== -1
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    showChecked: {
      type: Boolean,
      default: true
    },
    listHeight: {
      type: [Number, String],
      default: 256
    }
  },
  computed: {
    options() {
      return this.selectCtx.options || []
    }
  },

  methods: {
    isSelected(value) {
      return this.selectCtx.rawValues.has(value)
    },

    getMenuItemProps(option) {
      return {
        label: option.label,
        active: this.isSelected(option.value),
        disabled: option.disabled,
        size: this.optionSize
      }
    }
  }
}
</script>

<style src="./styles/option-list.css" scoped></style>
