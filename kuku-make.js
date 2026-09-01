(() => {
  const DESIGN_WIDTH = 1728;
  const scalePage = () => {
    if (window.innerWidth <= 900) {
      document.body.style.zoom = '1';
      document.body.style.width = '100%';
      document.documentElement.style.setProperty('--scaled-viewport-height', `${window.innerHeight}px`);
      return;
    }
    const scale = window.innerWidth / DESIGN_WIDTH;
    document.body.style.width = `${DESIGN_WIDTH}px`;
    document.body.style.zoom = String(scale);
    document.documentElement.style.setProperty('--scaled-viewport-height', `${window.innerHeight / scale}px`);
  };
  scalePage();
  window.addEventListener('resize', scalePage, { passive: true });

  const nav = document.querySelector('.project-nav');
  const imageTones = new WeakMap();

  const measureImageTone = (image) => {
    if (!image.complete || !image.naturalWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, 12, 12);
    const pixels = context.getImageData(0, 0, 12, 12).data;
    let total = 0;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 32) continue;
      total += .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
      count += 1;
    }
    imageTones.set(image, count ? total / count : 230);
  };

  document.querySelectorAll('main img').forEach((image) => {
    if (image.complete) measureImageTone(image);
    else image.addEventListener('load', () => measureImageTone(image), { once: true });
  });

  const updateNavTone = () => {
    if (!nav) return;
    nav.style.pointerEvents = 'none';
    const samples = [window.innerWidth * .08, window.innerWidth * .5, window.innerWidth * .92]
      .map((x) => document.elementsFromPoint(x, Math.min(50, window.innerHeight * .06))
        .find((element) => !element.closest('.project-nav') && !element.closest('.contact-lanyard')));
    nav.style.pointerEvents = '';
    const luminances = samples.map((element) => {
      if (!element) return 235;
      const image = element.matches('img') ? element : element.closest('figure')?.querySelector('img');
      return image && imageTones.has(image) ? imageTones.get(image) : 235;
    });
    const dark = luminances.reduce((sum, value) => sum + value, 0) / luminances.length < 125;
    nav.classList.toggle('nav-dark', dark);
    nav.classList.toggle('nav-light', !dark);
  };

  updateNavTone();
  window.addEventListener('scroll', updateNavTone, { passive: true });
  window.addEventListener('resize', updateNavTone, { passive: true });

  const revealItems = [...document.querySelectorAll(
    '.cover-image, .project-title, .project-meta, .project-summary, .project-page h2, .section-copy, .mission-grid figure, .feature-image, .type-carousel, .prototype-row img, .poster-row img, .box-row img, .room-row > *, .interior-crop'
  )];
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 90, 270)}ms`);
  });
  const projectRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: .1, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => projectRevealObserver.observe(item));

  const carousel = document.querySelector('.type-carousel');
  if (carousel) {
    const viewport = carousel.querySelector('.type-carousel-viewport');
    const track = carousel.querySelector('.type-carousel-track');
    const slides = [...track.querySelectorAll('img')];
    const status = carousel.querySelector('.type-carousel-status');
    let slideIndex = 0;

    const showSlide = (nextIndex) => {
      slideIndex = (nextIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${slideIndex * viewport.clientWidth}px)`;
      status.textContent = `${slideIndex + 1} / ${slides.length}`;
    };

    carousel.querySelector('.previous').addEventListener('click', () => showSlide(slideIndex - 1));
    carousel.querySelector('.next').addEventListener('click', () => showSlide(slideIndex + 1));
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showSlide(slideIndex - 1);
      if (event.key === 'ArrowRight') showSlide(slideIndex + 1);
    });
    window.addEventListener('resize', () => showSlide(slideIndex), { passive: true });
    showSlide(0);
  }

  const websiteVideo = document.querySelector('.website-video');
  if (websiteVideo) {
    websiteVideo.muted = true;
    websiteVideo.loop = true;
    const startWebsiteVideo = () => websiteVideo.play().catch(() => {});
    if (websiteVideo.readyState >= 2) startWebsiteVideo();
    else websiteVideo.addEventListener('canplay', startWebsiteVideo, { once: true });
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) startWebsiteVideo();
    }, { threshold: .08 }).observe(websiteVideo);
  }
})();
