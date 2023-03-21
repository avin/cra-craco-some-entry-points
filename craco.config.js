const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Set the new entry points
      webpackConfig.entry = {
        main: paths.appIndexJs,
        'another-entry': path.resolve(__dirname, 'src/another-entry.js'),
      };

      // Update the output configuration to use the entry point names
      webpackConfig.output.filename = env === 'development' ? 'static/js/[name].bundle.js' : 'static/js/[name].[contenthash:8].js';

      // Update HtmlWebpackPlugin to generate separate HTML files for each entry point
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      const plugins = webpackConfig.plugins.map((plugin) => {
        if (plugin instanceof HtmlWebpackPlugin) {
          return new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
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