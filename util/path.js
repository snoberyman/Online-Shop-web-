// a hlper that point to root directory

const path = require('path');

module.exports = path.dirname(process.mainModule.filename);