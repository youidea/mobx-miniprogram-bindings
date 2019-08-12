const path = require('path')
const gulp = require('gulp')
const clean = require('gulp-clean')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const src = path.resolve(__dirname, '../src')
const dist = path.resolve(__dirname, '../miniprogram_dist')

function getWebpackConfig(production) {
  return {
    mode: production ? 'production' : 'development',
    entry: 'src/index.js',
    output: {
      path: dist,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    externals: [nodeExternals()], // 忽略 node_modules
    module: {
      rules: [{
        test: /\.js$/i,
        use: [
          'babel-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/
      }],
    },
    resolve: {
      modules: [src, 'node_modules'],
      extensions: ['.js', '.json'],
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    ],
    optimization: {
      minimize: false,
    },
    devtool: 'nosources-source-map',
    performance: {
      hints: 'warning',
      assetFilter: assetFilename => assetFilename.endsWith('.js')
    }
  }
}

gulp.task('clean', () => {
  gulp.src(dist, {read: false, allowEmpty: true}).pipe(clean())
})

gulp.task('dev', (cb) => {
  webpack(getWebpackConfig(false), cb)
})

gulp.task('build', (cb) => {
  webpack(getWebpackConfig(true), cb)
})

gulp.task('default', gulp.series('build'))
