var webpack = require('webpack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    module: {
        rules: []
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            viewport: 'responsive-toolkit'
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new ProgressBarPlugin()
    ]
};