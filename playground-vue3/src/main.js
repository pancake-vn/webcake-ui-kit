import { createApp } from 'vue'
import App from './App.vue'
import * as WebcakeUI from 'webcake-ui-kit'

import '../../src/styles/index.css'

const app = createApp(App)

Object.keys(WebcakeUI).forEach(key => {
  app.component(key, WebcakeUI[key])
})

app.mount('#app')
