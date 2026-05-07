<template>
  <div style="padding: 40px; font-family: Arial, sans-serif;">
    <h1>Vue 3 Playground - Test UI Kit</h1>
    <p>Node version: 14.15.0</p>
    
    <div style="margin-top: 30px;">
      <Button type="primary" size="large" @click="handleClick">
        Primary Large Button
      </Button>
      
      <Button type="secondary" size="medium" style="margin-left: 12px;">
        Secondary Medium
      </Button>
      
      <Button type="danger" size="small" :disabled="true" style="margin-left: 12px;">
        Disabled Button
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      alert('Button từ UI Kit - Vue 3 OK!')
    }
  }
}
</script>