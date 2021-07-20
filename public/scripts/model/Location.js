const mdb = require('mongoose');

module.exports = mdb.model('Location', {
    displayName: String,
    printers: [mdb.Types.ObjectId]
}, 'Locations')