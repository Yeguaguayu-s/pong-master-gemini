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
  const htt = require('http'); // for sohu
  const images = await new Promise((resolve) => {
    htt.get('http://sports.sohu.com/pingpang/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/https?:\/\/[a-zA-Z0-9_.-]+sohu.[a-zA-Z0-9_.-]+\/[^"']+\.(?:jpg|jpeg|png)/g);
        resolve(matches || []);
      });
    });
  });
  console.log(Array.from(new Set(images)).slice(0, 30));
})();
