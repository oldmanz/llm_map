const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9001, // Change this to an available port
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    open: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin({
        'MAPTILER_API_KEY': "none",
        'BACKEND_URL': "localhost",
        'BACKEND_EXTERNAL_PORT': "8001",
    }),
],
};
