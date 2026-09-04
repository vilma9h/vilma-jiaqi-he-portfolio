(() => {
  const tiles = [...document.querySelectorAll('.playground-grid .tile')]

  tiles.forEach((tile, index) => {
    tile.classList.add('playground-reveal')
    tile.style.setProperty('--playground-delay', `${index % 3 * 90}ms`)
  })

  const loadAndPlay = (video) => {
    const source = video.dataset.src
    if (source) {
      video.src = source
      delete video.dataset.src
      video.load()
    }
    video.play().catch(() => {})
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const tile = entry.target
        tile.classList.toggle('visible', entry.isIntersecting)
        if (tile.tagName !== 'VIDEO') return
        if (entry.isIntersecting) loadAndPlay(tile)
        else tile.pause()
      })
    }, { threshold: .08, rootMargin: '300px 0px 300px 0px' })

    tiles.forEach((tile) => observer.observe(tile))
  } else {
    tiles.forEach((tile) => {
      tile.classList.add('visible')
      if (tile.tagName === 'VIDEO') loadAndPlay(tile)
    })
  }
})()
