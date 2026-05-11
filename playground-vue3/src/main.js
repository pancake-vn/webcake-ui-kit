import { createApp } from 'vue'
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

const app = createApp(App)
app.component('Accordion', Accordion)
app.component('AccordionItem', AccordionItem)
app.component('AlertDialog', AlertDialog)
app.component('Badge', Badge)
app.component('Breadcrumb', Breadcrumb)
app.component('Button', Button)
app.component('ButtonGroup', ButtonGroup)
app.component('Checkbox', Checkbox)
app.component('CheckboxGroup', CheckboxGroup)
app.component('Dialog', Dialog)
app.component('Input', Input)
app.component('RichCheckboxGroup', RichCheckboxGroup)
app.component('Toggle', Toggle)
app.component('ToggleGroup', ToggleGroup)
app.mount('#app')
