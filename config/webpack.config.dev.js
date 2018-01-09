var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var getClientEnvironment = require('./env');
var paths = require('./paths');
var publicPath = '/';
var publicUrl = '';
var env = getClientEnvironment(publicUrl);
process.traceDeprecation=true
module.exports = {
  devtool: 'cheap-module-source-map',
  // context: paths.appSrc,
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath
  },
  resolve: {
    // fallback: paths.nodePaths,
    modules: ["node_modules", paths.nodePaths[0]],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // 'react-native': 'react-native-web'
    }
  },

  module: {
    rules: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]'
          }
        }]
      },{
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        use: [{
          loader: 'babel-loader',
          options: { }
        }]
      },{
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',

          options: {
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader'
        }]
      },{
        test: /\.svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]'
          }
        }]
      },{
      test: /\.(js|jsx)$/,

      use: [{
        loader: 'eslint-loader'
      }],

      include: paths.appSrc,
      enforce: 'pre'
    }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin({ PUBLIC_URL: publicUrl }),
    new HtmlWebpackPlugin({ inject: true, template: paths.appHtml }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.LoaderOptionsPlugin({
         // test: /\.xxx$/, // may apply this only for some modules
         options: {
           postcss: function() {
             return [
               autoprefixer({
                 browsers: [
                   '>1%',
                   'last 4 versions',
                   'Firefox ESR',
                 ]
               }),
             ];
           }
         }
       })
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
