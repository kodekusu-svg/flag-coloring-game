(() => {
  const R = (id, type, attrs, color) => ({ id, type, ...attrs, color });
  const rect = (id, x, y, width, height, color) => R(id, 'rect', { x, y, width, height }, color);
  const circle = (id, cx, cy, r, color) => R(id, 'circle', { cx, cy, r }, color);
  const poly = (id, points, color) => R(id, 'polygon', { points }, color);

  const h = (id, name, colors, level = 1, heights = null) => {
    const hs = heights || Array(colors.length).fill(200 / colors.length);
    let y = 0;
    return { id, name, level, ratio:[3,2], regions: colors.map((c,i) => {
      const reg = rect(`s${i}`, 0, y, 300, hs[i], c); y += hs[i]; return reg;
    })};
  };

  const v = (id, name, colors, level = 1, widths = null) => {
    const ws = widths || Array(colors.length).fill(300 / colors.length);
    let x = 0;
    return { id, name, level, ratio:[3,2], regions: colors.map((c,i) => {
      const reg = rect(`s${i}`, x, 0, ws[i], 200, c); x += ws[i]; return reg;
    })};
  };

  const circ = (id, name, bg, dot, level = 1, cx = 150, cy = 100, r = 55) => ({
    id, name, level, ratio:[3,2],
    regions:[rect('bg',0,0,300,200,bg), circle('dot',cx,cy,r,dot)]
  });

  const nordic = (id, name, bg, crossColor, level = 3, borderColor = null) => {
    const regions = [rect('bg',0,0,300,200,bg)];
    if (borderColor) {
      regions.push(rect('vBorder',88,0,44,200,borderColor), rect('hBorder',0,78,300,44,borderColor));
      regions.push(rect('vCross',98,0,24,200,crossColor), rect('hCross',0,88,300,24,crossColor));
    } else {
      regions.push(rect('vCross',94,0,30,200,crossColor), rect('hCross',0,85,300,30,crossColor));
    }
    return { id, name, level, ratio:[3,2], regions };
  };

  const centerStar = (id, name, bg, starColor, level = 3, cx=150, cy=100, outer=34, inner=14) => {
    const pts = [];
    for (let i=0;i<10;i++) {
      const a = -Math.PI/2 + i*Math.PI/5;
      const r = i%2===0 ? outer : inner;
      pts.push(`${cx + Math.cos(a)*r},${cy + Math.sin(a)*r}`);
    }
    return { id, name, level, ratio:[3,2], regions:[rect('bg',0,0,300,200,bg), poly('star',pts.join(' '),starColor)] };
  };

  const FLAGS = [
    circ('jp','にほん','#ffffff','#bc002d',1,150,100,60),
    h('ua','ウクライナ',['#0057b7','#ffd700'],1),
    v('fr','フランス',['#0055a4','#ffffff','#ef4135'],2),
    h('de','ドイツ',['#000000','#dd0000','#ffce00'],2),
    v('it','イタリア',['#009246','#ffffff','#ce2b37'],2),
    h('nl','オランダ',['#ae1c28','#ffffff','#21468b'],2),
    v('be','ベルギー',['#000000','#ffd90c','#ef3340'],2),
    v('ie','アイルランド',['#169b62','#ffffff','#ff883e'],2),
    v('ro','ルーマニア',['#002b7f','#fcd116','#ce1126'],2),
    h('at','オーストリア',['#ed2939','#ffffff','#ed2939'],2),
    h('pl','ポーランド',['#ffffff','#dc143c'],1),
    h('id','インドネシア',['#ff0000','#ffffff'],1),
    h('mc','モナコ',['#ce1126','#ffffff'],1),
    h('lu','ルクセンブルク',['#ed2939','#ffffff','#00a1de'],2),
    h('ru','ロシア',['#ffffff','#0039a6','#d52b1e'],2),
    h('hu','ハンガリー',['#ce2939','#ffffff','#477050'],2),
    h('bg','ブルガリア',['#ffffff','#00966e','#d62612'],2),
    h('ee','エストニア',['#4891d9','#000000','#ffffff'],2),
    h('lt','リトアニア',['#fdb913','#006a44','#c1272d'],2),
    h('lv','ラトビア',['#9e3039','#ffffff','#9e3039'],2,[80,40,80]),
    h('am','アルメニア',['#d90012','#0033a0','#f2a800'],2),
    h('ye','イエメン',['#ce1126','#ffffff','#000000'],2),
    h('ga','ガボン',['#009e60','#fcd116','#3a75c4'],2),
    h('sl','シエラレオネ',['#1eb53a','#ffffff','#0072c6'],2),
    v('ml','マリ',['#14b53a','#fcd116','#ce1126'],2),
    v('gn','ギニア',['#ce1126','#fcd116','#009460'],2),
    v('td','チャド',['#002664','#fecb00','#c60c30'],2),
    v('ng','ナイジェリア',['#008753','#ffffff','#008753'],2),
    v('ci','コートジボワール',['#f77f00','#ffffff','#009e60'],2),
    h('co','コロンビア',['#fcd116','#003893','#ce1126'],2,[100,50,50]),
    h('ec','エクアドル',['#ffd100','#034ea2','#ed1c24'],3,[100,50,50]),
    h('ve','ベネズエラ',['#f4c300','#0033a0','#cf142b'],3),
    h('bo','ボリビア',['#d52b1e','#f9e300','#007934'],2),
    v('pe','ペルー',['#d91023','#ffffff','#d91023'],2),
    h('ar','アルゼンチン',['#74acdf','#ffffff','#74acdf'],3),
    h('cr','コスタリカ',['#002b7f','#ffffff','#ce1126','#ffffff','#002b7f'],3,[34,34,64,34,34]),
    h('th','タイ',['#a51931','#f4f5f8','#2d2a4a','#f4f5f8','#a51931'],3,[30,30,80,30,30]),
    (() => { const f=h('in','インド',['#ff9933','#ffffff','#138808'],3); f.regions.push(circle('chakra',150,100,24,'#000080')); return f; })(),
    h('ne','ニジェール',['#e05206','#ffffff','#0db02b'],3),
    circ('bd','バングラデシュ','#006a4e','#f42a41',2,135,100,50),
    circ('pw','パラオ','#4aadd6','#ffde00',2,130,100,48),
    (() => { const f=h('la','ラオス',['#ce1126','#002868','#ce1126'],3,[50,100,50]); f.regions.push(circle('disc',150,100,38,'#ffffff')); return f; })(),
    (() => ({id:'gl',name:'グリーンランド',level:3,ratio:[3,2],regions:[rect('top',0,0,300,100,'#ffffff'),rect('bottom',0,100,300,100,'#d00c33'),circle('discTop',110,100,45,'#d00c33'),circle('discBottom',110,100,25,'#ffffff')]}))(),
    nordic('fi','フィンランド','#ffffff','#003580',3),
    nordic('se','スウェーデン','#006aa7','#fecc00',3),
    nordic('no','ノルウェー','#ba0c2f','#00205b',4,'#ffffff'),
    nordic('dk','デンマーク','#c60c30','#ffffff',3),
    nordic('is','アイスランド','#02529c','#d72828',4,'#ffffff'),
    (() => ({id:'ch',name:'スイス',level:3,ratio:[1,1],regions:[rect('bg',0,0,300,200,'#ff0000'),rect('v',128,45,44,110,'#ffffff'),rect('h',93,80,114,40,'#ffffff')]}))(),
    (() => ({id:'gb',name:'イギリス',level:5,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#012169'),poly('d1','0,0 28,0 300,172 300,200 272,200 0,28','#ffffff'),poly('d2','272,0 300,0 300,28 28,200 0,200 0,172','#ffffff'),poly('r1','0,0 13,0 300,186 300,200 287,200 0,14','#c8102e'),poly('r2','287,0 300,0 300,14 13,200 0,200 0,186','#c8102e'),rect('vw',120,0,60,200,'#ffffff'),rect('hw',0,70,300,60,'#ffffff'),rect('vr',132,0,36,200,'#c8102e'),rect('hr',0,82,300,36,'#c8102e')]}))(),
    (() => ({id:'ge',name:'ジョージア',level:4,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#ffffff'),rect('v',135,0,30,200,'#ff0000'),rect('h',0,85,300,30,'#ff0000'),rect('c1v',65,25,10,45,'#ff0000'),rect('c1h',48,42,44,10,'#ff0000'),rect('c2v',225,25,10,45,'#ff0000'),rect('c2h',208,42,44,10,'#ff0000'),rect('c3v',65,130,10,45,'#ff0000'),rect('c3h',48,147,44,10,'#ff0000'),rect('c4v',225,130,10,45,'#ff0000'),rect('c4h',208,147,44,10,'#ff0000')]}))(),
    (() => { const regs=[]; for(let i=0;i<9;i++) regs.push(rect(`s${i}`,0,i*(200/9),300,200/9,i%2===0?'#0d5eaf':'#ffffff')); regs.push(rect('canton',0,0,120,111,'#0d5eaf'),rect('cv',48,0,24,111,'#ffffff'),rect('ch',0,43,120,24,'#ffffff')); return {id:'gr',name:'ギリシャ',level:4,ratio:[3,2],regions:regs}; })(),
    (() => ({id:'do',name:'ドミニカ共和国',level:4,ratio:[3,2],regions:[rect('tl',0,0,125,85,'#002d62'),rect('tr',175,0,125,85,'#ce1126'),rect('bl',0,115,125,85,'#ce1126'),rect('br',175,115,125,85,'#002d62'),rect('v',125,0,50,200,'#ffffff'),rect('h',0,85,300,30,'#ffffff')]}))(),
    (() => ({id:'pa',name:'パナマ',level:4,ratio:[3,2],regions:[rect('tl',0,0,150,100,'#ffffff'),rect('tr',150,0,150,100,'#d21034'),rect('bl',0,100,150,100,'#005293'),rect('br',150,100,150,100,'#ffffff'),poly('s1','75,30 82,51 104,51 86,64 93,85 75,72 57,85 64,64 46,51 68,51','#005293'),poly('s2','225,115 232,136 254,136 236,149 243,170 225,157 207,170 214,149 196,136 218,136','#d21034')]}))(),
    (() => ({id:'cz',name:'チェコ',level:3,ratio:[3,2],regions:[rect('top',0,0,300,100,'#ffffff'),rect('bottom',0,100,300,100,'#d7141a'),poly('tri','0,0 120,100 0,200','#11457e')]}))(),
    (() => ({id:'ph',name:'フィリピン',level:4,ratio:[3,2],regions:[rect('top',0,0,300,100,'#0038a8'),rect('bottom',0,100,300,100,'#ce1126'),poly('tri','0,0 120,100 0,200','#ffffff'),circle('sun',45,100,18,'#fcd116')]}))(),
    (() => { const f=h('bs','バハマ',['#00abc9','#fcd116','#00abc9'],3); f.regions.push(poly('tri','0,0 105,100 0,200','#000000')); return f; })(),
    (() => ({id:'za',name:'南アフリカ',level:5,ratio:[3,2],regions:[rect('top',0,0,300,100,'#de3831'),rect('bottom',0,100,300,100,'#002395'),poly('black','0,20 110,100 0,180','#000000'),poly('yellow','0,8 125,100 0,192 0,165 90,100 0,35','#ffb612'),poly('green','0,38 85,100 0,162 0,140 58,100 0,60','#007a4d'),poly('green2','58,88 300,88 300,112 58,112','#007a4d')]}))(),
    (() => ({id:'jm',name:'ジャマイカ',level:4,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#009b3a'),poly('top','0,0 300,0 150,86','#000000'),poly('bottom','0,200 300,200 150,114','#000000'),poly('diag1','0,0 24,0 300,176 300,200 276,200 0,24','#fed100'),poly('diag2','276,0 300,0 300,24 24,200 0,200 0,176','#fed100')]}))(),
    (() => ({id:'tz',name:'タンザニア',level:4,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#1eb53a'),poly('blue','90,200 300,60 300,200','#00a3dd'),poly('yellow','0,145 0,175 240,0 200,0','#fcd116'),poly('black','0,157 0,163 216,0 204,0','#000000')]}))(),
    (() => ({id:'ke',name:'ケニア',level:4,ratio:[3,2],regions:[rect('top',0,0,300,65,'#000000'),rect('white1',0,65,300,10,'#ffffff'),rect('mid',0,75,300,50,'#bb0000'),rect('white2',0,125,300,10,'#ffffff'),rect('bottom',0,135,300,65,'#006600'),poly('shield','150,62 172,100 150,138 128,100','#bb0000')]}))(),
    h('bw','ボツワナ',['#75aadb','#ffffff','#000000','#ffffff','#75aadb'],3,[75,10,30,10,75]),
    centerStar('gh','ガーナ','#006b3f','#000000',4),
    v('sn','セネガル',['#00853f','#fdef42','#e31b23'],3),
    v('cm','カメルーン',['#007a5e','#ce1126','#fcd116'],3),
    (() => ({id:'bj',name:'ベナン',level:3,ratio:[3,2],regions:[rect('left',0,0,120,200,'#008751'),rect('top',120,0,180,100,'#fcd116'),rect('bottom',120,100,180,100,'#e8112d')]}))(),
    (() => ({id:'mg',name:'マダガスカル',level:3,ratio:[3,2],regions:[rect('left',0,0,100,200,'#ffffff'),rect('tr',100,0,200,100,'#fc3d32'),rect('br',100,100,200,100,'#007e3a')]}))(),
    h('mu','モーリシャス',['#ea2839','#1a206d','#ffd500','#00a551'],3),
    (() => ({id:'sc',name:'セーシェル',level:4,ratio:[3,2],regions:[poly('blue','0,0 105,0 0,200','#003f87'),poly('yellow','105,0 205,0 0,200','#fcd856'),poly('red','205,0 300,0 300,45 0,200','#d62828'),poly('white','300,45 300,105 0,200','#ffffff'),poly('green','300,105 300,200 0,200','#007a3d')]}))(),
    centerStar('so','ソマリア','#4189dd','#ffffff',3),
    centerStar('vn','ベトナム','#da251d','#ffcd00',3),
    centerStar('cn','中国','#de2910','#ffde00',4,55,55,26,11),
    (() => { const f=circ('tr','トルコ','#e30a17','#ffffff',4,135,100,48); f.regions.push(circle('inner',150,100,38,'#e30a17')); f.regions.push(poly('star','190,76 196,92 213,92 199,102 205,119 190,109 176,119 181,102 167,92 184,92','#ffffff')); return f; })(),
    circ('tn','チュニジア','#e70013','#ffffff',4,150,100,55),
    (() => ({id:'pk',name:'パキスタン',level:4,ratio:[3,2],regions:[rect('left',0,0,70,200,'#ffffff'),rect('bg',70,0,230,200,'#01411c'),circle('moon',175,100,45,'#ffffff'),circle('cut',190,90,38,'#01411c')]}))(),
    (() => ({id:'sg',name:'シンガポール',level:4,ratio:[3,2],regions:[rect('top',0,0,300,100,'#ef3340'),rect('bottom',0,100,300,100,'#ffffff'),circle('moon',65,48,30,'#ffffff'),circle('cut',75,48,25,'#ef3340')]}))(),
    (() => { const f=h('my','マレーシア',['#cc0001','#ffffff','#cc0001','#ffffff','#cc0001','#ffffff','#cc0001','#ffffff','#cc0001','#ffffff','#cc0001','#ffffff','#cc0001'],5); f.regions.push(rect('canton',0,0,150,108,'#010066'),circle('moon',50,54,24,'#ffcc00'),circle('cut',58,54,19,'#010066')); return f; })(),
    (() => ({id:'kr',name:'韓国',level:5,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#ffffff'),circle('yin',150,100,40,'#cd2e3a'),poly('yang','110,100 190,100 150,140','#0047a0')]}))(),
    (() => ({id:'kp',name:'北朝鮮',level:5,ratio:[3,2],regions:[rect('top',0,0,300,35,'#024fa2'),rect('white1',0,35,300,10,'#ffffff'),rect('red',0,45,300,110,'#ed1c27'),rect('white2',0,155,300,10,'#ffffff'),rect('bottom',0,165,300,35,'#024fa2'),circle('disc',70,100,34,'#ffffff'),poly('star','70,70 77,91 99,91 81,104 88,125 70,112 52,125 59,104 41,91 63,91','#ed1c27')]}))(),
    (() => ({id:'au',name:'オーストラリア',level:5,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#00008b'),rect('canton',0,0,130,90,'#012169'),rect('cw',52,0,26,90,'#ffffff'),rect('ch',0,32,130,26,'#ffffff'),rect('cr',58,0,14,90,'#c8102e'),rect('chr',0,38,130,14,'#c8102e'),circle('s1',210,55,8,'#ffffff'),circle('s2',240,95,7,'#ffffff'),circle('s3',200,135,7,'#ffffff'),circle('s4',255,150,8,'#ffffff'),circle('s5',120,145,10,'#ffffff')]}))(),
    (() => ({id:'nz',name:'ニュージーランド',level:5,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#00247d'),rect('canton',0,0,130,90,'#012169'),rect('cw',52,0,26,90,'#ffffff'),rect('ch',0,32,130,26,'#ffffff'),rect('cr',58,0,14,90,'#c8102e'),rect('chr',0,38,130,14,'#c8102e'),circle('s1',215,55,9,'#cc142b'),circle('s2',250,95,9,'#cc142b'),circle('s3',205,135,9,'#cc142b'),circle('s4',258,155,9,'#cc142b')]}))(),
    (() => ({id:'ca',name:'カナダ',level:4,ratio:[3,2],regions:[rect('left',0,0,75,200,'#d80621'),rect('mid',75,0,150,200,'#ffffff'),rect('right',225,0,75,200,'#d80621'),poly('leaf','150,55 162,82 180,72 172,96 194,102 170,115 177,140 150,128 123,140 130,115 106,102 128,96 120,72 138,82','#d80621')]}))(),
    (() => { const regs=[]; for(let i=0;i<13;i++) regs.push(rect(`s${i}`,0,i*(200/13),300,200/13,i%2===0?'#b22234':'#ffffff')); regs.push(rect('canton',0,0,135,108,'#3c3b6e')); for(let r=0;r<5;r++) for(let c=0;c<6;c++) regs.push(circle(`st${r}_${c}`,15+c*21,12+r*20,3,'#ffffff')); return {id:'us',name:'アメリカ',level:5,ratio:[3,2],regions:regs}; })(),
    (() => ({id:'br',name:'ブラジル',level:5,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#009c3b'),poly('diamond','150,28 255,100 150,172 45,100','#ffdf00'),circle('globe',150,100,48,'#002776')]}))(),
    (() => ({id:'cl',name:'チリ',level:4,ratio:[3,2],regions:[rect('bottom',0,100,300,100,'#d52b1e'),rect('topRight',100,0,200,100,'#ffffff'),rect('canton',0,0,100,100,'#0039a6'),poly('star','50,24 57,45 79,45 61,58 68,79 50,66 32,79 39,58 21,45 43,45','#ffffff')]}))(),
    (() => ({id:'cu',name:'キューバ',level:4,ratio:[3,2],regions:[rect('s0',0,0,300,40,'#002a8f'),rect('s1',0,40,300,40,'#ffffff'),rect('s2',0,80,300,40,'#002a8f'),rect('s3',0,120,300,40,'#ffffff'),rect('s4',0,160,300,40,'#002a8f'),poly('tri','0,0 120,100 0,200','#cf142b'),poly('star','45,70 52,91 74,91 56,104 63,125 45,112 27,125 34,104 16,91 38,91','#ffffff')]}))(),
    (() => { const f=h('uy','ウルグアイ',['#ffffff','#0038a8','#ffffff','#0038a8','#ffffff','#0038a8','#ffffff','#0038a8','#ffffff'],4); f.regions.push(circle('sun',55,45,20,'#fcd116')); return f; })(),
    v('mx','メキシコ',['#006847','#ffffff','#ce1126'],4),
    (() => ({id:'es',name:'スペイン',level:4,ratio:[3,2],regions:[rect('top',0,0,300,50,'#aa151b'),rect('mid',0,50,300,100,'#f1bf00'),rect('bottom',0,150,300,50,'#aa151b'),circle('crest',105,100,16,'#aa151b')]}))(),
    v('pt','ポルトガル',['#046a38','#da291c'],4,[120,180]),
    h('rs','セルビア',['#c6363c','#0c4076','#ffffff'],4),
    h('hr','クロアチア',['#ff0000','#ffffff','#171796'],4),
    h('si','スロベニア',['#ffffff','#005da4','#ed1c24'],4),
    h('sk','スロバキア',['#ffffff','#0b4ea2','#ee1c25'],4),
    (() => ({id:'il',name:'イスラエル',level:4,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#ffffff'),rect('top',0,30,300,18,'#0038b8'),rect('bottom',0,152,300,18,'#0038b8'),poly('tri1','150,67 181,121 119,121','#0038b8'),poly('tri2','150,133 119,79 181,79','#0038b8')]}))(),
    (() => ({id:'jo',name:'ヨルダン',level:4,ratio:[3,2],regions:[rect('top',0,0,300,66.67,'#000000'),rect('mid',0,66.67,300,66.66,'#ffffff'),rect('bottom',0,133.33,300,66.67,'#007a3d'),poly('tri','0,0 115,100 0,200','#ce1126')]}))(),
    (() => ({id:'ae',name:'アラブ首長国連邦',level:3,ratio:[3,2],regions:[rect('left',0,0,80,200,'#ff0000'),rect('top',80,0,220,66.67,'#00732f'),rect('mid',80,66.67,220,66.66,'#ffffff'),rect('bottom',80,133.33,220,66.67,'#000000')]}))(),
    (() => ({id:'kw',name:'クウェート',level:4,ratio:[3,2],regions:[rect('top',0,0,300,66.67,'#007a3d'),rect('mid',0,66.67,300,66.66,'#ffffff'),rect('bottom',0,133.33,300,66.67,'#ce1126'),poly('trap','0,0 75,66.67 75,133.33 0,200','#000000')]}))(),
    (() => ({id:'bh',name:'バーレーン',level:4,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#ce1126'),poly('white','0,0 95,0 75,20 95,40 75,60 95,80 75,100 95,120 75,140 95,160 75,180 95,200 0,200','#ffffff')]}))(),
    (() => ({id:'qa',name:'カタール',level:4,ratio:[3,2],regions:[rect('bg',0,0,300,200,'#8a1538'),poly('white','0,0 105,0 85,12 105,24 85,36 105,48 85,60 105,72 85,84 105,96 85,108 105,120 85,132 105,144 85,156 105,168 85,180 105,192 92,200 0,200','#ffffff')]}))()
  ];

  FLAGS.find(f => f.id === 'gh').regions = [rect('top',0,0,300,66.67,'#ce1126'),rect('mid',0,66.67,300,66.66,'#fcd116'),rect('bottom',0,133.33,300,66.67,'#006b3f'),poly('star','150,72 158,96 184,96 163,111 171,136 150,121 129,136 137,111 116,96 142,96','#000000')];
  FLAGS.find(f => f.id === 'sn').regions.push(poly('star','150,72 158,96 184,96 163,111 171,136 150,121 129,136 137,111 116,96 142,96','#00853f'));
  FLAGS.find(f => f.id === 'cm').regions.push(poly('star','150,72 158,96 184,96 163,111 171,136 150,121 129,136 137,111 116,96 142,96','#fcd116'));
  FLAGS.find(f => f.id === 'ne').regions.push(circle('disc',150,100,22,'#e05206'));
  FLAGS.find(f => f.id === 'ar').regions.push(circle('sun',150,100,18,'#f6b40e'));
  FLAGS.find(f => f.id === 've').regions.push(poly('star','150,78 156,94 173,94 160,104 165,120 150,110 135,120 140,104 127,94 144,94','#ffffff'));
  FLAGS.find(f => f.id === 'ec').regions.push(circle('crest',150,100,16,'#8b4513'));

  window.FLAGS = FLAGS;
})();
