/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable no-console */

import { mkdir, readFile, writeFile, readdir, stat } from 'fs';
import path from 'path';
import * as reactDocgen from 'react-docgen';
import generateMarkdown from './generate-docs-markdown';
import createMuiTheme from '../src/styles/theme';
import getStylesCreator from '../src/styles/getStylesCreator';

const theme = createMuiTheme();
const componentRegex = /^([A-Z][a-z]+)+\.js/;
const docsDir = path.resolve(__dirname, '../docs/src/pages/component-api');
const srcDir = path.resolve(__dirname, '../src');

function ensureExists(pat, mask, cb) {
  mkdir(pat, mask, err => {
    if (err) {
      if (err.code === 'EEXIST') {
        cb(null); // ignore the error if the folder already exists
      } else {
        cb(err); // something else went wrong
      }
    } else {
      cb(null); // successfully created folder
    }
  });
}

function buildDocs(componentPath) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const component = require(componentPath);
  const styles = {
    classes: [],
    name: null,
  };

  if (component.styles && component.default.options) {
    // Collect the customization points of the `classes` property.
    styles.classes = Object.keys(getStylesCreator(component.styles).create(theme)).filter(
      className => !className.match(/^(@media|@keyframes)/),
    );
    styles.name = component.default.options.name;
  }

  readFile(componentPath, 'utf8', (err, src) => {
    if (src.match(/@ignore - internal component./)) {
      return;
    }

    const relativePath = path.parse(path.relative(srcDir, componentPath));
    const outputDir = path.resolve(docsDir, relativePath.dir);

    let componentInfo;
    try {
      componentInfo = reactDocgen.parse(src);
    } catch (err2) {
      console.log('Error parsing src for', relativePath.name);
      throw err2;
    }

    componentInfo.styles = styles;
    let markdown;
    try {
      markdown = generateMarkdown(relativePath.name, componentInfo);
    } catch (err2) {
      console.log('Error generating markdown for', relativePath.name);
      throw err2;
    }

    ensureExists(outputDir, 0o744, err2 => {
      if (err2) {
        console.log('Error creating directory', outputDir);
        return;
      }
      writeFile(path.resolve(outputDir, `${relativePath.name}.md`), markdown, err3 => {
        if (err3) {
          console.log('Error writing markdown file', path.format(relativePath));
          return;
        }
        console.log('Built markdown docs for', path.format(relativePath));
      });
    });
  });
}

function findComponents(dir) {
  readdir(dir, (err, items) => {
    items.forEach(item => {
      const itemPath = path.resolve(dir, item);
      stat(itemPath, (err2, stats) => {
        if (stats.isDirectory()) {
          findComponents(itemPath);
          return;
        }

        if (!componentRegex.test(item)) {
          return;
        }

        buildDocs(itemPath);
      });
    });
  });
}

findComponents(srcDir);
