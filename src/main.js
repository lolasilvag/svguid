import { createApp } from 'vue'
import App from './App.vue'
import { Icon } from "@iconify/vue"
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/pt-BR'

import 'virtual:windi.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.component('Icon', Icon)
app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
})
app.mount('#app')
// Elementos DOM
const identifierInput = document.getElementById('identifier');
const themeSelect = document.getElementById('theme');
const complexitySelect = document.getElementById('complexity');
const generateBtn = document.getElementById('generate-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const downloadBtn = document.getElementById('download-btn');
const avatarDisplay = document.getElementById('avatar-display');
const avatarGrid = document.getElementById('avatar-grid');
const svgCode = document.getElementById('svg-code');

// Paleta de cores baseada no tema
const colorThemes = {
    colorful: ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'],
    pastel: ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC'],
    monochrome: ['#212121', '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FAFAFA'],
    dark: ['#000000', '#1A1A1A', '#2D2D2D', '#424242', '#5C5C5C', '#757575', '#8E8E8E', '#A8A8A8', '#C2C2C2', '#DCDCDC']
};

// Função para gerar um hash simples a partir de uma string
function stringToHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Converte para inteiro de 32 bits
    }
    return Math.abs(hash);
}

// Função para selecionar cores baseadas no hash
function getColorsFromHash(hash, theme) {
    const colors = colorThemes[theme];
    const colorCount = complexitySelect.value === 'simple' ? 3 : 
                      complexitySelect.value === 'medium' ? 5 : 7;
    
    const selectedColors = [];
    for (let i = 0; i < colorCount; i++) {
        const colorIndex = (hash + i * 123) % colors.length;
        selectedColors.push(colors[colorIndex]);
    }
    
    return selectedColors;
}

// Função para gerar formas SVG baseadas no hash
function generateShapes(hash, colors) {
    const shapes = [];
    const shapeCount = complexitySelect.value === 'simple' ? 4 : 
                     complexitySelect.value === 'medium' ? 7 : 10;
    
    for (let i = 0; i < shapeCount; i++) {
        const shapeType = (hash + i * 456) % 4;
        const colorIndex = (hash + i * 789) % colors.length;
        const color = colors[colorIndex];
        
        // Posições e tamanhos baseados no hash
        const cx = 50 + ((hash + i * 111) % 40 - 20);
        const cy = 50 + ((hash + i * 222) % 40 - 20);
        const size = 10 + ((hash + i * 333) % 30);
        
        switch(shapeType) {
            case 0: // Círculo
                shapes.push(`<circle cx="${cx}" cy="${cy}" r="${size}" fill="${color}" opacity="0.8" />`);
                break;
            case 1: // Retângulo
                const rotation = (hash + i * 444) % 360;
                shapes.push(`<rect x="${cx - size/2}" y="${cy - size/2}" width="${size}" height="${size}" fill="${color}" opacity="0.8" transform="rotate(${rotation} ${cx} ${cy})" />`);
                break;
            case 2: // Triângulo
                const points = `${cx},${cy-size} ${cx-size},${cy+size} ${cx+size},${cy+size}`;
                shapes.push(`<polygon points="${points}" fill="${color}" opacity="0.8" />`);
                break;
            case 3: // Elipse
                const rx = size;
                const ry = size * 0.6;
                shapes.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="0.8" />`);
                break;
        }
    }
    
    return shapes.join('\n        ');
}

// Função para gerar o avatar SVG
function generateAvatar(identifier, theme) {
    const hash = stringToHash(identifier);
    const colors = getColorsFromHash(hash, theme);
    const shapes = generateShapes(hash, colors);
    
    return `
    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${colors[0]}" />
                <stop offset="100%" stop-color="${colors[colors.length-1]}" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bgGradient)" />
        ${shapes}
    </svg>`;
}

// Função para renderizar o avatar
function renderAvatar() {
    const identifier = identifierInput.value || 'default';
    const theme = themeSelect.value;
    
    const avatarSvg = generateAvatar(identifier, theme);
    avatarDisplay.innerHTML = avatarSvg;
    svgCode.textContent = avatarSvg;
    
    // Gerar grid de avatares
    generateAvatarGrid(identifier, theme);
}

// Função para gerar o grid de avatares
function generateAvatarGrid(baseIdentifier, theme) {
    avatarGrid.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const variantIdentifier = `${baseIdentifier}-${i}`;
        const avatarSvg = generateAvatar(variantIdentifier, theme);
        
        const gridItem = document.createElement('div');
        gridItem.className = 'avatar-grid-item';
        gridItem.innerHTML = avatarSvg;
        
        gridItem.addEventListener('click', () => {
            identifierInput.value = variantIdentifier;
            renderAvatar();
        });
        
        avatarGrid.appendChild(gridItem);
    }
}

// Função para gerar um identificador aleatório
function generateRandomIdentifier() {
    const adjectives = ['cool', 'happy', 'brave', 'calm', 'wild', 'gentle', 'proud', 'wise'];
    const nouns = ['tiger', 'eagle', 'dolphin', 'wolf', 'phoenix', 'lion', 'hawk', 'panther'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    
    return `${adj}-${noun}-${num}`;
}

// Função para baixar o SVG
function downloadSVG() {
    const svgElement = avatarDisplay.querySelector('svg');
    if (!svgElement) return;
    
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `avatar-${identifierInput.value || 'default'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event Listeners
generateBtn.addEventListener('click', renderAvatar);
randomizeBtn.addEventListener('click', () => {
    identifierInput.value = generateRandomIdentifier();
    renderAvatar();
});
downloadBtn.addEventListener('click', downloadSVG);

// Renderizar avatar inicial
renderAvatar();