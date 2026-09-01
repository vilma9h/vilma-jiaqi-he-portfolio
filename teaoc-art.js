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
    for (let i = 0; i < pixels.length; i += 4) total += .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
    imageTones.set(image, total / (pixels.length / 4));
  };
  document.querySelectorAll('main img').forEach((image) => image.complete ? measureImageTone(image) : image.addEventListener('load', () => measureImageTone(image), { once: true }));
  const updateNavTone = () => {
    nav.style.pointerEvents = 'none';
    const samples = [innerWidth * .08, innerWidth * .5, innerWidth * .92].map((x) => document.elementsFromPoint(x, Math.min(50, innerHeight * .06)).find((element) => !element.closest('.project-nav') && !element.closest('.contact-lanyard')));
    nav.style.pointerEvents = '';
    const values = samples.map((element) => {
      const image = element?.matches('img') ? element : element?.querySelector?.('img');
      return image && imageTones.has(image) ? imageTones.get(image) : 245;
    });
    const dark = values.reduce((sum, value) => sum + value, 0) / values.length < 135;
    nav.classList.toggle('nav-dark', dark);
    nav.classList.toggle('nav-light', !dark);
  };
  updateNavTone();
  addEventListener('scroll', updateNavTone, { passive: true });
  addEventListener('resize', updateNavTone, { passive: true });

  const revealItems = [...document.querySelectorAll('.project-title,.project-meta,.project-summary,.teaoc-section h2,.section-copy,.role-grid article,img.website-composition,.website-devices img,.gallery-grid img,.social-top>*,.social-bottom img,.email-composition')];
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${Math.min((index % 4) * 80, 240)}ms`);
  });
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting)), { threshold: .1, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => observer.observe(item));

  const websiteVideo = document.querySelector('.website-video');
  if (websiteVideo) {
    websiteVideo.muted = true;
    websiteVideo.loop = true;
    const playWebsiteVideo = () => websiteVideo.play().catch(() => {});
    if (websiteVideo.readyState >= 2) playWebsiteVideo();
    else websiteVideo.addEventListener('canplay', playWebsiteVideo, { once: true });
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) playWebsiteVideo();
    }, { threshold: .08 }).observe(websiteVideo);
  }
})();
