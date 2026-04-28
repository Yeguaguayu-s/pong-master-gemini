const https = require('https');

function searchSina(query) {
  const url = `https://search.sina.com.cn/?q=${encodeURIComponent(query)}&c=news&from=&col=&range=&source=&country=&size=&time=&a=&page=1&pf=0&ps=0&dpc=1`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https?:\/\/[a-z0-9]+\.sinaimg\.cn\/[^"']+/g);
        resolve(matches ? matches.slice(0, 5) : []);
      });
    });
  });
}

(async () => {
  const players = ['马龙 比赛', '樊振东 比赛', '张继科 比赛', '许昕 比赛', '王楚钦 比赛'];
  for (const p of players) {
    const urls = await searchSina(p);
    console.log(p);
    urls.forEach(u => console.log(u));
  }
})();
