module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          app: './app',
          assets: './assets'
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif']
      }
    ],
    'react-native-reanimated/plugin' // 👈 tem que ser o último plugin
  ]
};
