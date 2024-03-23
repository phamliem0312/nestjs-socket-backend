const axios = require('axios');
const moment = require('moment');

setInterval(() => {
  axios
    .post('http://127.0.0.1:3000/api/v1/VnStock/webhook', {
      symbol: 'HPG',
      open: 30400,
      close: 32600,
      high: 32900,
      low: 30000,
      volume: 10000,
      time: moment().format('YYYY-MM-DD hh:mm:ss'),
    })
    .then((res) => {
      console.log({
        symbol: 'HPG',
        open: 30400,
        close: 32600,
        high: 32900,
        low: 30000,
        volume: 10000,
        time: moment().format('YYYY-MM-DD hh:mm:ss'),
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}, 1000);
