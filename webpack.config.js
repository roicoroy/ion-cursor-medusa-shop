const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

module.exports = (config, options) => {
  const env = options.optimization ? 'production' : 'development';
  const envPath = path.join(__dirname, `.env.${env}`);
  const fileExists = fs.existsSync(envPath);
  const finalPath = fileExists ? envPath : path.join(__dirname, '.env');
  const fileEnv = dotenv.config({ path: finalPath }).parsed;

  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  config.plugins.push(new webpack.DefinePlugin(envKeys));

  return config;
};