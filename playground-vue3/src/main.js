import { createApp } from 'vue'
import App from './App.vue'
import { Button } from 'webcake-ui-kit'

import '../../src/styles/index.css'

const app = createApp(App)
app.component('Button', Button)
app.mount('#app')