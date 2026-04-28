const https = require('https');

function searchBaiduPic(query) {
  const url = `https://m.baidu.com/sf/vsearch/image/search/ala/api?format=json&query=${encodeURIComponent(query)}&pn=0&rn=5`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const urls = json.data.list.map(i => i.img).filter(i => i).slice(0, 5);
          resolve(urls);
        } catch (e) {
          resolve([]);
        }
      });
    });
  });
}

(async () => {
  const players = ['马龙 乒乓球', '樊振东 乒乓球', '张继科 乒乓球', '许昕 乒乓球'];
  for (const p of players) {
    const urls = await searchBaiduPic(p);
    console.log(p);
    urls.forEach(u => console.log(u));
  }
})();
