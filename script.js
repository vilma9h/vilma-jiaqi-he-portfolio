const revealElements = document.querySelectorAll(
  'section h1, .services, section h2, section article, .statement, .lead, .based, .note'
)

revealElements.forEach((element) => {
  element.classList.add('reveal')
  const siblings = [...element.parentElement.children].filter((child) =>
    child.matches('h1, h2, article, p')
  )
  const index = Math.max(0, siblings.indexOf(element))
  element.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`)
})

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    } else {
      entry.target.classList.remove('visible')
    }
  })
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' })

let revealStarted = false
function startRevealEffects() {
  if (revealStarted) return
  revealStarted = true
  revealElements.forEach((element) => revealObserver.observe(element))
}

const splash = document.querySelector('#splash')
const splashVideo = document.querySelector('#splash-video')
const splashSkip = document.querySelector('#splash-skip')
const heroVideo = document.querySelector('#hero-video')
const contactToggle = document.querySelector('#contact-toggle')
const contactLanyard = document.querySelector('#contact-card')
const lanyardDrop = document.querySelector('.lanyard-drop')
const lanyardBadge = document.querySelector('.lanyard-badge')
const lanyardPayload = document.querySelector('.lanyard-payload')
const lanyardPaths = document.querySelectorAll('.lanyard-strap path')
const strapTextureGroup = document.querySelector('.strap-texture-segments')
const SVG_NS = 'http://www.w3.org/2000/svg'
const STRAP_SEGMENT_COUNT = 20
const strapTextureSegments = []

for (let index = 0; index < STRAP_SEGMENT_COUNT; index += 1) {
  const segment = document.createElementNS(SVG_NS, 'svg')
  const sourceY = index * (1536 / STRAP_SEGMENT_COUNT)
  const sourceHeight = 1536 / STRAP_SEGMENT_COUNT
  segment.setAttribute('x', '-21')
  segment.setAttribute('y', '-9.2')
  segment.setAttribute('width', '42')
  segment.setAttribute('height', '18.4')
  segment.setAttribute('viewBox', `0 ${sourceY} 272 ${sourceHeight}`)
  segment.setAttribute('preserveAspectRatio', 'none')
  segment.classList.add('strap-texture-segment')

  const image = document.createElementNS(SVG_NS, 'image')
  image.setAttribute('href', 'assets/lanyard-strap.webp')
  image.setAttribute('x', '0')
  image.setAttribute('y', '0')
  image.setAttribute('width', '272')
  image.setAttribute('height', '1536')
  image.setAttribute('preserveAspectRatio', 'none')
  segment.appendChild(image)
  strapTextureGroup.appendChild(segment)
  strapTextureSegments.push(segment)
}

const skipSplash = new URLSearchParams(location.search).get('skipSplash') === '1'
const forceFreshEntry = window.__vilmaFreshEntry === true || new URLSearchParams(location.search).get('freshEntry') === '1'
const navigationEntry = performance.getEntriesByType('navigation')[0]
const isPageReload = navigationEntry?.type === 'reload'
let storedSplashSeen = false
try { storedSplashSeen = sessionStorage.getItem('vilma-splash-seen-v2') === '1' } catch (_) {}
const splashSeen = skipSplash || (!forceFreshEntry && !isPageReload && storedSplashSeen)
let heroLoadStarted = false
let heroReady = false
let heroObjectUrl = ''
async function loadHeroVideo() {
  if (heroLoadStarted) return
  heroLoadStarted = true
  const source = heroVideo.dataset.src
  if (!source) return
  try {
    const response = await fetch(source, { cache: 'force-cache' })
    if (!response.ok) throw new Error(`Hero video request failed: ${response.status}`)
    const blob = await response.blob()
    heroObjectUrl = URL.createObjectURL(blob)
    heroVideo.src = heroObjectUrl
    heroVideo.load()
  } catch (_) {
    heroVideo.src = source
    heroVideo.load()
  }
}
loadHeroVideo()
window.addEventListener('pagehide', () => {
  if (heroObjectUrl) URL.revokeObjectURL(heroObjectUrl)
}, { once: true })
if (skipSplash) history.replaceState(null, '', location.pathname + (location.hash || '#home'))
if (!splashSeen) document.documentElement.classList.add('splash-active')
else {
  splash.hidden = true
  loadHeroVideo()
  startRevealEffects()
}

let splashClosed = false
function closeSplash() {
  if (splashClosed) return
  splashClosed = true
  try { sessionStorage.setItem('vilma-splash-seen-v2', '1') } catch (_) {}
  history.replaceState(null, '', '#home')
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  heroTargetTime = 0
  heroDisplayedTime = 0
  heroVideo.pause()
  if (heroVideo.readyState >= 1) heroVideo.currentTime = 0
  splash.classList.add('is-leaving')
  document.documentElement.classList.remove('splash-active')
  startRevealEffects()
  requestAnimationFrame(() => {
    scrollToSection('#home')
    updateActiveNavigation()
  })
  window.setTimeout(() => {
    splash.hidden = true
    splashVideo.pause()
    splashVideo.removeAttribute('src')
    splashVideo.load()
    loadHeroVideo()
  }, 700)
}

if (!splashSeen) {
  splashVideo.addEventListener('ended', closeSplash, { once: true })
  splashVideo.addEventListener('error', closeSplash, { once: true })
  splashSkip.addEventListener('click', closeSplash)
  splashVideo.play().catch(() => {
    splashSkip.textContent = 'ENTER'
  })
} else {
  splashVideo.pause()
}

window.setTimeout(startRevealEffects, 8000)

function setContactOpen(open) {
  stopLanyardPhysics()
  lanyardAngle = 0
  lanyardVelocity = 0
  lanyardStretch = 0
  lanyardStretchVelocity = 0
  setLanyardAngle(0)
  contactLanyard.classList.toggle('open', open)
  lanyardDrop.classList.toggle('dropping', open)
  if (open) {
    window.setTimeout(() => lanyardDrop.classList.remove('dropping'), 1200)
    window.setTimeout(() => {
      if (!contactLanyard.classList.contains('open') || lanyardDragging) return
      setLanyardAngle(9)
      lanyardVelocity = -2.4
      lanyardStretch = 20
      lanyardStretchVelocity = -3.2
      lanyardPhysicsFrame = requestAnimationFrame(animateLanyardPhysics)
    }, 620)
  }
  contactLanyard.setAttribute('aria-hidden', String(!open))
  contactToggle.setAttribute('aria-expanded', String(open))
  contactToggle.classList.toggle('active', open)
}

contactToggle.addEventListener('click', (event) => {
  event.preventDefault()
  setContactOpen(!contactLanyard.classList.contains('open'))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setContactOpen(false)
})

lanyardBadge.addEventListener('pointermove', (event) => {
  const rect = lanyardBadge.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - .5
  const y = (event.clientY - rect.top) / rect.height - .5
  lanyardBadge.style.setProperty('--badge-rotate-x', `${-y * 9}deg`)
  lanyardBadge.style.setProperty('--badge-rotate-y', `${x * 11}deg`)
})

lanyardBadge.addEventListener('pointerleave', () => {
  if (lanyardDragging) return
  lanyardBadge.style.setProperty('--badge-rotate-x', '0deg')
  lanyardBadge.style.setProperty('--badge-rotate-y', '0deg')
})

let lanyardDragging = false
let lanyardAngle = 0
let lanyardVelocity = 0
let lanyardLastAngle = 0
let lanyardLastMoveTime = 0
let lanyardPhysicsFrame = 0
let lanyardStretch = 0
let lanyardStretchVelocity = 0
let lanyardDragStartDistance = 0
let lanyardLastStretch = 0

function stopLanyardPhysics() {
  if (lanyardPhysicsFrame) cancelAnimationFrame(lanyardPhysicsFrame)
  lanyardPhysicsFrame = 0
}

function setLanyardAngle(angle) {
  lanyardAngle = Math.max(-42, Math.min(42, angle))
  const radians = lanyardAngle * Math.PI / 180
  const ropeLength = 315 + lanyardStretch
  const endX = 180 + Math.sin(radians) * ropeLength
  const endY = Math.cos(radians) * ropeLength
  const flex = Math.max(-58, Math.min(58, lanyardVelocity * 5.5))
  const controlX = 180 + (endX - 180) * .36 - flex
  const controlY = 126 - Math.min(24, Math.abs(lanyardVelocity) * 2)
  const path = `M180 -10 Q${controlX.toFixed(2)} ${controlY.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`
  lanyardPaths.forEach((item) => item.setAttribute('d', path))

  strapTextureSegments.forEach((segment, index) => {
    const t = (index + .5) / STRAP_SEGMENT_COUNT
    const inverse = 1 - t
    const x = inverse * inverse * 180 + 2 * inverse * t * controlX + t * t * endX
    const y = inverse * inverse * -10 + 2 * inverse * t * controlY + t * t * endY
    const tangentX = 2 * inverse * (controlX - 180) + 2 * t * (endX - controlX)
    const tangentY = 2 * inverse * (controlY + 10) + 2 * t * (endY - controlY)
    const tangentAngle = -Math.atan2(tangentX, tangentY) * 180 / Math.PI
    segment.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${tangentAngle.toFixed(2)})`)
  })
  lanyardPayload.style.transform = `translate(${endX - 180}px, ${endY - 315}px) rotate(${lanyardAngle}deg)`
}

function angleFromPointer(event) {
  const anchorX = window.innerWidth * .76
  const anchorY = 0
  return Math.atan2(event.clientX - anchorX, event.clientY - anchorY) * 180 / Math.PI
}

function distanceFromPointer(event) {
  const anchorX = window.innerWidth * .76
  return Math.hypot(event.clientX - anchorX, event.clientY)
}

function animateLanyardPhysics() {
  const gravity = -Math.sin(lanyardAngle * Math.PI / 180) * 1.35
  lanyardVelocity = (lanyardVelocity + gravity) * .965
  lanyardStretchVelocity = (lanyardStretchVelocity - lanyardStretch * .085) * .89
  lanyardStretch += lanyardStretchVelocity
  setLanyardAngle(lanyardAngle + lanyardVelocity)

  if (Math.abs(lanyardAngle) < .04 && Math.abs(lanyardVelocity) < .04 && Math.abs(lanyardStretch) < .08 && Math.abs(lanyardStretchVelocity) < .05) {
    setLanyardAngle(0)
    lanyardVelocity = 0
    lanyardStretch = 0
    lanyardStretchVelocity = 0
    lanyardPhysicsFrame = 0
    return
  }
  lanyardPhysicsFrame = requestAnimationFrame(animateLanyardPhysics)
}

lanyardBadge.addEventListener('pointerdown', (event) => {
  if (!contactLanyard.classList.contains('open')) return
  event.preventDefault()
  stopLanyardPhysics()
  lanyardDragging = true
  lanyardDrop.classList.remove('dropping')
  lanyardDrop.classList.add('dragging')
  lanyardBadge.setPointerCapture(event.pointerId)
  lanyardLastMoveTime = performance.now()
  lanyardLastAngle = angleFromPointer(event)
  lanyardDragStartDistance = distanceFromPointer(event)
  lanyardLastStretch = lanyardStretch
  lanyardVelocity = 0
  lanyardStretchVelocity = 0
})

lanyardBadge.addEventListener('pointermove', (event) => {
  if (!lanyardDragging) return
  if (event.buttons === 0) {
    releaseLanyard(event)
    return
  }
  const now = performance.now()
  const nextAngle = Math.max(-42, Math.min(42, angleFromPointer(event)))
  const elapsedFrames = Math.max(1, (now - lanyardLastMoveTime) / 16.67)
  lanyardVelocity = (nextAngle - lanyardLastAngle) / elapsedFrames
  const nextStretch = Math.max(-24, Math.min(105, (distanceFromPointer(event) - lanyardDragStartDistance) * .72))
  lanyardStretchVelocity = (nextStretch - lanyardLastStretch) / elapsedFrames
  lanyardLastAngle = nextAngle
  lanyardLastStretch = nextStretch
  lanyardStretch = nextStretch
  lanyardLastMoveTime = now
  setLanyardAngle(nextAngle)
})

function releaseLanyard(event) {
  if (!lanyardDragging) return
  lanyardDragging = false
  lanyardDrop.classList.remove('dragging')
  if (lanyardBadge.hasPointerCapture(event.pointerId)) {
    lanyardBadge.releasePointerCapture(event.pointerId)
  }
  lanyardBadge.style.setProperty('--badge-rotate-x', '0deg')
  lanyardBadge.style.setProperty('--badge-rotate-y', '0deg')
  lanyardPhysicsFrame = requestAnimationFrame(animateLanyardPhysics)
}

lanyardBadge.addEventListener('pointerup', releaseLanyard)
lanyardBadge.addEventListener('pointercancel', releaseLanyard)
lanyardBadge.addEventListener('lostpointercapture', releaseLanyard)
window.addEventListener('pointerup', releaseLanyard)
window.addEventListener('pointercancel', releaseLanyard)

let heroTargetTime = 0
let heroDisplayedTime = 0
let heroAnimationFrame = 0
const navToneCanvas = document.createElement('canvas')
navToneCanvas.width = 12
navToneCanvas.height = 2
const navToneContext = navToneCanvas.getContext('2d', { willReadFrequently: true })

function updateHomeNavTone() {
  const nav = document.querySelector('.nav')
  if (!nav || heroVideo.readyState < 2 || !navToneContext) return
  try {
    navToneContext.drawImage(heroVideo, 0, 0, heroVideo.videoWidth, Math.max(1, heroVideo.videoHeight * .1), 0, 0, 12, 2)
    const pixels = navToneContext.getImageData(0, 0, 12, 2).data
    let luminance = 0
    for (let index = 0; index < pixels.length; index += 4) {
      luminance += pixels[index] * .2126 + pixels[index + 1] * .7152 + pixels[index + 2] * .0722
    }
    const useWhite = luminance / (pixels.length / 4) < 142
    nav.classList.toggle('nav-dark', useWhite)
    nav.classList.toggle('nav-light', !useWhite)
  } catch (_) {
    nav.classList.add('nav-dark')
    nav.classList.remove('nav-light')
  }
}

function calculateHeroTarget() {
  if (!heroVideo.duration || !Number.isFinite(heroVideo.duration)) return 0
  const works = document.querySelector('#works')
  const scale = window.innerWidth / 1728
  const worksTop = Math.max(1, works.offsetTop * scale)
  const progress = Math.min(1, Math.max(0, window.scrollY / worksTop))
  return progress * Math.max(0, heroVideo.duration - .04)
}

function renderHeroScrollFrame() {
  if (!heroReady) {
    heroAnimationFrame = 0
    return
  }
  const difference = heroTargetTime - heroDisplayedTime
  heroDisplayedTime += difference * .16

  if (!heroVideo.seeking && Math.abs(heroVideo.currentTime - heroDisplayedTime) > .025) {
    heroVideo.currentTime = heroDisplayedTime
  }
  updateHomeNavTone()

  if (Math.abs(difference) > .012) {
    heroAnimationFrame = requestAnimationFrame(renderHeroScrollFrame)
  } else {
    heroDisplayedTime = heroTargetTime
    if (!heroVideo.seeking) heroVideo.currentTime = heroTargetTime
    heroAnimationFrame = 0
  }
}

function scrubHeroVideo() {
  if (!heroReady) return
  heroTargetTime = calculateHeroTarget()
  if (!heroAnimationFrame) {
    heroAnimationFrame = requestAnimationFrame(renderHeroScrollFrame)
  }
}

heroVideo.addEventListener('loadedmetadata', () => {
  heroReady = true
  heroVideo.pause()
  heroTargetTime = calculateHeroTarget()
  heroDisplayedTime = heroTargetTime
  heroVideo.currentTime = heroTargetTime
  updateHomeNavTone()
})
heroVideo.addEventListener('seeked', () => {
  updateHomeNavTone()
  if (Math.abs(heroTargetTime - heroDisplayedTime) > .012 && !heroAnimationFrame) {
    heroAnimationFrame = requestAnimationFrame(renderHeroScrollFrame)
  }
})
window.addEventListener('scroll', scrubHeroVideo, { passive: true })

const DESIGN_WIDTH = 1728

const sectionToNavHash = {
  about: '#about',
  'about-details': '#about',
  experience: '#experience',
  'experience-details': '#experience',
  works: '#works',
  playground: '#playground'
}

function updateActiveNavigation() {
  const scale = window.innerWidth / DESIGN_WIDTH
  const probe = window.scrollY + window.innerHeight * .35
  let currentSection = 'home'

  document.querySelectorAll('main > section[id]').forEach((section) => {
    if (section.offsetTop * scale <= probe) currentSection = section.id
  })

  const activeHash = sectionToNavHash[currentSection] || '#home'
  document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
    if (link === contactToggle) return
    const isActive = link.getAttribute('href') === activeHash
    link.classList.toggle('active', isActive)
    if (isActive) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
}

function scaleSiteToViewport() {
  const scale = window.innerWidth / DESIGN_WIDTH
  document.body.style.zoom = String(scale)
  const visibleHeightInDesignPixels = window.innerHeight / scale
  document.documentElement.style.setProperty(
    '--scaled-viewport-height',
    `${visibleHeightInDesignPixels}px`
  )
  const originalBottom = 134
  const safeViewportInset = 40
  const adaptiveBottom = Math.max(
    originalBottom,
    1117 - visibleHeightInDesignPixels + safeViewportInset
  )
  document.documentElement.style.setProperty(
    '--hero-title-bottom',
    `${adaptiveBottom}px`
  )
  return scale
}

scaleSiteToViewport()
updateActiveNavigation()

function scrollToSection(hash, smooth = false) {
  const targetHash = hash || '#home'
  const target = document.querySelector(targetHash)
  if (!target) return

  const scale = window.innerWidth / DESIGN_WIDTH
  const targetTop = target.offsetTop * scale
  const scrollTop = target.id === 'home' ? 0 : targetTop

  window.scrollTo({
    top: Math.max(0, scrollTop),
    behavior: smooth ? 'smooth' : 'auto'
  })
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href')
    if (hash === '#contact-card') return
    if (!hash || !document.querySelector(hash)) return
    event.preventDefault()
    history.pushState(null, '', hash)
    document.querySelectorAll('.nav a').forEach((item) => item.classList.remove('active'))
    link.classList.add('active')
    scrollToSection(hash, true)
  })
})

window.addEventListener('popstate', () => {
  scrollToSection(location.hash)
  updateActiveNavigation()
})
window.addEventListener('scroll', updateActiveNavigation, { passive: true })
window.addEventListener('resize', () => {
  scaleSiteToViewport()
  scrollToSection(location.hash)
  scrubHeroVideo()
  updateActiveNavigation()
}, { passive: true })

requestAnimationFrame(() => scrollToSection(location.hash))
