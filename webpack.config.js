const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtract = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';


const webpackConfig ={
   entry:'./frontend/index.js',
    output:{
        path:path.join(__dirname,'dist'),
        filename:'bundle.js'
    },
    resolve:{
        extensions:['.js','.jsx']
    },
    module:{
        rules:[
            {
                  test:/\.(js|jsx)$/,
                  exclude:/node_modules/,
                  use:{
                     loader: 'babel-loader',
                     options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        "plugins": ["@babel/plugin-proposal-class-properties"]
                     }
                  }
            },
            {
                test:/\.html$/,
                use:{
                    loader:"html-loader"
                }
            },
            {
                test:/\.css$/,
                exclude:/node_modules/,
                use: [
                    {
                      loader: MiniCssExtract.loader,
                      options: {
                        publicPath: (resourcePath, context) => {
                            // publicPath is the relative path of the resource to the context
                            // e.g. for ./css/admin/main.css the publicPath will be ../../
                            // while for ./css/main.css the publicPath will be ../
                            return path.relative(path.dirname(resourcePath), context) + '/'
                          },
                      }
                    },
                    "css-loader"
                  ]
               
            }
        ]
    },
    devtool: 'source-map',
    plugins:[
        new HtmlWebPackPlugin({
           template:"frontend/index.html",
           filename:"./frontend/index.html",
        }),
        new MiniCssExtract({
            filename:'[name].css',
            chunkFilename:'[id].css',
        }),
        new OptimizeCssAssetsPlugin(),
    ],
};
module.exports = webpackConfig;
