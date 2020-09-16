npm i --save-dev enzyme enzyme-adapter-react-16;
npm i --save-dev jest jest-enzyme
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackUtils = require('./webpack.utils');
const CopyPlugin = require('copy-webpack-plugin');

let ENV_FLAG = 'production';
if (process.argv.includes('--dev')) {
  ENV_FLAG = 'development';
}

module.exports = {
  context: __dirname,
  entry: {
    'account-view-mfu': './src/WebComponentApp.tsx'
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'main.js',
    publicPath: '/'
  },
  resolve: {
    modules: ['node_modules', 'vendor', 'src'],
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.scss', '.css']
    // alias: aliases
  },
  stats: {
    // Add errors
    errors: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
    // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
    moduleTrace: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /(node_modules|vendor)/
      },
      {
        test: /\.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: envDep(
              {
                importLoaders: 1,
                sourceMap: true
              },
              {
                sourceMap: false,
                discardComments: {
                  removeAll: true
                },
                options: {
                  minimize: true
                }
              }
            )
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?name=[name].[hash].[ext]',
        options: {
          publicPath: '/',
          // Inline files smaller than 10 kB (10240 bytes)
          limit: 10 * 1024,
        },
      },
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          publicPath: '/',
          // Inline files smaller than 10 kB (10240 bytes)
          limit: 10 * 1024
        }
      },
      {
        test: /\.svg$/,
        loader: 'react-svg-loader'
      }
    ]
  },
  resolveLoader: {
    alias: {
      svgInlineLoader: 'svg-inline-loader'
    }
  },
  optimization: {
    noEmitOnErrors: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV_FLAG),
        API: JSON.stringify(process.env.API),
        VERSION: JSON.stringify(new Date())
      },
      VERSION: JSON.stringify(require('./package.json').version)
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['account-view-mfu'],
      filename: 'account-view-mfu.html',
      template: 'src/account-view-mfu.html',
      inject: false
    }),
     // Chunksortmode has been removed for perf reasons in Webpack 4
    //https://github.com/jantimon/html-webpack-plugin/issues/1055
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: './src/application.html',
      hash: true,
      chunks: ['app', 'vendor']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyPlugin({
      patterns: [{
      from: 'nginx.conf',
      to: ''
      }]
    })
  ]
};

function envDep(dev, prod) {
  return webpackUtils.isDev() ? dev : prod;
}




const dev = require('./webpack.dev.config.js');
const prod = require('./webpack.prod.config.js');

module.exports = (function () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return dev;
    case 'production':
      return prod;
    default:
      console.log('Unexpected process.env value: ' + process.env.NODE_ENV);
  }
})();


const webpackBaseConfig = require('./webpack.base.config');

module.exports = generateConfig(webpackBaseConfig);

function generateConfig(baseConfig) {
  baseConfig['devServer'] = {
    'contentBase': 'src',
    'compress': true,
    // https://webpack.js.org/configuration/dev-server/#devserverhot -- Increase development speed with less server reloads
    // https://webpack.js.org/concepts/hot-module-replacement/#in-the-application -- Webpack docs suggestions for HMR use
    'hot': true,
    'port': 9000,
    'historyApiFallback': true,
    'stats': 'minimal'
  };
  baseConfig.mode = 'development';
  return baseConfig;
}


const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackBaseConfig = require('./webpack.base.config');
// https://github.com/webpack-contrib/terser-webpack-plugin/issues/15 -- Performance improvements have been seen with Terser
// https://webpack.js.org/plugins/terser-webpack-plugin/ -- Terser is the suggested plugin in documentation
// https://github.com/webpack/webpack/issues/7923 -- Internally Webpack switched to Terser as well
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = generateConfig(webpackBaseConfig);

function generateConfig(baseConfig) {
  const config = { ...baseConfig };
  config.plugins = config.plugins.concat([
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundleAnalysis.html',
      openAnalyzer: false
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }]
      },
      canPrint: true
    })
  ]);
  config.optimization.minimize = true;
  config.optimization.sideEffects = false;
  config.optimization.nodeEnv = 'production';
  config.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        compress: {
          module: true,
        },
        format: {
          comments: false,
          ascii_only: true,
        },
        mangle: true,
      },
      extractComments: false,
    }),
  ]
  config.mode = 'production';
  config.performance = {
    hints: false,
    maxEntrypointSize: 4096000,
    maxAssetSize: 512000
  };
  return config;
}


const NODE_ENV_DEVELOPMENT = 'development';
const NODE_ENV_PRODUCTION = 'production';
const NODE_ENV = process.env.NODE_ENV || NODE_ENV_DEVELOPMENT;

if (![NODE_ENV_DEVELOPMENT, NODE_ENV_PRODUCTION].includes(NODE_ENV)) {
  console.error('Error: Environment variable NODE_ENV must be one of (', NODE_ENV_DEVELOPMENT, NODE_ENV_PRODUCTION, ')');
  process.exit(2);
}

module.exports = {
  isDev: isDev,
  getNodeEnv: getNodeEnv
};

function isDev() {
  return getNodeEnv() === NODE_ENV_DEVELOPMENT;
}

function getNodeEnv() {
  return NODE_ENV || NODE_ENV_DEVELOPMENT;
}


{
  "compilerOptions": {
    "outDir": "./build",
    "target": "es5",
    "jsx": "react",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "skipLibCheck": true,
    "baseUrl": "./",
    "lib": [
      "es2017",
      "dom"
    ],
    "types": [
      "react",
      "node",
      "jest"
    ],
    "resolveJsonModule": true,
    "typeRoots": ["./typings", "./node_modules/@types"],
    "keyofStringsOnly": true,
    "module": "es6",
    "paths": {
      "~images": [
        "src/images"
      ],
      "~*": [
        "src/*"
      ]
    }
  },
  "include": [
    "src/**/*",
    "@types/**/*",
    "node_modules/@types"
  ],
  "exclude": [
    "node_modules",
    "__mocks__",
    "__tests__"
  ]
}


{
  "presets": [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        "corejs": 3,
        "targets": {
          "node": "current"
        },
        "useBuiltIns": "entry"
      }
    ],
    "@babel/preset-typescript"
  ]
}





