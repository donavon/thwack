// This is the file used when you import from 'thwack/node'
const fetch = require('node-fetch');
const thwack = require('.');

thwack.defaults.fetch = fetch;

module.exports = thwack;
