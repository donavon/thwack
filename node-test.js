const thwack = require('./node10');

(async () => {
  const { data } = await thwack.get('http://donavon.com/');
  console.log(data);
})();
