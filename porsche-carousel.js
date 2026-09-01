(() => {
  const carousel = document.querySelector('.modes-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.modes-carousel-track');
  const slides = [...track.children];
  const status = carousel.querySelector('.modes-carousel-status');
  const previous = carousel.querySelector('.previous');
  const next = carousel.querySelector('.next');
  let index = 0;
  let timer;

  const render = () => {
    track.style.transform = `translate3d(${-index * carousel.querySelector('.modes-carousel-viewport').clientWidth}px,0,0)`;
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

  previous.addEventListener('click', () => { move(-1); start(); });
  next.addEventListener('click', () => { move(1); start(); });
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', () => clearInterval(timer));
  carousel.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());
  window.addEventListener('resize', render, { passive: true });
  render();
  start();
})();
