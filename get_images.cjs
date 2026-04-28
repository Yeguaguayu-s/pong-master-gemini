const https = require('https');

function searchSogou(query) {
  const url = 'https://pic.sogou.com/napi/pc/searchList?mode=1&start=0&xml_len=4&query=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const urls = json.data.items.map(item => item.picUrl).slice(0, 4);
          resolve(urls);
        } catch (e) {
          resolve([]);
        }
      });
    });
  });
}

(async () => {
  const players = ['马龙 乒乓球', '樊振东 乒乓球', '张继科 乒乓球', '许昕 乒乓球', '王楚钦 乒乓球', '孙颖莎 乒乓球'];
  for (const p of players) {
    const urls = await searchSogou(p);
    console.log(p);
    console.log(urls);
  }
})();
