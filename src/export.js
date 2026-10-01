import { quotes, roles, scenes, ui } from './content.js';
import { sceneArt, hotspots, propArt, bustArt, sceneOccluders } from './game-data.js';

const imageCache = new Map();
function loadImage(url) {
  if (!imageCache.has(url)) imageCache.set(url, new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url;
  }));
  return imageCache.get(url);
}
function wrap(ctx, value, maxWidth) {
  const lines = []; let line = '';
  for (const char of value) {
    if (ctx.measureText(line + char).width > maxWidth && line) { lines.push(line); line = char; }
    else line += char;
  }
  if (line) lines.push(line);
  return lines;
}

export async function makeQuoteImage(id, signal) {
  const item = quotes[id];
  if (!item) throw new Error('missing quote');
  const { scene, role, hotspot } = item;
  const p = hotspots[scene][hotspot];
  const [background, prop, person, frame, seal] = await Promise.all([
    loadImage(sceneArt[scene].background), loadImage(propArt(scene, hotspot, 'found')),
    loadImage(bustArt(role)), loadImage('./assets/ui/dialogue-frame.webp'), loadImage('./assets/ui/product-seal.webp'),
  ]);
  if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#2b1812'; ctx.fillRect(0, 0, 1080, 1440);
  // Preserve the recorded item's own scene and hotspot, independent of current global selection.
  const sceneH = 960, scale = sceneH / 1086;
  const sceneX = (1080 - 1448 * scale) / 2;
  ctx.drawImage(background, sceneX, 0, 1448 * scale, sceneH);
  const px = sceneX + (p.x - p.w / 2) * scale, py = (p.y - p.h / 2) * scale;
  ctx.save(); ctx.shadowColor = '#e6cb8b'; ctx.shadowBlur = 35;
  ctx.drawImage(prop, px, py, p.w * scale, p.h * scale); ctx.restore();
  for (const points of sceneOccluders[scene]) {
    ctx.save(); ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(sceneX + x * scale, y * scale) : ctx.moveTo(sceneX + x * scale, y * scale));
    ctx.closePath(); ctx.clip(); ctx.drawImage(background, sceneX, 0, 1448 * scale, sceneH); ctx.restore();
  }
  const dark = ctx.createLinearGradient(0, 500, 0, 1100);
  dark.addColorStop(0, 'rgba(35,17,12,0)'); dark.addColorStop(1, 'rgba(35,17,12,.95)');
  ctx.fillStyle = dark; ctx.fillRect(0, 500, 1080, 650);
  const personRatio = person.width / person.height;
  const personH = 615, personW = personH * personRatio;
  ctx.drawImage(person, 20, 420, personW, personH);
  ctx.drawImage(frame, 38, 965, 1004, 380);
  ctx.imageSmoothingEnabled = true;
  ctx.fillStyle = '#5b3724'; ctx.font = '600 31px "Noto Serif CJK SC", "Songti SC", serif';
  ctx.fillText(`${roles[role].name} · ${roles[role].rank}`, 104, 1095);
  ctx.fillStyle = '#2f211a'; ctx.font = '500 43px "Noto Serif CJK SC", "Songti SC", serif';
  const lines = wrap(ctx, item.text, 845);
  const lineHeight = lines.length > 3 ? 50 : 65;
  lines.forEach((line, i) => ctx.fillText(line, 104, 1160 + i * lineHeight));
  ctx.fillStyle = '#ead6ae'; ctx.font = '24px "Noto Serif CJK SC", serif';
  ctx.fillText(`${scenes[scene].palaceName} · ${scenes[scene].workName}`, 70, 1404);
  ctx.drawImage(seal, 876, 1320, 125, 125);
  ctx.textAlign = 'center'; ctx.fillStyle = '#f8dca0';
  ctx.font = 'bold 28px "Noto Serif CJK SC", "Songti SC", serif';
  ctx.fillText('娘娘', 938, 1372); ctx.fillText('有话', 938, 1405);
  ctx.textAlign = 'start';
  if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  const blob = await new Promise((resolve, reject) => canvas.toBlob(x => x ? resolve(x) : reject(new Error('export failed')), 'image/png'));
  if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  return { blob, url: URL.createObjectURL(blob), filename: `${ui['ui.brand.name']}-${roles[role].name}-${scene}-${hotspot}.png` };
}
