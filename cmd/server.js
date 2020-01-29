module.exports = function (prog) {
  prog
    .command('dev')
    .option('-p, --port <port>', 'web service listen port default:[3000]', 3000)
    .description('start a dev http service.')
    .action(async function (opts) {
      const configWebpack = require('../webpack/config.dev')
      const webpack = require('webpack')
      const compiler = webpack(configWebpack)
      const WebpackDevServer = require('webpack-dev-server')
      const path = require('path')
      const configWebpackDevServer = {
        contentBase: path.resolve('./build/public'),
        publicPath: configWebpack.output.publicPath,
        hot: false,
        inline: false,
        quiet: false,
        noInfo: false,
        stats: {
          colors: true
        },
        watchOptions: {
          aggregateTimeout: 300,
          poll: 5000
        }
      }
      compiler.devtool = 'source-map'

      const getLogger = require('webpack-log')
      const log = getLogger({ name: 'dev' })

      const webpackServer = new WebpackDevServer(compiler, configWebpackDevServer)
      webpackServer.listen(opts.port, '127.0.0.1', function () {
        const server = this
        const address = server.address()
        const port = address.port
        log.info(`service listen on ${port}`)
      })
    })
}
