const path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, './app/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../client-dist')
  },
  resolveLoader : {
    moduleExtensions: ["-loader"]
  },
  module: {
    loaders: [
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
      }
    ]
  }
};
