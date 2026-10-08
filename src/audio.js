import { assetUrl } from './assets.js?v=1.26';
import { getState, updateState } from './store.js?v=1.26';

const bgm = {
  menu: new Audio('./assets/music/bgm/start-end.mp3'),
  scene: new Audio('./assets/music/bgm/scene.mp3'),
};
Object.values(bgm).forEach(a => { a.loop = true; a.preload = 'none'; a.volume = 0; });
const sounds = new Map();
let current = 'menu';
let transition = 0;
let activeEffect = null;
let unlocked = false;

function tryPlay(a) { return a.play().catch(() => {}); }
function fadeTo(name) {
  cancelAnimationFrame(transition);
  current = name;
  for (const [key, a] of Object.entries(bgm)) {
    if (key !== name) { a.pause(); a.volume = 0; }
  }
  if (getState().muted || !unlocked) return;
  const target = bgm[name];
  tryPlay(target);
  const from = target.volume;
  const start = performance.now();
  const step = now => {
    const t = Math.max(0, Math.min((now - start) / 750, 1));
    target.volume = from + (0.18 - from) * t;
    if (t < 1) transition = requestAnimationFrame(step);
  };
  transition = requestAnimationFrame(step);
}

export function unlockAudio() { unlocked = true; fadeTo(current); }
export function setMusicContext(name) { fadeTo(name === 'scene' ? 'scene' : 'menu'); }
export function setDucked(value) {
  const a = bgm[current];
  if (a && !getState().muted) a.volume = value ? 0.09 : 0.18;
}
export function playSound(name, exclusive = true) {
  if (getState().muted || !unlocked) return;
  try {
    if (exclusive && activeEffect) { activeEffect.pause(); activeEffect.currentTime = 0; }
    let sound = sounds.get(name);
    if (!sound) { sound = new Audio(assetUrl(`./assets/music/audio/${name}.mp3`)); sounds.set(name, sound); }
    sound.pause(); sound.currentTime = 0; sound.volume = name === 'palace-door-open' ? 0.45 : 0.52;
    activeEffect = sound;
    tryPlay(sound);
  } catch { /* Sound failure never blocks play. */ }
}
export function stopEffect() { if (activeEffect) { activeEffect.pause(); activeEffect.currentTime = 0; activeEffect = null; } }
export function toggleMute() {
  const muted = !getState().muted;
  updateState({ muted });
  if (muted) { cancelAnimationFrame(transition); Object.values(bgm).forEach(a => { a.pause(); a.volume = 0; }); stopEffect(); }
  else { unlocked = true; fadeTo(current); }
  return muted;
}

export function audioStatus() {
  return Object.fromEntries(Object.entries(bgm).map(([key, a]) => [key, { paused: a.paused, volume: a.volume }]));
}

export function prepareAudio(manifest) {
  bgm.menu.src = assetUrl('./assets/music/bgm/start-end.mp3');
  bgm.scene.src = assetUrl('./assets/music/bgm/scene.mp3');
  manifest.filter(item => item.url.includes('/music/audio/')).forEach(item => {
    const name = item.url.split('/').pop().replace('.mp3', '');
    const sound = new Audio(assetUrl(item.url)); sound.preload = 'auto'; sound.load();
    sounds.set(name, sound);
  });
  Object.values(bgm).forEach(sound => { sound.preload = 'auto'; sound.load(); });
}
