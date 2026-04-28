const https = require('https');

function searchBili(keyword) {
  const url = `https://api.bilibili.com/x/web-interface/search/all/v2?keyword=${encodeURIComponent(keyword)}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = json.data.result.find(r => r.result_type === 'video').data;
          resolve(results.slice(0, 4).map(v => v.pic));
        } catch(e) {
          resolve([]);
        }
      });
    });
  });
}

(async () => {
  const players = ['乒乓球樊振东', '乒乓球张继科', '乒乓球孙颖莎'];
  for (const p of players) {
    const pics = await searchBili(p);
    console.log(p);
    pics.forEach(pic => console.log(pic));
  }
})();
