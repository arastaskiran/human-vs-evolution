const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: ['@babel/polyfill', './src/app.js']
    },
    output: {
        path: path.resolve(__dirname, '../'),
        //path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js',
        libraryTarget: 'umd',
        library: 'BlueTombStone',
        umdNamedDefine: true

    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    }
}