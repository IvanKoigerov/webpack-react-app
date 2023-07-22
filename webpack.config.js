const { ESBuildMinifyPlugin, EsbuildPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const PORT_DEV = process.env.PORT_DEV ?? 3000;
const BASE_PATH = process.env.BASE_PATH ? process.env.BASE_PATH : '/';
const BACKEND_URL = process.env.BACKEND_URL ?? 'https://sut.web-bee.ru';

console.log(process.env.PORT_DEV, process.env.BASE_PATH);

module.exports = function (webpackEnv) {
  const isProd = webpackEnv === 'production';
  const isDev = webpackEnv === 'development';

  return {
    entry: path.join(__dirname, './src/index.tsx'),

    devServer: {
      port: PORT_DEV,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      devMiddleware: {
        index: true,
        publicPath: BASE_PATH,
      },
      compress: true,
      open: BASE_PATH,
      hot: true,
      proxy: [
        {
          context: 'api',
          target: BACKEND_URL,
          secure: false,
          changeOrigin: true,
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      modules: [path.join(__dirname, 'src'), 'node_modules'],
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)?$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
            tsconfigRaw: require('./tsconfig.json'),
            sourcemap: isProd ? false : 'inline',
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/i,
          type: 'asset',
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|jpg|gif|webp)$/, // to import images and fonts
          loader: 'url-loader',
          options: { limit: 10000 },
        },
      ],
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].bundle.js',
      publicPath: BASE_PATH,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
      }),
      new CleanWebpackPlugin(),
      new EsbuildPlugin(),
    ],
  };
};
