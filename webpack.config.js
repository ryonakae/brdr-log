const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const themePath = '/wp-content/themes/l/'

const swOptions = {
  cacheId: 'brdr-log',
  swDest: path.join(__dirname, 'theme/service-worker.js'),
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\/wp-json\/.+/,
      handler: 'networkFirst',
      options: {
        cacheName: 'api',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24
        }
      }
    },
    {
      urlPattern: /^(https?):\/\/.*\/.*\.(jpg|jpeg|gif|png)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 7
        }
      }
    }
  ]
}

const common = {
  entry: {
    index: path.join(__dirname, 'src/index.js')
  },

  output: {
    path: path.join(__dirname, 'theme'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },

      {
        test: /\.(jpg|png|bmp|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
          name: '[name].[ext]',
          outputPath: 'images/',
          publicPath: themePath + 'images/'
        }
      },

      {
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: themePath + 'fonts/'
        }
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.join(__dirname, 'src'),
      styles: path.join(__dirname, 'src/assets/styles'),
      images: path.join(__dirname, 'src/assets/images'),
      fonts: path.join(__dirname, 'src/assets/fonts')
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },

  plugins: [new GenerateSW(swOptions)]
}

const dev = {
  mode: 'development',

  entry: {
    index: [
      path.join(__dirname, 'src/index.js'),
      'webpack-hot-middleware/client?noinfo=true&quiet=true'
    ]
  },

  output: {
    publicPath: themePath
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devtool: 'inline-source-map'
}

const prod = {
  mode: 'production',

  plugins: [new webpack.optimize.AggressiveMergingPlugin()]
}

module.exports = merge(
  common,
  process.env.NODE_ENV === 'production' ? prod : dev
)
