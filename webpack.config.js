const path = require('path');

module.exports = {
    entry: './client-src/js/client.js',
    output: {
        filename: 'client.bundle.js',
        path: path.resolve(__dirname, 'public')
    },
};
