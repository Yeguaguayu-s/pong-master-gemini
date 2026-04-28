const https = require('https');

function getBiliPic(bvid) {
  const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data ? json.data.pic : null);
        } catch(e) {
          resolve(null);
        }
      });
    });
  });
}

(async () => {
  const bvids = ['BV1xx411c7mP', 'BV1Ex411w7fF', 'BV15x41117N3', 'BV1bx4y1P7S5', 'BV1YUSDBxETS'];
  for (const bvid of bvids) {
    const pic = await getBiliPic(bvid);
    console.log(bvid, pic);
  }
})();
