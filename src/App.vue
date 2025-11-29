
<template>
  <main class="container">
    <h1>Avatarverse – Star Wars</h1>

    <!-- Controles -->
    <div class="q-gutter-sm q-mb-md row items-center">
      <q-select v-model="side" :options="['auto','jedi','sith']" label="Lado" outlined dense style="min-width: 160px" />
      <q-select v-model="complexity" :options="['simple','medium','complex']" label="Complexidade" outlined dense style="min-width: 160px" />
      <q-input v-model="identifier" label="Identificador" outlined dense style="min-width: 260px" />
      <q-btn color="primary" label="Gerar" @click="renderAvatar" />
    </div>

    <!-- Canvas SVG -->
    <div ref="svgHost" class="svg-host"></div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { SVG } from '@svgdotjs/svg.js'
import widgetStarWars from './widget/widget-starwars.js'

const svgHost = ref(null)
const identifier = ref('paola@starwars')
const side = ref('auto')          // 'auto' | 'jedi' | 'sith'
const complexity = ref('medium')  // 'simple' | 'medium' | 'complex'

let draw = null

function makeKey(str) {
  // hash determinístico básico
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return {
    _h: h,
    next()    { this._h = (this._h * 1664525 + 1013904223) >>> 0; return this._h % 1000 },
    next256() { this._h = (this._h * 1103515245 + 12345) >>> 0; return this._h & 0xff },
    next16()  { this._h = (this._h * 1103515245 + 12345) >>> 0; return this._h & 0x0f }
  }
}

function renderAvatar() {
  const key = makeKey(identifier.value)
  widgetStarWars(key, draw, { side: side.value, complexity: complexity.value })
}

onMounted(() => {
  draw = SVG().addTo(svgHost.value).size(600, 600)
  renderAvatar()
})
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 24px; }
.svg-host { border: 1px solid #e0e0e0; border-radius: 8px; }
</style>
