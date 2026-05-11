import Vue from 'vue'
import App from './App.vue'
import {
  Accordion,
  AccordionItem,
  AlertDialog,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Input,
  RichCheckboxGroup,
  Toggle,
  ToggleGroup
} from 'webcake-ui-kit'

import '../../src/styles/index.css'

Vue.component('Accordion', Accordion)
Vue.component('AccordionItem', AccordionItem)
Vue.component('AlertDialog', AlertDialog)
Vue.component('Badge', Badge)
Vue.component('Breadcrumb', Breadcrumb)
Vue.component('Button', Button)
Vue.component('ButtonGroup', ButtonGroup)
Vue.component('Checkbox', Checkbox)
Vue.component('CheckboxGroup', CheckboxGroup)
Vue.component('Dialog', Dialog)
Vue.component('Input', Input)
Vue.component('RichCheckboxGroup', RichCheckboxGroup)
Vue.component('Toggle', Toggle)
Vue.component('ToggleGroup', ToggleGroup)

new Vue({
  render: h => h(App)
}).$mount('#app')
