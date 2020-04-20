const fetch = require('node-fetch');
const thwack = require('..');

thwack.addEventListener('request', ({ options }) => ({ ...options, fetch }));

module.exports = thwack;
