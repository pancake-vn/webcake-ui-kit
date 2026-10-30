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
    title: String,
    icon: {
      type: Object
    }
  },

  render() {
    return null
  }
}

export default Option
