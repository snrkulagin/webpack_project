const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");

const templatePath = "./app/src/scripts/";
const templatesPath = "./app/src/templates/";

const htmlWebpackInstances = [];

const entry = {};

const pages = glob.sync(`${templatesPath}/*.pug`).map(filePath => {
  return filePath.match(/templates\/(.+)\./)[1];
});
pages.forEach(page => {
  const chunkName = page.replace("/", "-");
  entry[chunkName] = templatePath + page + ".js";
  htmlWebpackInstances.push(
    new HtmlWebpackPlugin({
      template: templatesPath + chunkName + ".pug",
      filename: chunkName + ".html",
      chunks: [chunkName]
    })
  );
});

module.exports = {
  entry,
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build")
  },
  devServer: {
    port: 3000
  },
  plugins: [...htmlWebpackInstances],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["pug-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /(manifest.json)|(^old\/.+)|(\.(png|jpg|gif|woff|woff2|eot|ttf|otf|mp4|ico|svg|webp))$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/files/[name]-[hash].[ext]"
            }
          }
        ]
      }
    ]
  }
};
