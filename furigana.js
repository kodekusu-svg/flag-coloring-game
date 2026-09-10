(() => {
  const phrases = {
    '国旗':'こっき',
    '世界':'せかい',
    '地図':'ちず',
    '日本':'にほん',
    '中国':'ちゅうごく',
    '韓国':'かんこく',
    '台湾':'たいわん',
    '北朝鮮':'きたちょうせん',
    '南アフリカ':'みなみアフリカ',
    '中央アフリカ共和国':'ちゅうおうアフリカきょうわこく',
    '赤道ギニア':'せきどうギニア',
    '東ティモール':'ひがしティモール',
    '北マケドニア':'きたマケドニア',
    '共和国':'きょうわこく',
    '正解':'せいかい',
    '場所':'ばしょ',
    '今日':'きょう',
    '手本':'てほん'
  };

  const kanji = {
    '国':'くに','旗':'はた','世':'せ','界':'かい','地':'ち','図':'ず',
    '日':'に','本':'ほん','中':'ちゅう','韓':'かん','台':'たい','湾':'わん',
    '北':'きた','朝':'ちょう','鮮':'せん','南':'みなみ','央':'おう',
    '共':'きょう','和':'わ','赤':'せき','道':'どう','東':'ひがし','西':'にし',
    '正':'せい','解':'かい','場':'ば','所':'しょ','今':'きょう','手':'て',
    '色':'いろ','数':'かず','名':'な','問':'もん','前':'まえ','後':'あと',
    '同':'おな','一':'いち','次':'つぎ','目':'め','見':'み','塗':'ぬ',
    '選':'えら','入':'い','出':'で','来':'き','近':'ちか','遠':'とお',
    '大':'おお','小':'ちい','高':'たか','低':'ひく','上':'うえ','下':'した',
    '左':'ひだり','右':'みぎ','何':'なに','枚':'まい','完':'かん','成':'せい'
  };

  const phraseKeys = Object.keys(phrases).sort((a, b) => b.length - a.length);
  const kanjiRe = /[一-龯々]/;

  function ruby(base, reading) {
    const r = document.createElement('ruby');
    r.append(document.createTextNode(base));
    const rt = document.createElement('rt');
    rt.textContent = reading;
    r.appendChild(rt);
    return r;
  }

  function convertTextNode(node) {
    if (!node.nodeValue || !kanjiRe.test(node.nodeValue)) return;
    const parent = node.parentElement;
    if (!parent || parent.closest('ruby, rt, script, style, textarea, input, select, option')) return;

    const text = node.nodeValue;
    const frag = document.createDocumentFragment();
    let i = 0;
    let changed = false;

    while (i < text.length) {
      let matched = false;
      for (const key of phraseKeys) {
        if (text.startsWith(key, i)) {
          frag.appendChild(ruby(key, phrases[key]));
          i += key.length;
          matched = true;
          changed = true;
          break;
        }
      }
      if (matched) continue;

      const ch = text[i];
      if (kanji[ch]) {
        frag.appendChild(ruby(ch, kanji[ch]));
        changed = true;
      } else {
        frag.appendChild(document.createTextNode(ch));
      }
      i += 1;
    }

    if (changed) node.replaceWith(frag);
  }

  function apply(root = document.body) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      convertTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.closest('ruby, rt, script, style, textarea, input, select, option')) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(convertTextNode);
  }

  const style = document.createElement('style');
  style.textContent = `
    ruby { ruby-position: over; }
    rt {
      font-size: .46em;
      line-height: .9;
      font-weight: 700;
      letter-spacing: 0;
      color: currentColor;
    }
  `;
  document.head.appendChild(style);

  apply();

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) apply(node);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
