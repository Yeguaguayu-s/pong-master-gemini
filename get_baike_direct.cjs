const https = require('https');

function getHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // Let's handle redirects
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
      // Try to match the main image
      const match = html.match(/class="(?:summary-pic|picture)[^>]*>\s*<img[^>]+src="([^"]+)"/i);
      if (match) {
        console.log(p, match[1]);
      } else {
        const match2 = html.match(/<img[^>]+src="([^"]+)"[^>]*class="[^"]*pic[^"]*"/);
        if (match2) {
            console.log(p, 'Fallback 1', match2[1]);
        } else {
            console.log(p, 'Not found');
        }
      }
    } catch(e) {
      console.log(p, 'Error', e.message);
    }
  }
})();
