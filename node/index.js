const fetch = require('node-fetch');
const thwack = require('..');

thwack.defaults.fetch = fetch;

module.exports = thwack;
