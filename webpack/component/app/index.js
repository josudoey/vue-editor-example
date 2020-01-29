/* eslint-env browser */
import 'font-awesome/css/font-awesome.css'

const styleElement = document.createElement('style')
styleElement.type = 'text/css'
document.getElementsByTagName('head')[0].appendChild(styleElement)

styleElement.appendChild(document.createTextNode(`
  .upload-placeholder {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    animation: spinner 1s linear infinite;
  }
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`))

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
    },
    insertImage: function ({ img, file }) {
      img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=')
      img.classList.add('upload-placeholder')
      setTimeout(function () {
        img.classList.remove('upload-placeholder')
      }, 1000)
    }
  }
})

vm.$mount('#app')
