const express = require('express');
const router = express.Router();
const env = require('../bin/env');
// const db = new (require('../bin/db'))(env.user, env.pass);

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('home', { ngApp: 'Printer-Selection-Site', HomeController: 'MainController' });
});

module.exports = router;