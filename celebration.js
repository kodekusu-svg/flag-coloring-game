(() => {
  const palette = ['#ff5f6d','#ffc371','#4ecdc4','#5c7cfa','#b197fc','#69db7c','#ffd43b','#f06595'];

  window.celebrate = function celebrateBurst() {
    const layer = document.querySelector('#celebration');
    if (!layer) return;
    layer.innerHTML = '';

    const launchSide = (side) => {
      const fromLeft = side === 'left';
      const originX = fromLeft ? window.innerWidth * 0.08 : window.innerWidth * 0.92;
      const originY = window.innerHeight * 0.88;

      for (let i = 0; i < 48; i++) {
        const piece = document.createElement('i');
        piece.className = 'confetti';
        piece.style.position = 'fixed';
        piece.style.left = `${originX}px`;
        piece.style.top = `${originY}px`;
        piece.style.width = `${8 + Math.random() * 9}px`;
        piece.style.height = `${14 + Math.random() * 15}px`;
        piece.style.borderRadius = '3px';
        piece.style.background = palette[i % palette.length];
        piece.style.pointerEvents = 'none';
        layer.appendChild(piece);

        const angleDeg = fromLeft
          ? (-72 + Math.random() * 44)
          : (-152 + Math.random() * 44);
        const angle = angleDeg * Math.PI / 180;
        const power = 340 + Math.random() * 380;
        const dx = Math.cos(angle) * power;
        const dy = Math.sin(angle) * power;
        const fall = 220 + Math.random() * 260;
        const spin = (Math.random() < 0.5 ? -1 : 1) * (540 + Math.random() * 900);
        const duration = 1250 + Math.random() * 650;
        const delay = Math.random() * 120;

        piece.animate([
          {
            transform: 'translate(0, 0) rotate(0deg) scale(.7)',
            opacity: 1
          },
          {
            transform: `translate(${dx * 0.72}px, ${dy}px) rotate(${spin * 0.55}deg) scale(1)`,
            opacity: 1,
            offset: 0.58
          },
          {
            transform: `translate(${dx}px, ${dy + fall}px) rotate(${spin}deg) scale(.92)`,
            opacity: 0
          }
        ], {
          duration,
          delay,
          easing: 'cubic-bezier(.16,.72,.28,1)',
          fill: 'forwards'
        }).addEventListener('finish', () => piece.remove(), { once: true });
      }
    };

    launchSide('left');
    launchSide('right');

    setTimeout(() => { layer.innerHTML = ''; }, 2300);
  };
})();
