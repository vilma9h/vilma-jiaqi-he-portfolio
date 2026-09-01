(() => {
  const navigationEntry = performance.getEntriesByType('navigation')[0]
  const isReload = navigationEntry
    ? navigationEntry.type === 'reload'
    : performance.navigation?.type === 1
  const pageName = location.pathname.split('/').pop() || 'index.html'
  const isHomePage = pageName === 'index.html'

  if (isReload && !isHomePage) {
    location.replace('index.html?freshEntry=1#home')
    return
  }

  const params = new URLSearchParams(location.search)
  const freshEntry = isReload || params.get('freshEntry') === '1'
  if (!isHomePage || !freshEntry) return

  window.__vilmaFreshEntry = true
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  history.replaceState(null, '', `${location.pathname}?freshEntry=1#home`)

  const resetToHome = () => window.scrollTo(0, 0)
  resetToHome()
  document.addEventListener('DOMContentLoaded', resetToHome, { once: true })
  window.addEventListener('pageshow', resetToHome, { once: true })
})()
