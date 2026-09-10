(() => {
  const list = window.FLAGS || [];
  const has = id => list.some(f => f.id === id);
  const R = (id,type,attrs,color) => ({id,type,...attrs,color});
  const rect = (id,x,y,width,height,color) => R(id,'rect',{x,y,width,height},color);
  const circle = (id,cx,cy,r,color) => R(id,'circle',{cx,cy,r},color);
  const poly = (id,points,color) => R(id,'polygon',{points},color);
  const path = (id,d,color,transform=null) => R(id,'path',transform ? {d,transform} : {d},color);
  const starPoints = (cx,cy,outer,inner,points=5) => {
    const out=[];
    for(let i=0;i<points*2;i++){
      const a=-Math.PI/2+i*Math.PI/points;
      const r=i%2===0?outer:inner;
      out.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`);
    }
    return out.join(' ');
  };

  // Taegeukgi geometry is based on the current South Korean flag SVG.
  // Coordinate conversion: official-style source viewBox (-72 -48 144 96) -> game viewBox (0 0 300 200).
  const krScale = 'translate(150 100) scale(2.0833333333) rotate(33.69006752598)';
  const fullBar = cx => `M${cx-4.1667} 75h8.3334v50h-8.3334z`;
  const brokenBar = cx => `M${cx-4.1667} 75h8.3334v22.9167h-8.3334z M${cx-4.1667} 102.0833h8.3334V125h-8.3334z`;
  const trigramPath = (centers, broken) => centers.map((cx,i) => broken[i] ? brokenBar(cx) : fullBar(cx)).join(' ');

  const koreanFlag = {id:'kr',name:'かんこく',level:5,ratio:[3,2],regions:[
    rect('bg',0,0,300,200,'#ffffff'),
    path('taegeukRed','M12 0a18 18 0 11-36 0 24 24 0 1148 0','#cd2e3a',krScale),
    path('taegeukBlue','M0 0a12 12 0 1124 0 24 24 0 11-48 0 12 12 0 1024 0','#0047a0',krScale),
    path('geon',trigramPath([45.8333,58.3333,70.8333],[false,false,false]),'#000000','rotate(33.69006752598 150 100)'),
    path('gon',trigramPath([229.1667,241.6667,254.1667],[true,true,true]),'#000000','rotate(33.69006752598 150 100)'),
    path('gam',trigramPath([45.8333,58.3333,70.8333],[false,true,false]),'#000000','rotate(-33.69006752598 150 100)'),
    path('ri',trigramPath([229.1667,241.6667,254.1667],[true,false,true]),'#000000','rotate(-33.69006752598 150 100)')
  ]};

  const additions = [
    koreanFlag,
    {id:'cn',name:'ちゅうごく',level:3,ratio:[3,2],regions:[
      rect('bg',0,0,300,200,'#de2910'),poly('big',starPoints(62,58,27,11),'#ffde00'),
      poly('s1',starPoints(105,32,10,4),'#ffde00'),poly('s2',starPoints(122,54,10,4),'#ffde00'),poly('s3',starPoints(121,82,10,4),'#ffde00'),poly('s4',starPoints(101,101,10,4),'#ffde00')
    ]},
    {id:'tw',name:'たいわん',level:4,ratio:[3,2],regions:[
      rect('bg',0,0,300,200,'#fe0000'),rect('canton',0,0,150,100,'#000095'),circle('sun',75,50,27,'#ffffff'),circle('hub',75,50,11,'#000095')
    ]},
    {id:'mn',name:'モンゴル',level:3,ratio:[3,2],regions:[
      rect('l',0,0,100,200,'#c4272f'),rect('m',100,0,100,200,'#015197'),rect('r',200,0,100,200,'#c4272f'),
      circle('sun',48,62,13,'#f9cf02'),rect('mark',38,84,20,60,'#f9cf02')
    ]},
    {id:'vn',name:'ベトナム',level:3,ratio:[3,2],regions:[
      rect('bg',0,0,300,200,'#da251d'),poly('star',starPoints(150,100,42,17),'#ff0')
    ]}
  ];

  additions.forEach(flag => {
    const index = list.findIndex(f => f.id === flag.id);
    if(index >= 0) list[index] = flag;
    else list.push(flag);
  });
  window.FLAGS = list;
})();
