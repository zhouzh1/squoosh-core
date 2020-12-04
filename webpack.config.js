const path = require('path');
const entry = path.resolve(__dirname, './index.ts');
const output = path.resolve(__dirname, './dist');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
    return {
        mode: env == 'production' ? 'production' : 'development',
        entry: entry,
        output: {
            path: output,
            filename: env == 'production' ? 'squoosh-core.bundle.min.js' : 'squoosh-core.bundle.js',
            library: 'squooshCore',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: false,
                                compilerOptions: {
                                    module: "es2015",
                                    sourceMap: true
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.js/,
                    exclude: /node_modules/,
                    use: 'babel-loader?cacheDirectory'
                }
            ]
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false,
                    extractComments: true,
                    terserOptions: {
                        warnings: false,
                        compress: {
                            pure_funcs: ['console.log']
                        },
                    }
                })
            ],
        },
        resolve: {
            extensions: [
                ".ts",
                ".js"
            ], // require 无需后缀
        },
    }
};