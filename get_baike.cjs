const http = require('http');
const https = require('https');

function getBaikeImage(name) {
  const url = 'https://baike.baidu.com/item/' + encodeURIComponent(name);
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/<img[^>]+src="([^"]+)"[^>]*>/g);
        if (matches) {
           const urls = matches.map(m => {
             const srcMatch = m.match(/src="([^"]+)"/);
             return srcMatch ? srcMatch[1] : null;
           }).filter(u => u && !u.startsWith('data:')).slice(0, 5);
           resolve(urls);
        } else {
           resolve([]);
        }
      });
    });
  });
}

(async () => {
  const players = ['马龙', '樊振东', '张继科', '许昕', '王楚钦', '孙颖莎'];
  for (const p of players) {
    const urls = await getBaikeImage(p);
    console.log(p);
    urls.forEach(u => console.log(u));
  }
})();
