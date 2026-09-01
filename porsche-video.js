(() => {
  const videos = [...document.querySelectorAll('.key-feature-video')];
  videos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, { once: true });
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) play();
    }, { threshold: .08 }).observe(video);
  });
})();
