async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.pages;
  for (let key in pages) {
    if (pages[key].imageinfo && pages[key].imageinfo[0].url.endsWith('.jpg')) {
      console.log(pages[key].title, pages[key].imageinfo[0].url);
      return;
    }
  }
}
searchCommons("Xu Xin table tennis");
