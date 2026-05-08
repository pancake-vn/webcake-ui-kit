<template>
  <div style="padding: 40px; font-family: Arial, sans-serif;">
    <h1>Vue 2 Playground - Test UI Kit</h1>
    <p><strong>Vue 2 + Webpack 4 + Node 14</strong></p>

    <section style="margin-top: 30px;">
      <h2>Button</h2>
      <div>
        <Button type="primary" size="large" @click="handleClick">
          Primary Large 1 (Vue 2)
        </Button>

        <Button type="secondary" size="medium" style="margin-left: 12px;">
          Secondary Medium
        </Button>

        <Button type="danger" size="small" :disabled="true" style="margin-left: 12px;">
          Disabled Button
        </Button>
      </div>
    </section>

    <section style="margin-top: 40px;">
      <h2>Badge</h2>

      <h3 style="margin-top: 16px;">All variants × roundness</h3>
      <table style="border-collapse: separate; border-spacing: 12px;">
        <thead>
          <tr>
            <th></th>
            <th v-for="v in variants" :key="v" style="text-align: left; font-weight: 500; color: #6b7280;">{{ v }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in roundnessList" :key="r">
            <td style="color: #6b7280; padding-right: 8px;">{{ r }}</td>
            <td v-for="v in variants" :key="v">
              <Badge :variant="v" :roundness="r">Label</Badge>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 24px;">Slots & focus</h3>
      <div style="display: flex; gap: 12px; align-items: center;">
        <Badge variant="primary">
          <template #icon-left>★</template>
          Left icon
        </Badge>
        <Badge variant="secondary">
          Right icon
          <template #icon-right>→</template>
        </Badge>
        <Badge variant="info">
          <template #icon-left>i</template>
          Both
          <template #icon-right>?</template>
        </Badge>
        <Badge variant="outline" label="From prop" />
        <Badge variant="primary" tabindex="0">Tab here for :focus-visible</Badge>
        <Badge variant="destructive" tabindex="0">Tab for error ring</Badge>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      variants: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'info', 'warning'],
      roundnessList: ['default', 'round']
    }
  },
  methods: {
    handleClick() {
      alert('Button từ UI Kit - Vue 2 OK!')
    }
  }
}
</script>
