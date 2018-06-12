/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from src
*/
function parse(src) {
  const obj = {};

  // convert Buffers before splitting into lines and processing
  src.toString().split('\n').forEach(function(line) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];

      // default undefined or missing values to empty string
      let value = keyValueArr[2] || '';

      // expand newlines in quoted values
      const len = value ? value.length : 0;
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim();

      obj[key] = value;
    }
  });

  return obj;
}

function config(buf) {
  try {
    const parsed = parse(buf);

    Object.keys(parsed).forEach(function(key) {
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key];
      }
    });

    return { parsed };
  } catch (e) {
    return { error: e };
  }
}

module.exports.config = config;
module.exports.parse = parse;
