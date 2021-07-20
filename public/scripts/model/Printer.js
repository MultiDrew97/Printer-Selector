const mdb = require('mongoose');

module.exports = mdb.model('Printer', {
    displayName: String,
    pathName: String
}, 'Printers')