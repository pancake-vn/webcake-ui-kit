import Button from '../../src/components/Button.vue'

export default {
  title: 'Components/Button',
  component: Button
}

const Template = (args) => ({
  components: { Button },

  argTypes: {
    onClick: {
      action: 'clicked'
    }
  },

  setup() {
    return { args }
  },
  methods: {
    handleClick() {
      console.log('click')
    }
  },

  template: `
    <Button v-bind="args" @click="handleClick">
      Click me 11
    </Button>
  `
})

export const Primary = Template.bind({type: 'primary'})

export const Secondary = Template.bind({ type: 'secondary' })
