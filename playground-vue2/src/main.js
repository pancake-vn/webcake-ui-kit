import Vue from 'vue'
import App from './App.vue'
import { Badge, Button } from 'webcake-ui-kit'

import '../../src/styles/index.css'

Vue.component('Badge', Badge)
Vue.component('Button', Button)

new Vue({
  render: h => h(App)
}).$mount('#app')