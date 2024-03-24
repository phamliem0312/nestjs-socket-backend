const axios = require('axios');
const moment = require('moment');

setInterval(() => {
  axios
    .post('http://wss.mindthegapstudio.com:3000/api/v1/VnStock/webhook', {
      symbol: 'HPG',
      open: 30400,
      close: 32600,
      high: 33900,
      low: 29000,
      volume: 5000,
      time: moment().format('YYYY-MM-DD hh:mm:ss'),
    })
    .then((res) => {
      console.log({
        symbol: 'HPG',
        open: 30400,
        close: 32600,
        high: 33900,
        low: 29000,
        volume: 5000,
        time: moment().format('YYYY-MM-DD hh:mm:ss'),
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}, 2000);
