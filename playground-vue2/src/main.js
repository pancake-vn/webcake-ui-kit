import Vue from 'vue'
import App from './App.vue'
import { Button } from 'webcake-ui-kit'

import '../../src/styles/index.css'

Vue.component('Button', Button)

new Vue({
  render: h => h(App)
}).$mount('#app')