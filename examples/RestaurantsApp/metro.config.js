const blacklist = require('metro-config/src/defaults/blacklist');

/**
 * Default configuration for the CLI.
 *
 * If you need to override any of this functions do so by defining the file
 * `rn-cli.config.js` on the root of your project with the functions you need
 * to tweak.
 *
 * https://facebook.github.io/metro/docs/en/configuration
 */
const config = {
  resolver: {
    /**
     * Returns a regular expression for modules that should be ignored by the
     * packager on a given platform.
     */
    blacklistRE: blacklist([]),

    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  },
};

module.exports = config;
