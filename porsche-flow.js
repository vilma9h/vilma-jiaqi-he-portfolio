(() => {
  const GAP = 120;

  function updateVisionFlow() {
    const section = document.querySelector('.p-section.vision');
    if (!section) return;

    const copy = section.querySelector('.section-copy');
    const quote = section.querySelector('blockquote');
    const heading = section.querySelector('.modes-heading');
    const modes = section.querySelector('.modes');
    if (!copy || !quote || !heading || !modes) return;

    if (window.innerWidth <= 900) {
      section.style.removeProperty('height');
      quote.style.removeProperty('top');
      heading.style.removeProperty('top');
      modes.style.removeProperty('top');
      return;
    }

    quote.style.top = `${copy.offsetTop + copy.offsetHeight + GAP}px`;
    heading.style.top = `${quote.offsetTop + quote.offsetHeight + GAP}px`;
    modes.style.top = `${heading.offsetTop + heading.offsetHeight + GAP}px`;
    section.style.height = `${modes.offsetTop + modes.offsetHeight + GAP}px`;
  }

  function scheduleUpdate() {
    requestAnimationFrame(() => requestAnimationFrame(updateVisionFlow));
  }

  window.addEventListener('load', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);
  document.addEventListener('DOMContentLoaded', scheduleUpdate);

  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleUpdate);
  }

  new MutationObserver(scheduleUpdate).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
})();
