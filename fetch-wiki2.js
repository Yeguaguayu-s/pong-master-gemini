async function fetchWikiImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=800`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.pages;
  for (let key in pages) {
    if (pages[key].thumbnail) {
      console.log(title, pages[key].thumbnail.source);
    } else {
      console.log(title, 'No thumbnail');
    }
  }
}

fetchWikiImage("Xu_Xin");
