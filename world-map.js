(() => {
  const MAP_URL = 'https://raw.githubusercontent.com/melenaos/Menelabs.VectorAtlas/main/dist/world.svg';
  let mapPromise = null;

  function ensureMap(){
    const host = document.querySelector('#worldMap');
    if (!host) return Promise.resolve(null);
    if (host.querySelector('svg')) return Promise.resolve(host.querySelector('svg'));
    if (mapPromise) return mapPromise;

    host.innerHTML = '<span class="map-loading">ちずを よみこみちゅう…</span>';
    mapPromise = fetch(MAP_URL)
      .then(r => {
        if (!r.ok) throw new Error(`map fetch failed: ${r.status}`);
        return r.text();
      })
      .then(text => {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = doc.documentElement;
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('role','img');
        svg.setAttribute('aria-label','世界地図');
        svg.classList.add('world-map-svg');
        host.replaceChildren(document.importNode(svg, true));
        return host.querySelector('svg');
      })
      .catch(err => {
        console.error(err);
        host.innerHTML = '<span class="map-loading">ちずを よみこめませんでした</span>';
        return null;
      });
    return mapPromise;
  }

  function addMarker(svg, path){
    svg.querySelectorAll('.map-marker-ring,.map-marker-dot').forEach(n=>n.remove());
    if (!path) return;
    const box = path.getBBox();
    const cx = box.x + box.width/2;
    const cy = box.y + box.height/2;
    const ns = 'http://www.w3.org/2000/svg';
    const tiny = Math.max(box.width, box.height) < 16;
    if (!tiny) return;

    const ring = document.createElementNS(ns,'circle');
    ring.setAttribute('cx',cx); ring.setAttribute('cy',cy); ring.setAttribute('r','13');
    ring.classList.add('map-marker-ring');
    const dot = document.createElementNS(ns,'circle');
    dot.setAttribute('cx',cx); dot.setAttribute('cy',cy); dot.setAttribute('r','5');
    dot.classList.add('map-marker-dot');
    svg.append(ring,dot);
  }

  function highlight(code,name){
    ensureMap().then(svg => {
      const label = document.querySelector('#mapCountryName');
      if (!svg) {
        if (label) label.textContent = `${name} の ばしょ`;
        return;
      }
      svg.querySelectorAll('path.map-highlight').forEach(p=>p.classList.remove('map-highlight'));
      const path = svg.querySelector(`#${CSS.escape(String(code).toLowerCase())}`);
      if (path) {
        path.classList.add('map-highlight');
        addMarker(svg,path);
        if (label) label.textContent = `${name} は ここ！`;
      } else {
        addMarker(svg,null);
        if (label) label.textContent = `${name} の ばしょを みてみよう！`;
      }
    });
  }

  window.FlagWorldMap = { highlight };
  ensureMap();
})();
