import Vue from 'vue'
import App from './App.vue'
import * as WebcakeUI from 'webcake-ui-kit'

import '../../src/styles/index.css'

Object.keys(WebcakeUI).forEach(key => {
  Vue.component(key, WebcakeUI[key])
})

new Vue({
  render: h => h(App)
}).$mount('#app')
