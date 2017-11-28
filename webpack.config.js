const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, './app/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
   plugins: [
    new ExtractTextPlugin("styles.css"),
  ],
  module: {
    loaders:[
    {
      test: /\.json$/,
      use: [
        {
          loader: 'file?name=[name].[ext]'
        }
      ]
    },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]'
      }, {
        test: /\.scss$/,
        use: [
          {
            loader: 'style'
          }, {
            loader: 'css'
          }, {
            loader: 'sass'
          }
        ]
      },  {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'style'
          }, {
            loader: 'css'
          }, {
            loader: 'sass'
          }
        ]
      }
    ]
  }
};
