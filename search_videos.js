async function searchBilibili(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:bilibili.com/video/')}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const text = await res.text();
    const match = text.match(/BV1[a-zA-Z0-9]{9}/g);
    if (match) {
        const unique = [...new Set(match)];
        console.log(query, unique.slice(0, 1));
    } else {
        console.log(query, "No matches found");
    }
  } catch (error) {
    console.error(error);
  }
}

async function run() {
  await searchBilibili("张继科 龙队 精彩");
  await searchBilibili("许昕 蛇队 精彩");
  await searchBilibili("王楚钦 大头 精彩");
  await searchBilibili("孙颖莎 暴力 精彩");
}

run();
