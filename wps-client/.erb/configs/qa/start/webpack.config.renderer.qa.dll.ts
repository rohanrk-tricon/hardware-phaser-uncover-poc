/**
 * Builds the DLL for qa electron renderer process
 */

import webpack from 'webpack';
import path from 'path';
import { merge } from 'webpack-merge';
import baseConfig from '../../webpack.config.base';
import webpackPaths from '../../webpack.paths';
import { dependencies } from '../../../../package.json';
import checkNodeEnv from '../../../scripts/check-node-env';
import { qaEnvironmentVariables as envVars } from '../../environment.variables';

checkNodeEnv('qa');

const dist = webpackPaths.dllPath;

const configuration: webpack.Configuration = {
  context: webpackPaths.rootPath,

  devtool: 'eval',

  mode: 'none',

  target: 'electron-renderer',

  externals: ['fsevents', 'crypto-browserify'],

  /**
   * Use `module` from `webpack.config.renderer.qa.js`
   */
  module: require('./webpack.config.renderer.qa').default.module,

  entry: {
    renderer: Object.keys(dependencies || {}),
  },

  output: {
    path: dist,
    filename: '[name].qa.dll.js',
    library: {
      name: 'renderer',
      type: 'var',
    },
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between qa builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * qa checks
     */
    new webpack.EnvironmentPlugin(envVars),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: webpackPaths.srcPath,
        output: {
          path: webpackPaths.dllPath,
        },
      },
    }),
  ],
};

export default merge(baseConfig, configuration);
