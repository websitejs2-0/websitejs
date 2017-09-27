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
            svg4everybody: 'svg4everybody',
            // Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
            // Alert: "exports?Alert!bootstrap/js/dist/alert",
            // Button: "exports?Button!bootstrap/js/dist/button",
            // Carousel: "exports?Carousel!bootstrap/js/dist/carousel",
            // Collapse: "exports?Collapse!bootstrap/js/dist/collapse",
            // Dropdown: "exports?Dropdown!bootstrap/js/dist/dropdown",
            // Modal: "exports?Modal!bootstrap/js/dist/modal",
            // Popover: "exports?Popover!bootstrap/js/dist/popover",
            // Scrollspy: "exports?Scrollspy!bootstrap/js/dist/scrollspy",
            // Tab: "exports?Tab!bootstrap/js/dist/tab",
            // Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
            Util: "exports-loader?Util!bootstrap/js/dist/util"
        }),
        new UglifyJSPlugin({
            sourceMap: (process.env.NODE_ENV === 'production') ? false : true,
            minimize: true,
            mangle: false,
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