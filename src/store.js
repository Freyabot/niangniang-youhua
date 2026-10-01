import { playableRoles, playableScenes, professions } from './game-data.js?v=1.23';
import { quotes } from './content.js?v=1.23';

const KEY = 'niangniang-youhua-v1';
const VERSION = 1;
const professionIds = new Set(professions.filter(x => x.playable).map(x => x.id));
const validQuote = /^quote\.(product|developer)\.(review|report)\.(zhenhuan|huafei|anlingrong)\.([a-z0-9_]+)$/;
const clean = raw => {
  const x = raw && typeof raw === 'object' ? raw : {};
  return {
    version: VERSION,
    profession: professionIds.has(x.profession) ? x.profession : null,
    role: playableRoles.includes(x.role) ? x.role : null,
    scene: playableScenes.includes(x.scene) ? x.scene : null,
    collected: Array.isArray(x.collected) ? [...new Set(x.collected.filter(id => typeof id === 'string' && validQuote.test(id) && quotes[id]))].slice(0, 60) : [],
    muted: !!x.muted,
    lastRole: playableRoles.includes(x.lastRole) ? x.lastRole : null,
    lastProfession: professionIds.has(x.lastProfession) ? x.lastProfession : null,
  };
};

let temporary = false;
let state;
try {
  const saved = localStorage.getItem(KEY);
  try { state = clean(saved ? JSON.parse(saved) : {}); }
  catch { state = clean({}); }
} catch { state = clean({}); temporary = true; }

export const getState = () => state;
export const isTemporary = () => temporary;
export function updateState(patch) {
  state = clean({ ...state, ...patch });
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { temporary = true; }
  return state;
}
export const hasQuote = id => state.collected.includes(id);
export function collect(id) {
  if (!validQuote.test(id) || !quotes[id] || hasQuote(id)) return false;
  updateState({ collected: [...state.collected, id] });
  return true;
}
export function clearCollection() { updateState({ collected: [] }); }
export function quoteId(profession, scene, role, hotspot) {
  return `quote.${profession}.${scene}.${role}.${hotspot}`;
}
