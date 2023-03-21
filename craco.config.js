const path = require('path');

module.exports = {
  webpack: {
    paths: (paths) => {
      paths.appIndexJs = path.resolve(__dirname, 'src/main/index.js'); // Update the appIndexJs path
      return paths;
    },
    configure: (webpackConfig, { env, paths }) => {
      paths.appIndexJs = path.resolve(__dirname, 'src/main/index.js'); // Update the appIndexJs path

      // Set the new entry points
      webpackConfig.entry = {
        main: path.resolve(__dirname, 'src/main/index.js'),
        'another-entry': path.resolve(__dirname, 'src/another-entry/index.js'),
      };

      // Update the output configuration to use the entry point names
      webpackConfig.output.filename = env === 'development' ? 'static/js/[name].bundle.js' : 'static/js/[name].[contenthash:8].js';

      // Update HtmlWebpackPlugin to generate separate HTML files for each entry point
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      const plugins = webpackConfig.plugins.map((plugin) => {
        if (plugin instanceof HtmlWebpackPlugin) {
          return new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html',
            chunks: ['main'],
          });
        }
        return plugin;
      });

      // Add another HtmlWebpackPlugin instance for the second entry point
      plugins.push(
        new HtmlWebpackPlugin({
          inject: true,
          // template: paths.appHtml,
          template: path.resolve(__dirname, 'public/another-entry.html'),
          filename: 'another-entry.html',
          chunks: ['another-entry'],
        })
      );

      webpackConfig.plugins = plugins;

      return webpackConfig;
    },
  },
};