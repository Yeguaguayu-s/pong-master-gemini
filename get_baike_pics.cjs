const https = require('https');

function getHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getHTML(res.headers.location.startsWith('http') ? res.headers.location : `https://baike.baidu.com${res.headers.location}`).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  const players = ['马龙', '樊振东', '张继科', '许昕', '王楚钦', '孙颖莎'];
  for (const p of players) {
    try {
      const html = await getHTML(`https://baike.baidu.com/item/${encodeURIComponent(p)}`);
      
      // We will look for album links inside the item page or just grab all bkimg
      const matches = [...html.matchAll(/https:\/\/bkimg\.cdn\.bcebos\.com\/pic\/([a-f0-9]+)/g)];
      let urls = matches.map(m => `https://bkimg.cdn.bcebos.com/pic/${m[1]}?x-bce-process=image/resize,m_lfit,w_1000,limit_1`);
      const uniqueUrls = [...new Set(urls)].slice(0, 10);
      console.log(`\n### ${p} ###`);
      uniqueUrls.forEach((url, i) => console.log(`[${i}] ${url}`));
      
    } catch(e) {
      console.log(p, 'Error', e.message);
    }
  }
})();
