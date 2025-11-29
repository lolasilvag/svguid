
// src/widget/utils/starwars/motifs.js
import { SVG } from '@svgdotjs/svg.js'

export function drawLightsaber(draw, { x, y, length = 360, width = 10, angle = 0, color = '#B10000', glow = true }) {
  // cabo (mais escuro)
  const hilt = draw.rect(width + 6, 24).move(x - 3, y - 12).fill('#222').stroke({ color: '#555', width: 2 })
  hilt.transform({ rotate: angle, origin: { x, y } })

  // lâmina
  const blade = draw.rect(width, length).move(x, y).fill(color).opacity(0.9)
  blade.transform({ rotate: angle, origin: { x, y } })

  if (glow) {
    blade.filterWith(function(add) {
      const gauss = add.gaussianBlur(3)
      blade.attr('filter', gauss) // efeito suave
    })
  }

  return { hilt, blade }
}

export function drawHolocron(draw, { cx, cy, size = 160, color = '#2EC4B6', stroke = '#FFFFFF' }) {
  // holocron simples: um cubo estilizado visto em projeção com linhas
  const half = size / 2
  const points = [
    [cx,           cy - half],      // topo
    [cx + half,    cy],             // direita
    [cx,           cy + half],      // base
    [cx - half,    cy]              // esquerda
  ]

  const poly = draw.polyline(points.map(p => p.join(','))).fill(color).opacity(0.3)
  poly.stroke({ color: stroke, width: 2, linejoin: 'round' })

  // Linhas internas (diagonais)
  draw.line(cx - half, cy, cx + half, cy).stroke({ color: stroke, width: 1 })
  draw.line(cx, cy - half, cx, cy + half).stroke({ color: stroke, width: 1 })

  return poly
}

export function scatterStars(draw, { count = 48, W = 600, H = 600, seedFn = () => Math.random() }) {
  for (let i = 0; i < count; i++) {
    const rx = Math.floor(seedFn() * W)
    const ry = Math.floor(seedFn() * H)
    const r  = 1 + Math.floor(seedFn() * 2)
    draw.circle(r).move(rx, ry).fill('#FFFFFF').opacity(0.8)
  }
}
