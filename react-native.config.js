module.exports = {
  dependency: {
    assets: ['fonts'],
    hooks: {
      prelink: 'node ./node_modules/@shoutem/ui/scripts/add-native-deps.js',
    },
  },
};
