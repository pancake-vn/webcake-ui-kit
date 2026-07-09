import Vue from 'vue'
import App from './App.vue'
import * as WebcakeUI from 'webcake-ui-kit'

import '../../src/styles/index.css'
import { wkMessage } from '../../src/components/message/message.js'

Object.keys(WebcakeUI).forEach(key => {
  Vue.component(key, WebcakeUI[key])
})

Vue.prototype.$message = wkMessage

new Vue({
  render: h => h(App)
}).$mount('#app')
