const Option = {
  name: 'SelectOption',

  props: {
    value: {
      default: undefined
    },
    label: {
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    markLabel: String,
    icon: {
      type: Object
    }
  },

  render() {
    return null
  }
}

export default Option
