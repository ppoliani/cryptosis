const webpack = require('webpack');
const path = require('path');
const DotenvPlugin = require('webpack-dotenv-plugin');

const sourcePath = path.join(__dirname, './');
const distPath = path.join(__dirname, './app/web/dist');

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  const plugins = [
    new DotenvPlugin({
      path: './.env'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
    new webpack.NamedModulesPlugin()
  ];

  if (isProd) {
    // plugins.push(
    //   new DotenvPlugin({
    //     path: './.env.production'
    //   }),
    //   new webpack.LoaderOptionsPlugin({
    //     minimize: true,
    //     debug: false
    //   }),
    //   new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //       screw_ie8: true,
    //       conditionals: true,
    //       unused: true,
    //       comparisons: true,
    //       sequences: true,
    //       dead_code: true,
    //       evaluate: true,
    //       if_return: true,
    //       join_vars: true,
    //     },
    //     output: {
    //       comments: false,
    //     },
    //   })
    // );
  }
  else {
    plugins.push(
      new webpack.HotModuleReplacementPlugin()
    );
  }

  return {
    devtool: isProd ? 'source-map' : 'source-map',
    context: sourcePath,

    entry: {
      app: './app/web/index.jsx',
      vendor: [
        'react',
        'react-dom',
        'react-redux',
        'immutable',
        'babel-polyfill',
        'whatwg-fetch',
        'most',
        '@most/create',
        'core-decorators',
        'amcharts3/amcharts/amcharts',
        'amcharts3/amcharts/serial',
        'amcharts3/amcharts/pie',
        'amcharts3/amcharts/themes/light',
        '@amcharts/amcharts3-react'
      ]
    },

    output: {
      path: distPath,
      publicPath: '/',
      filename: '[name].bundle.js',
    },

    module: {
      rules: [
        {
          test: /\.(jpg|jpe?g|gif|png|woff|woff2|eot|ttf|svg)$/,
          use: {
            loader: 'file-loader',
            query: {
              limit: 100000,
              name: '[name].[ext]'
            },
          }
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            query: {
              name: '[name].[ext]'
            },
          }
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
          include: /flexboxgrid/
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ],
        },
      ]
    },

    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath
      ]
    },

    plugins,

    performance: isProd && {
      maxAssetSize: 100,
      maxEntrypointSize: 300,
      hints: 'warning',
    },

    stats: {
      colors: {
        green: '\u001b[32m',
      },
      errorDetails: true,
    },

    devServer: {
      contentBase: path.resolve(__dirname, 'app'),
      historyApiFallback: true,
      port: process.env.PORT,
      compress: isProd,
      inline: !isProd,
      hot: !isProd,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: true,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        }
      }
    }
  };
};
