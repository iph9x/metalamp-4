const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
}

const PAGES_DIR = `${PATHS.src}/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter( fileName => fileName.endsWith('.html') );

console.log("is dev: ", isDev);


module.exports = {
  context: PATHS.src,
  mode: 'development',
  entry: {
    main: './index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename('js')
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': PATHS.src
    }
  },  
  devServer: {
    contentBase: PATHS.src,
    watchContentBase: isDev,
    open: isDev,
    inline: isDev,
    hot: isDev,
    hotOnly: isDev,
    port: 8080,
  },    
  module: {
    rules: [    
      {
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: isProd ? { publicPath: '../dist'} : {}
          },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(ts|tsx|js)$/,
        // use: 'ts-loader',
        enforce: 'pre',
        use: {
          loader: 'awesome-typescript-loader',
        },
        exclude: /node_modules/,
      },
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader'],
      //   exclude: /node_modules/,
      // },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: {
          options: {
            publicPath: '.',
            name: '[name]-[contenthash].[ext]',
          },
          loader: 'file-loader'
        },
      },
      {
        test: /\.(ttf|woff|svg|eot|woff2|otf)$/,
        use: [
          {
            options: {
              publicPath: '.',
              name: '[name].[ext]',
            },
            loader: 'file-loader'
          },
        ]
       
      }
    ]
  },
  plugins: [
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `${page}`
    })),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new ESLintPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}