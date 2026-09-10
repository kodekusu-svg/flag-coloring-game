(() => {
  const POS = {
    jp:[83,43],kr:[80,43],cn:[75,43],tw:[79,49],mn:[72,36],ru:[70,25],ph:[80,57],vn:[74,55],th:[71,58],id:[75,70],in:[65,52],bd:[69,53],np:[67,48],la:[73,55],my:[73,64],sg:[73,66],pk:[61,48],lk:[66,63],kz:[61,36],uz:[59,41],af:[59,47],ir:[55,48],iq:[53,48],sa:[53,56],ae:[57,56],tr:[49,43],il:[50,50],jo:[51,51],sy:[50,47],eg:[49,57],za:[52,84],ke:[56,69],tz:[56,75],ng:[45,67],gh:[42,66],ci:[40,67],sn:[36,62],ma:[41,51],dz:[44,54],tn:[46,52],ly:[48,56],et:[56,64],sd:[52,62],ug:[54,68],zm:[52,76],zw:[53,79],bw:[51,80],na:[49,80],mz:[56,80],mg:[60,79],au:[86,78],nz:[94,84],pg:[87,68],fj:[95,69],pw:[83,61],fm:[89,61],us:[18,39],ca:[18,27],mx:[18,50],gt:[21,55],cu:[26,55],jm:[25,57],do:[28,56],pa:[24,61],cr:[22,59],bs:[27,52],br:[33,72],ar:[29,84],cl:[25,82],pe:[27,70],bo:[30,73],py:[31,78],uy:[33,84],co:[27,65],ve:[30,61],ec:[25,66],gb:[46,32],ie:[44,33],fr:[47,38],es:[45,43],pt:[43,43],de:[49,35],nl:[48,34],be:[48,36],it:[50,42],ch:[49,39],at:[51,38],pl:[52,34],cz:[51,36],hu:[52,39],ro:[54,39],bg:[54,42],gr:[53,45],ua:[56,35],by:[55,32],lt:[53,30],lv:[53,28],ee:[54,26],fi:[54,22],se:[51,22],no:[49,20],dk:[50,28],is:[41,21],rs:[53,41],hr:[51,41],si:[51,40],sk:[52,37],md:[55,38],ge:[58,43],am:[58,45],az:[59,44]
  };

  function makeMap(){
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 1000 500');
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label','世界地図');
    svg.classList.add('world-map-svg');
    const land=[
      'M55 105 C110 55 205 52 255 82 C286 101 300 132 279 155 C253 184 214 178 193 201 C170 228 143 242 111 221 C88 206 85 178 60 164 C38 151 36 127 55 105 Z',
      'M250 238 C291 224 329 249 333 283 C336 319 312 344 301 381 C292 414 279 467 250 462 C226 458 225 416 217 382 C208 342 190 308 204 274 C213 253 230 245 250 238 Z',
      'M412 98 C465 68 526 73 555 100 C577 120 579 145 557 158 C528 175 486 160 463 175 C443 188 428 214 401 208 C371 201 356 178 367 149 C375 128 392 110 412 98 Z',
      'M465 218 C507 203 563 216 584 249 C607 286 591 337 574 383 C559 422 530 451 492 434 C456 418 451 377 439 337 C429 303 411 266 425 240 C434 225 449 220 465 218 Z',
      'M547 96 C630 52 750 64 826 103 C872 126 913 165 904 202 C897 232 861 237 835 225 C801 210 772 215 750 239 C720 270 675 266 647 239 C626 219 604 206 575 207 C546 208 525 194 524 166 C522 136 527 108 547 96 Z',
      'M794 324 C834 301 890 310 914 342 C938 374 919 417 881 431 C843 445 796 427 778 396 C763 370 770 339 794 324 Z',
      'M924 420 C941 412 963 420 971 436 C979 453 967 468 948 469 C930 470 916 457 916 442 C916 433 919 425 924 420 Z'
    ];
    land.forEach(d=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.classList.add('map-land');svg.appendChild(p);});
    const marker=document.createElementNS(ns,'g');marker.id='countryMarker';marker.classList.add('country-marker');
    const pulse=document.createElementNS(ns,'circle');pulse.setAttribute('r','19');pulse.classList.add('map-pulse');
    const dot=document.createElementNS(ns,'circle');dot.setAttribute('r','10');dot.classList.add('map-dot');
    marker.append(pulse,dot);svg.appendChild(marker);
    return svg;
  }

  function highlight(code,name){
    const host=document.querySelector('#worldMap');
    if(!host)return;
    if(!host.querySelector('svg'))host.replaceChildren(makeMap());
    const marker=host.querySelector('#countryMarker');
    const pos=POS[code]||[50,50];
    marker.setAttribute('transform',`translate(${pos[0]*10} ${pos[1]*5})`);
    marker.classList.toggle('map-position-unknown',!POS[code]);
    const label=document.querySelector('#mapCountryName');
    if(label)label.textContent=POS[code]?`${name} は ここ！`:`${name} の ばしょを みてみよう！`;
  }
  window.FlagWorldMap={highlight};
})();
