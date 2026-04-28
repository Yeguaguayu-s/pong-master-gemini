const https = require('https');

function download(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(data);
      });
    });
  });
}

(async () => {
  const p = '樊振东';
  const html = await download('https://baike.baidu.com/item/' + encodeURIComponent(p));
  const pics = html.match(/https:\/\/bkimg\.cdn\.bcebos\.com\/[^\s"'>]+/g);
  if (pics) {
     console.log(Array.from(new Set(pics)).slice(0, 10));
  } else {
     console.log('No pics found for ' + p);
  }
})();
