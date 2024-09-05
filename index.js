const fs = require('fs');
const glob = require('glob');
const resume = require('resume-cli/lib');

const SOURCE_DIR = 'src';
const DEST_DIR = 'docs';
const DEST_FORMAT = 'html';
const THEMES = ['elegant', 'flat', 'short'];
const DEFAULT_THEME = 'elegant';

fs.exists(DEST_DIR, exists => (exists ? null : fs.mkdirSync(DEST_DIR)));

function handleResumeBuildingResult(err, filename, format) {
  if (err) {
    console.error(err);
  } else {
    console.log(`Created ${filename}${format}`);
  }
}

function buildResumeFromJSONFile(
  file,
  destinationPath,
  destinationFormat,
  themes,
  defaultTheme
) {
  fs.readFile(file, (err, data) => {
    file = file.substring(file.lastIndexOf('/') + 1);
    file = file.substring(0, file.lastIndexOf('.'));

    themes.forEach(theme => {
      resume.exportResume(
        JSON.parse(data),
        `${destinationPath}/${file}-${theme}.${destinationFormat}`,
        {
          theme: theme,
          format: destinationFormat
        },
        handleResumeBuildingResult
      );
    });

    resume.exportResume(
      JSON.parse(data),
      `${destinationPath}/${file}.${destinationFormat}`,
      {
        theme: defaultTheme,
        format: destinationFormat
      },
      handleResumeBuildingResult
    );
  });
}

(function main() {
  glob(`${SOURCE_DIR}/**/*.json`, {}, (err, files) => {
    files.forEach(file =>
      buildResumeFromJSONFile(
        file,
        DEST_DIR,
        DEST_FORMAT,
        THEMES,
        DEFAULT_THEME
      )
    );
  });
})();
