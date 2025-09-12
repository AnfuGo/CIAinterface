module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          app: './app',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }
    ],
    'react-native-reanimated/plugin', // 👈 tem que ser o último plugin
  ],
};
