
module.exports = {
  template: require('./template.pug'),
  props: ['sourceHtml', 'enable'],
  data: function () {
    return {
      mode: 'native',
      html: this.sourceHtml,
      forecolor: '',
      backcolor: ''
    }
  },
  watch: {
    enable: function (val) {
      const self = this
      if (val) {
        this.html = this.sourceHtml
        setTimeout(function () {
          self.$refs.content.focus()
        }, 0)
      }
    },
    mode: function (val) {
      if (val === 'html') {
        this.html = this.$refs.content.innerHTML
      }
    },
    forecolor: function (val) {
      document.execCommand('forecolor', false, val)
    },
    backcolor: function (val) {
      document.execCommand('backcolor', false, val)
    }
  },
  created: function () {},
  mounted: function () {
    const self = this
    this.$refs.content.addEventListener('paste', (e) => {
      const clipboardData = e.clipboardData
      const accept = /image\/*/
      for (const item of clipboardData.items) {
        if (!accept.test(item.type)) {
          continue
        }

        const file = item.getAsFile()
        self.insertImage(file)
      }
    })
  },
  methods: {
    save: function () {
      if (this.mode === 'native') {
        this.html = this.$refs.content.innerHTML
      }
      this.mode = 'native'
      this.$emit('save', this.html)
    },
    exec: function (aCommandName, aShowDefaultUI, aValueArgument) {
      // ref https://developer.mozilla.org/zh-TW/docs/Web/API/Document/execCommand
      return document.execCommand(aCommandName, aShowDefaultUI, aValueArgument)
    },
    insertHr: function (html) {
      const selection = window.getSelection()
      if (!selection.rangeCount) {
        return false
      }
      selection.deleteFromDocument()
      selection.getRangeAt(0).insertNode(document.createElement('hr'))
      selection.collapseToEnd()
    },
    openImage: function () {
      this.$refs.content.focus()
      const self = this
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.onchange = () => {
        const file = input.files[0]
        self.insertImage(file)
      }
      input.click()
    },
    createlink: function () {
      const url = window.prompt('Enter the link here: ', 'http://')
      if (!url) {
        return
      }
      return document.execCommand('createlink', false, url)
    },
    insertImage: function (file) {
      const reader = new window.FileReader()
      reader.addEventListener('load', (e) => {
        const img = document.createElement('img')
        const selection = window.getSelection()
        if (!selection.rangeCount) {
          return false
        }
        selection.deleteFromDocument()
        selection.getRangeAt(0).insertNode(img)
        selection.collapseToEnd()
        img.setAttribute('src', reader.result)
        this.$emit('insertImage', {
          img: img,
          file: file
        })
      }, false)
      reader.readAsDataURL(file)
    }
  }
}
