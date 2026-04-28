const https = require('https');

function downloadAndMatch(url, regex) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(regex);
        resolve(matches || []);
      });
    });
  });
}

(async () => {
  const images = await downloadAndMatch('https://sports.sina.com.cn/others/pingpang/', /https?:\/\/n\.sinaimg\.cn\/[^"']+\.(?:jpg|jpeg|png)/g);
  console.log(Array.from(new Set(images)).slice(0, 30));
})();
