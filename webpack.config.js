const { EsbuildPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const PORT_DEV = process.env.PORT_DEV ?? 3000;
const BASE_PATH = process.env.BASE_PATH ? process.env.BASE_PATH : '/';
const BACKEND_URL = process.env.BACKEND_URL ?? 'https://sut.web-bee.ru';

console.info('PORT: ', process.env.PORT_DEV);
console.info('BASE_PATH: ', process.env.BASE_PATH);
console.info('BACKEND_URL: ', process.env.BACKEND_URL);

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
      open: false, // BASE_PATH
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
      plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, 'tsconfig.json') })],
    },

    module: {
      rules: [
        // сборка TypeScript
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

        // Поддержка модульных импортов
        {
          test: /\.module.(sa|sc|c)ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },

        // Поддержка обычных импортов
        {
          test: /\.(sa|sc|c)ss$/,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
          exclude: /\.module.(sa|sc|c)ss$/,
        },

        // Поддержка SVG
        {
          test: /\.svg$/i,
          type: 'asset',
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: [/url/] },
          use: ['@svgr/webpack'],
        },

        // Поддержка импортов шрифтов и картинок
        {
          test: /\.(png|woff|woff2|eot|ttf|jpg|gif|webp)$/,
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
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          diagnosticOptions: {
            syntactic: true,
            semantic: true,
            declaration: isProd,
            global: true,
          },
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
      }),
      new CleanWebpackPlugin(),
      new EsbuildPlugin(),
      isProd &&
        new ESLintPlugin({
          extensions: ['ts', 'tsx', 'js', 'jsx'],
          exclude: ['/node_modules/', '/.idea/', '/.vscode/'],
        }),
    ].filter(Boolean),
  };
};
