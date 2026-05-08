import { createApp } from 'vue'
import App from './App.vue'
import { Badge, Button } from 'webcake-ui-kit'

import '../../src/styles/index.css'

const app = createApp(App)
app.component('Badge', Badge)
app.component('Button', Button)
app.mount('#app')
