<template>
  <div
    :class="['ui-file-type-icon', `ui-file-type-icon--variant-${variant}`, isFolder && 'ui-file-type-icon--is-folder']"
    :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }"
  >
    <template v-if="!isFolder">
      <svg
        v-if="variant == 'default'"
        xmlns="http://www.w3.org/2000/svg"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 32 40"
        fill="none"
      >
        <path
          d="M0 4C0 1.79086 1.79086 0 4 0H20C20.3201 0 20.6272 0.127177 20.8536 0.353553L31.6464 11.1464C31.8728 11.3728 32 11.6799 32 12V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z"
          fill="white"
        />
        <path
          d="M0 36V4C5.15405e-07 1.79086 1.79086 0 4 0H20C20.3201 0 20.6271 0.127163 20.8535 0.353516L31.6465 11.1465C31.8728 11.3729 32 11.6799 32 12V36C32 38.2091 30.2091 40 28 40V39C29.6569 39 31 37.6569 31 36V12C31 11.9451 30.9783 11.8924 30.9395 11.8535L20.1465 1.06055C20.1076 1.02173 20.0549 1 20 1H4C2.34315 1 1 2.34315 1 4V36C1 37.6569 2.34315 39 4 39V40C1.79086 40 0 38.2091 0 36ZM28 39V40H4V39H28Z"
          fill="#D1D1D1"
        />
        <path
          d="M19.5 8V0.5H20.5V8C20.5 9.933 22.067 11.5 24 11.5H31.5V12.5H24C21.5147 12.5 19.5 10.4853 19.5 8Z"
          fill="#D1D1D1"
        />
      </svg>
      <div v-if="variant == 'grey'">
        <svg xmlns="http://www.w3.org/2000/svg" :width="iconWidth" :height="iconHeight" viewBox="0 0 32 40" fill="none">
          <mask
            id="mask0_5136_6089"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="32"
            height="40"
          >
            <path d="M0 0H20L32 12V40H0V0Z" fill="url(#paint0_linear_5136_6089)" />
          </mask>
          <g mask="url(#mask0_5136_6089)">
            <path
              d="M0 4C0 1.79086 1.79086 0 4 0H20L32 12V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z"
              fill="#D1D1D1"
            />
          </g>
          <defs>
            <linearGradient id="paint0_linear_5136_6089" x1="16" y1="0" x2="16" y2="40" gradientUnits="userSpaceOnUse">
              <stop stop-opacity="0.4" />
              <stop offset="1" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          style="position: absolute; top: 0; right: 0"
          xmlns="http://www.w3.org/2000/svg"
          :width="iconWidth * 0.375"
          :height="iconWidth * 0.375"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M0 0L12 12H4C1.79086 12 0 10.2091 0 8V0Z" fill="#A3A3A3" />
        </svg>
      </div>
      <svg
        v-if="variant == 'solid'"
        xmlns="http://www.w3.org/2000/svg"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 32 40"
        fill="none"
      >
        <path
          d="M0 4C0 1.79086 1.79086 0 4 0H18.3431C19.404 0 20.4214 0.421427 21.1716 1.17157L30.8284 10.8284C31.5786 11.5786 32 12.596 32 13.6569V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z"
          :fill="fill"
        />
        <path opacity="0.3" d="M20 0L32 12H24C21.7909 12 20 10.2091 20 8V0Z" fill="white" />
      </svg>

      <div :class="['ui-file-type-icon--text-wrapper']" :style="textWrapperStyle">
        <span class="ui-file-type-icon--text" :style="textStyle">{{ fileType.toUpperCase() }}</span>
      </div>
    </template>
    <template v-else>
      <svg
        v-if="isFolderEmpty"
        xmlns="http://www.w3.org/2000/svg"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M1.17651 6.46483L1.17651 33.5493C1.17651 34.7243 2.12902 35.6768 3.304 35.6768H36.6961C37.8711 35.6768 38.8236 34.7243 38.8236 33.5493V10.4844C38.8236 9.30945 37.8711 8.35695 36.6961 8.35695H19.2617C18.4346 8.35695 17.6869 7.87454 17.249 7.17284C16.5092 5.98714 15.2188 4.33734 13.7666 4.33734H3.30289C2.12792 4.33734 1.17651 5.28985 1.17651 6.46483Z"
          fill="#FFC531"
        />
        <path
          d="M38.8236 13.172V32.8876C38.8236 34.0625 37.8711 35.0151 36.6961 35.0151H3.30399C2.12902 35.0151 1.17651 34.0625 1.17651 32.8876V15.1675C1.17651 13.9925 2.1289 13.04 3.30388 13.04H13.1014C16.4522 13.04 15.984 11.0444 18.2754 11.0445C24.4425 11.0448 32.8248 11.0446 36.6992 11.0445C37.8742 11.0445 38.8236 11.997 38.8236 13.172Z"
          fill="url(#paint0_linear_4011_2428)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_4011_2428"
            x1="38.8236"
            y1="11.0445"
            x2="1.99669"
            y2="36.215"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.234375" stop-color="#FCF68D" />
            <stop offset="1" stop-color="#FFC531" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        :width="iconWidth"
        :height="iconHeight"
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M1.17651 6.46483L1.17651 33.5493C1.17651 34.7243 2.12902 35.6768 3.304 35.6768H36.6961C37.8711 35.6768 38.8236 34.7243 38.8236 33.5493V10.4844C38.8236 9.30945 37.8711 8.35695 36.6961 8.35695H19.2617C18.4346 8.35695 17.6869 7.87454 17.249 7.17284C16.5092 5.98714 15.2188 4.33734 13.7666 4.33734H3.30289C2.12792 4.33734 1.17651 5.28985 1.17651 6.46483Z"
          fill="#FFC531"
        />
        <path
          d="M1.58411 12.1417C1.58411 11.0135 2.48261 10.099 3.59096 10.099H36.4089C37.5173 10.099 38.4158 11.0135 38.4158 12.1417V32.8088C38.4158 33.9369 37.5173 34.8515 36.4089 34.8515H3.59096C2.48261 34.8515 1.58411 33.9369 1.58411 32.8088V12.1417Z"
          fill="white"
        />
        <path
          d="M38.8236 13.172V32.8876C38.8236 34.0625 37.8711 35.0151 36.6961 35.0151H3.30399C2.12902 35.0151 1.17651 34.0625 1.17651 32.8876V15.1675C1.17651 13.9925 2.1289 13.04 3.30388 13.04H13.1014C16.4522 13.04 15.984 11.0444 18.2754 11.0445C24.4425 11.0448 32.8248 11.0446 36.6992 11.0445C37.8742 11.0445 38.8236 11.997 38.8236 13.172Z"
          fill="url(#paint0_linear_4011_2429)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_4011_2429"
            x1="38.8236"
            y1="11.0445"
            x2="1.99669"
            y2="36.215"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.234375" stop-color="#FCF68D" />
            <stop offset="1" stop-color="#FFC531" />
          </linearGradient>
        </defs>
      </svg>
    </template>
  </div>
</template>

<script>
export default {
  name: 'WkFileTypeIcon',
  props: {
    variant: {
      type: String,
      validator: v => ['default', 'grey', 'solid'].includes(v),
      default: 'default'
    },
    isFolder: Boolean,
    isFolderEmpty: Boolean,
    fileType: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 40
    }
  },
  emits: [],
  computed: {
    iconWidth() {
      if (this.isFolder) {
        return this.width
      }
      // File icon aspect ratio: 32/40 = 0.8
      return this.width * 0.8
    },
    iconHeight() {
      if (this.isFolder) {
        return this.width
      }
      // File icon aspect ratio: 40/32 = 1.25
      return this.width
    },
    scaleFactor() {
      return this.width / 40
    },
    textWrapperStyle() {
      const baseBottom = 6
      const basePadding = 2
      const basePaddingX = 3
      const baseBorderRadius = 2

      const styles = {
        padding: `${basePadding * this.scaleFactor}px ${basePaddingX * this.scaleFactor}px`,
        bottom: `${baseBottom * this.scaleFactor}px`,
        borderRadius: `${baseBorderRadius * this.scaleFactor}px`
      }

      if (this.variant === 'default') {
        styles.left = `${-6 * this.scaleFactor}px`
      }

      if (['default', 'solid'].includes(this.variant)) {
        styles.background = this.fill
      }

      return styles
    },
    textStyle() {
      const baseFontSize = 10
      return {
        fontSize: `${baseFontSize * this.scaleFactor}px`
      }
    },
    fill() {
      switch (this.fileType.toLowerCase()) {
        case 'pdf':
          return 'var(--red-600, #DC2626)'
        case 'doc':
        case 'docx':
        case 'psd':
        case 'mp4':
        case 'mpeg':
        case 'avi':
        case 'mkv':
          return 'var(--blue-600, #2563EB)'
        case 'txt':
        case 'pig':
        case 'zip':
        case 'rar':
          return 'var(--neutral-600, #5C5C5C)'
        case 'csv':
        case 'xls':
        case 'xlsx':
          return 'var(--green-600, #16A34A)'
        case 'ppt':
        case 'pptx':
        case 'ai':
          return 'var(--orange-600, #EA580C)'
        case 'indd':
          return 'var(--fuchsia-600, #C026D3)'
        case 'aep':
          return 'var(--purple-600, #9333EA)'
        case 'mp3':
        case 'wav':
          return 'var(--pink-600, #DB2777)'
        default:
          return 'var(--indigo-600, #4F46E5)'
      }
    }
  },
  methods: {}
}
</script>

<style src="./file-type-icon.css" scoped></style>
