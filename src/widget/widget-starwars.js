
// src/widget/widget-starwars.js
import { PALETTE_JEDI, PALETTE_SITH, PALETTE_SPACE } from './utils/colors/starwars.js'
import { drawLightsaber, drawHolocron, scatterStars } from './utils/starwars/motifs.js'
import { SVG } from '@svgdotjs/svg.js'

// determinista simples a partir de key
function pick(array, n) { return array[n % array.length] }

export default function widgetStarWars(key, draw, { side = 'auto', complexity = 'medium' } = {}) {
  draw.clear()
  const W = 600, H = 600
  draw.size(W, H)

  // Fundo “space”
  const bg = draw.rect(W, H).move(0, 0).fill(pick(PALETTE_SPACE, key.next()))
  scatterStars(draw, {
    count: complexity === 'simple' ? 24 : complexity === 'medium' ? 48 : 88,
    W, H,
    seedFn: () => (key.next() % 997) / 997
  })

  // Escolha do lado (auto → decide via key)
  const isJedi = side === 'jedi' ? true : side === 'sith' ? false : (key.next16() % 2 === 0)
  const PAL = isJedi ? PALETTE_JEDI : PALETTE_SITH

  // Holocron no centro (cor do lado)
  drawHolocron(draw, {
    cx: W / 2,
    cy: H / 2,
    size: complexity === 'simple' ? 120 : complexity === 'medium' ? 160 : 200,
    color: pick(PAL, key.next()),
    stroke: '#FFFFFF'
  })

  // Sabres (dois cruzados ou paralelos)
  const angleBase = isJedi ? 35 : -35
  const saberLen  = complexity === 'simple' ? 260 : complexity === 'medium' ? 360 : 420
  const saberWidth= complexity === 'complex' ? 12 : 10

  const colorBlade = pick(PAL, key.next())
  drawLightsaber(draw, {
    x: W / 2 - 12, y: H / 2 - 18,
    length: saberLen, width: saberWidth, angle: angleBase,
    color: colorBlade, glow: true
  })

  drawLightsaber(draw, {
    x: W / 2 + 12, y: H / 2 - 18,
    length: saberLen, width: saberWidth, angle: -angleBase,
    color: pick(PAL, key.next()), glow: true
  })

  // Ornamentos extras para “complex”
  if (complexity === 'complex') {
    // pequenas estrelas/triângulos próximos ao holocron
    const tri = draw.polygon([
      W/2 - 20, H/2 - 60,
      W/2,     H/2 - 20,
      W/2 - 40, H/2 - 20
    ].join(',')).fill('#FFFFFF').opacity(0.7)
    tri.stroke({ color: '#FFFFFF', width: 1 })
  }
}
