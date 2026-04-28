async function searchDuckDuckGo(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' youtube')}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const text = await res.text();
    const match = text.match(/v=([a-zA-Z0-9_-]{11})/g);
    if (match) {
        // give unique ids
        const unique = [...new Set(match)];
        console.log(query, unique.slice(0, 2));
    } else {
        console.log(query, "No matches found");
    }
  } catch (error) {
    console.error(error);
  }
}

async function run() {
  await searchDuckDuckGo("Ma Long highlights");
  await searchDuckDuckGo("Fan Zhendong highlights");
  await searchDuckDuckGo("Zhang Jike highlights");
  await searchDuckDuckGo("Xu Xin highlights");
  await searchDuckDuckGo("Wang Chuqin highlights");
  await searchDuckDuckGo("Sun Yingsha highlights");
}

run();
