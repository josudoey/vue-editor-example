const path = require('path')
const fs = require('fs')
const globby = require('globby')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const projectPath = path.resolve(__dirname, '../')
const staticPath = path.resolve(__dirname, '../static')
const entryPath = path.resolve(__dirname, './entry')
const entryFiles = globby.sync(entryPath, '*.js')
const buildPath = path.resolve(projectPath, 'build')
const publicPath = path.resolve(buildPath, './public')
const bundlePath = '/b/'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const entry = {}
for (const file of entryFiles) {
  const entryName = path.basename(file, '.js')
  entry[entryName] = file
}

module.exports = {
  entry: entry,
  output: {
    path: path.join(publicPath, bundlePath),
    publicPath: bundlePath,
    filename: '[name].js?[hash:4]',
    chunkFilename: '[name].js?[hash:4]'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      root: projectPath,
      cleanOnceBeforeBuildPatterns: [buildPath]
    }),
    new CopyPlugin([{
      from: staticPath,
      to: publicPath,
      toType: 'dir',
      ignore: ['.DS_Store']
    }]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css?[hash:4]',
      chunkFilename: 'css/[id].css?[hash:4]'
    }),
    new webpack.DefinePlugin({}),
    new webpack.ProvidePlugin({}),
    function () {
      this.plugin('done', function (statsData) {
        const stats = statsData.toJson({
          assets: false,
          entrypoints: false,
          chunkGroups: false,
          chunks: false,
          source: false,
          modules: false,
          filteredModules: false,
          children: false
        })
        if (!fs.existsSync(buildPath)) {
          fs.mkdirSync(buildPath)
        }
        fs.writeFileSync(path.join(buildPath, 'stats.json'), JSON.stringify(stats, null, 4))
      })
    },
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      template: path.resolve(projectPath, './webpack/plugin/html/render.pug'),
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          v: Date.now() % 1000000
        }
      },
      filename: path.resolve(publicPath, './index.html'),
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'img',
        publicPath: '../img',
        useRelativePath: false,
        name: '[name].[ext]?[hash:4]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'fonts',
        publicPath: '../fonts',
        useRelativePath: false,
        name: '[name].[ext]?[hash:4]'
      }
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: true
      }
    }, {
      test: /render.pug$/,
      use: [{
        loader: 'pug-loader'
      }]
    }, {
      test: /template.pug$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true,
          collapseBooleanAttributes: true
        }
      }, {
        loader: 'pug-html-loader',
        options: {
          doctype: 'html'
        }
      }]
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('autoprefixer')]
          }
        }
      ]
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('autoprefixer')]
          }
        }, {
          loader: 'sass-loader'
        }]
    }, {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-syntax-dynamic-import']
        }
      }
    }]
  }
}
