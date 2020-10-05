const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "src/index.html"),
  filename: "./index.html"
});
module.exports = {
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ]
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    mainFiles: ['index'],
    extensions: [".js", ".jsx"],
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    }
  },
  devServer: {
    port: 3001
  },
};