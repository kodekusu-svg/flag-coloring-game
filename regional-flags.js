(() => {
  const list = window.FLAGS || [];
  const has = id => list.some(f => f.id === id);
  const R = (id,type,attrs,color) => ({id,type,...attrs,color});
  const rect = (id,x,y,width,height,color) => R(id,'rect',{x,y,width,height},color);
  const circle = (id,cx,cy,r,color) => R(id,'circle',{cx,cy,r},color);
  const poly = (id,points,color) => R(id,'polygon',{points},color);
  const starPoints = (cx,cy,outer,inner,points=5) => {
    const out=[];
    for(let i=0;i<points*2;i++){
      const a=-Math.PI/2+i*Math.PI/points;
      const r=i%2===0?outer:inner;
      out.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`);
    }
    return out.join(' ');
  };
  const additions = [
    {id:'kr',name:'かんこく',level:4,ratio:[3,2],regions:[
      rect('bg',0,0,300,200,'#ffffff'),circle('red',150,90,36,'#cd2e3a'),
      R('blue','path',{d:'M 114 90 A 36 36 0 0 0 186 90 A 18 18 0 0 1 150 90 A 18 18 0 0 0 114 90 Z'},'#0047a0'),
      rect('b1',55,40,44,9,'#000000'),rect('b2',55,55,44,9,'#000000'),rect('b3',55,70,44,9,'#000000'),
      rect('b4',201,121,44,9,'#000000'),rect('b5',201,136,44,9,'#000000'),rect('b6',201,151,44,9,'#000000')
    ]},
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
  additions.forEach(flag => { if(!has(flag.id)) list.push(flag); });
  window.FLAGS = list;
})();
