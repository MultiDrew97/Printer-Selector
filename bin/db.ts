// const utils = require('./utils');
const mdb = require('mongoose');
const Printers = require('../public/scripts/model/Printer');
const Locations = require('../public/scripts/model/Location');
import { utils } from './utils'
import { env } from './env'

export const database = class {

    uri = process.env.NODE_ENV === 'development' ? env.db.development : env.db.production
    constructor(user, pass) {
        this.uri = utils.format(this.uri, user, pass);
        this.connect()
    }

    connect() {
        mdb.connect(this.uri, { useUnifiedTopology: true, useNewUrlParser: true }).then(success => {
            console.debug('Connected to database');
        }, reason => {
            console.debug(reason);
            throw new Error("Couldn't connect to database");
        })
    }

    getPrinters(): Promise<any> {
        return Printers.find({}).then(printers => {
            return printers;
        }, reason => {
            throw new Error(reason);
        });
    }

    getPrinter(id): Promise<any> {
        return Printers.find({_id: id}).then(printer => {
            return printer;
        }, reason => {
            throw new Error(reason);
        });
    }

    getLocations() {
        return Locations.find({}).then(locations => {
            return locations;
        }, reason => {
            throw new Error(reason);
        });
    }

    getLocation(id) {
        return Locations.find({_id: id}).then(location => {
            return location;
        }, reason => {
            throw new Error(reason);
        });
    }
}

// module.exports = Database;