const glob = require('glob');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const generateHTMLPlugins = () =>
  glob.sync('./src/views/**/*.njk').map(
    (dir) =>
      new HtmlWebpackPlugin({
        filename: dir.replace('src/views/', '').replace('.njk', '.html'),
        template: dir,
        inject: 'body',
      })
  );

const idDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: idDev ? 'development' : 'production',
  entry: {
    app: './src/app.js',
    vendor: './src/vendor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'javascript/[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },

      {
        test: /\.njk$/,
        use: [
          {
            loader: 'simple-nunjucks-loader',
            options: {
              searchPaths: [__dirname + '/src'],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'dist',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      linkType: 'text/css',
      filename: 'stylesheet/[name].css',
    }),

    ...generateHTMLPlugins(),
  ],
  ...(idDev && {
    devServer: {
      contentBase: [__dirname + '/src'],
      historyApiFallback: true,
      compress: true,
      hot: true,
      inline: true,
      host: 'localhost',
      port: 3000,
      watchContentBase: true,
    },
  }),
};
