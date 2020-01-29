/* eslint-env browser */
import 'font-awesome/css/font-awesome.css'

const Vue = require('vue').default

const vm = new Vue({
  components: {
    editor: require('../editor')
  },
  data: function () {
    return {
      edit: false,
      html: 'edit here'
    }
  },
  template: require('./template.pug'),
  methods: {
    save: function (html) {
      this.html = html
      this.edit = false
    }
  }
})

vm.$mount('#app')
