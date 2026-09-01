(() => {
  const carousel = document.querySelector('.digital-carousel');
  if (!carousel) return;
  const viewport = carousel.querySelector('.digital-carousel-viewport');
  const track = carousel.querySelector('.digital-carousel-track');
  const slides = [...track.children];
  const status = carousel.querySelector('.digital-carousel-status');
  let index = 0;
  let timer;
  const render = () => {
    track.style.transform = `translate3d(${-index * viewport.clientWidth}px,0,0)`;
    status.textContent = `${index + 1} / ${slides.length}`;
  };
  const move = (direction) => {
    index = (index + direction + slides.length) % slides.length;
    render();
  };
  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => move(1), 3000);
  };
  carousel.querySelector('.previous').addEventListener('click', () => { move(-1); start(); });
  carousel.querySelector('.next').addEventListener('click', () => { move(1); start(); });
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', () => clearInterval(timer));
  carousel.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());
  window.addEventListener('resize', render, { passive: true });
  render();
  start();
})();
