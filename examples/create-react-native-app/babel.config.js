module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      '@babel/transform-react-jsx-source',
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
