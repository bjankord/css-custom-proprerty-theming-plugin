const fs = require('fs-extra');
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const PostCSSCustomProperties = require('postcss-custom-properties');

class ThemedCssPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { themesDir, themes } = this.options;

    compiler.hooks.emit.tapAsync('ThemedCssPlugin', (compilation, callback) => {
      // Loop through all the passed in themeFiles
      themes.forEach(function (themeFile) {
        const themeFilePath = `${themesDir}/${themeFile}`;
        // Read contents of theme file
        const themeFileContent = fs.readFileSync(themeFilePath).toString();

        // Start building content for generated theme file
        let generatedThemeFile = themeFileContent;

        // Add new line between theme CSS and main entry CSS
        generatedThemeFile += '\n\n';

        // Loop through all compiled assets,
        for (var filename in compilation.assets) {
          if (filename === 'main.css') {
            // Add main entry to generated theme file
            generatedThemeFile += compilation.assets[filename].source();
            // need to delete (clean) any :root css custom defined vars before placing in new theme file
            // if main.css has :root theme vars defined in it already, they will take precedence over
            // the :root theme vars we are going to inject
          }
        }

        let postCssThemeFile;
        // compile CSS custom properties down to static values
        postcss([autoprefixer, PostCSSCustomProperties({preserve: false})])
          .process(generatedThemeFile)
          .then(result => {
            postCssThemeFile = result.css;
          });

        // Insert generated theme file into the webpack build as a new file asset:
        compilation.assets[themeFile] = {
          source() {
            return postCssThemeFile;
          },
          size() {
            return postCssThemeFile.length;
          }
        };
      });

      callback();
    });
  }
}

module.exports = ThemedCssPlugin;