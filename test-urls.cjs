const https = require('https');
const url = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ma_Long_Rio_2016.jpg";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Referer': '' } }, (res) => {
  console.log("With custom headers:", res.statusCode);
});
