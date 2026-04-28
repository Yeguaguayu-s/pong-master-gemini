const https = require('https');

https.get('https://image.baidu.com/search/down?url=https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ma_Long_ATTC2017_29.jpeg/960px-Ma_Long_ATTC2017_29.jpeg', (res) => {
  console.log('Headers:', res.headers);
});
