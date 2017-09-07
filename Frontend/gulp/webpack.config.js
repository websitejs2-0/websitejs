var webpack = require('webpack'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    module: {
        rules: [{ // es6
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            // include: ['./node_modules/popper.js/'],
            use: {
                loader: 'babel-loader'
                // options: {
                //     presets: ['env']
                // }
            }
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            viewport: 'responsive-toolkit',
            Popper: ['popper.js', 'default'],
            svg4everybody: 'svg4everybody'
        }),
        new UglifyJSPlugin({
            sourceMap: (process.env.NODE_ENV === 'production') ? false : true,
            minimize: true,
            parallel: {
                cache: true,
                workers: 2
            },
            output: {
                comments: function() { return false; }
            }
        }),
        new ProgressBarPlugin()
    ]
};