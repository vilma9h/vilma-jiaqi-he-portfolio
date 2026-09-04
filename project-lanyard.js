(() => {
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

const deferredVideos = document.querySelectorAll('video.deferred-video[data-src]')
const loadDeferredVideo = (video) => {
  if (video.dataset.src) {
    video.src = video.dataset.src
    delete video.dataset.src
    video.load()
  }
  video.play().catch(() => {})
}

if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) loadDeferredVideo(entry.target)
      else entry.target.pause()
    })
  }, { rootMargin: '400px 0px 400px 0px' })
  deferredVideos.forEach((video) => videoObserver.observe(video))
} else {
  deferredVideos.forEach(loadDeferredVideo)
}


})();
