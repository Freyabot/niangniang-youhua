import { assetUrl } from './assets.js?v=1.25';
export const professions = [
  { id: 'product', name: '产品', sigil: '卷', playable: true },
  { id: 'developer', name: '开发', sigil: '工', playable: true },
  { id: 'operations', name: '运营', sigil: '数' },
  { id: 'design', name: '设计', sigil: '纹' },
  { id: 'algorithm', name: '算法', sigil: '算' },
];

export const roleOrder = ['zhenhuan', 'huafei', 'anlingrong', 'empress', 'shenmeizhuang'];
export const playableRoles = roleOrder.slice(0, 3);
export const sceneOrder = ['review', 'report', 'urgent_request', 'retrospective'];
export const playableScenes = sceneOrder.slice(0, 2);

const root = './assets/';
export const sceneArt = {
  review: { background: root + 'scenes/playable/fengfei-ceremony.webp', door: 'review', propFolder: 'fengfei-ceremony' },
  report: { background: root + 'scenes/playable/imperial-audit.webp', door: 'report', propFolder: 'imperial-audit' },
  urgent_request: { background: root + 'scenes/locked/yikun-palace-punishment.webp' },
  retrospective: { background: root + 'scenes/locked/blood-test.webp' },
};

export const entryArt = {
  background: root + 'scenes/entry/palace-gate-background.webp',
  door: 'palace-gate',
};

export const roleArt = id => assetUrl(id === 'shenmeizhuang' ? './assets/characters/shenmeizhuang.webp' : `./generated/characters/${id}-idle.webp`);
export const roleStateArt = (id, state = 'idle') => assetUrl(`./generated/characters/${id}-${state}.webp`);
export const bustArt = id => assetUrl(`./generated/characters/${id}-bust.webp`);
export const doorArt = (kind, part) => assetUrl(`./generated/doors/${kind}-${part}.webp`);
export const propArt = (scene, hotspot, state = 'idle') => {
  if (hotspot === 'empress_rule') return assetUrl('./generated/props/review/empress_rule-slip.webp');
  if (hotspot === 'new_decree') return assetUrl('./generated/props/review/new_decree-scroll.webp');
  const reportSprites = {
    total_ledger: 'total-ledger-scroll-abacus.webp',
    clothing_overspend: 'fabric-bolt.webp',
    receipt_booklets: 'receipt-tally-cord.webp',
    reconciliation_note: 'reconciliation-fold.webp',
    reward_list: 'reward-tally.webp',
    supplement_note: 'supplement-slip.webp',
  };
  if (scene === 'report' && reportSprites[hotspot]) return assetUrl(`./generated/props/report/${reportSprites[hotspot]}`);
  if (['backup_plan', 'compromise_rejected', 'risk_note'].includes(hotspot)) return assetUrl('./generated/props/folded-note.webp');
  return assetUrl(`./generated/props/${scene}/${hotspot}-${state}.webp`);
};

// Positions use the original 1448 × 1086 artwork coordinate system.
export const hotspots = {
  review: {
    ritual_v8: { x: 735, y: 381, w: 100, h: 76, depth: 8, motion: 'page', sound: 'paper-rustle', label: '册封仪注' },
    empress_rule: { x: 1150, y: 419, w: 67, h: 56, depth: 7, motion: 'mark', mergeActor: 'jianqiu', sound: 'ink-brush-stroke', label: '皇后朱签' },
    auspicious_time: { x: 305, y: 442, w: 83, h: 70, depth: 7, motion: 'page', mergeActor: 'supeisheng', sound: 'paper-rustle', label: '吉时簿' },
    new_decree: { x: 190, y: 559, w: 82, h: 62, depth: 8, motion: 'unroll', sound: 'paper-rustle', label: '新口谕' },
    backup_plan: { x: 357, y: 758, w: 67, h: 59, depth: 9, motion: 'reveal', sound: 'paper-rustle', label: '备选章程' },
    compromise_rejected: { x: 1163, y: 761, w: 67, h: 59, depth: 9, motion: 'mark', sound: 'ink-brush-stroke', label: '妥协稿' },
    risk_note: { x: 356, y: 758, w: 67, h: 59, depth: 9, motion: 'reveal', sound: 'paper-rustle', label: '末页批注' },
  },
  report: {
    total_ledger: { x: 850, y: 360, w: 178, h: 77, depth: 8, motion: 'page', sound: 'paper-rustle', label: '六宫总账' },
    clothing_overspend: { x: 1357, y: 355, w: 70, h: 60, depth: 8, motion: 'reveal', sound: 'paper-rustle', label: '朱圈衣料' },
    receipt_booklets: { x: 119, y: 293, w: 69, h: 68, depth: 7, motion: 'reveal', sound: 'paper-rustle', label: '实领凭条' },
    third_tea: { x: 1307, y: 475, w: 94, h: 68, depth: 8, motion: 'tea', sound: 'porcelain-teacup', label: '御前茶' },
    reconciliation_note: { x: 200, y: 300, w: 78, h: 76, depth: 8, motion: 'reveal', sound: 'paper-rustle', label: '核对折页' },
    reward_list: { x: 1211, y: 462, w: 62, h: 86, depth: 8, motion: 'reveal', sound: 'paper-rustle', label: '赏赐牌' },
    supplement_note: { x: 1023, y: 384, w: 87, h: 47, depth: 8, motion: 'reveal', sound: 'paper-rustle', label: '补录小签' },
  },
};

// The same background is painted over sprites at the actual furniture fronts.
// Coordinates are original image pixels; these masks never intercept input.
export const sceneOccluders = {
  review: [
    [[486, 385], [962, 385], [962, 480], [486, 480]],
    [[78, 591], [305, 591], [305, 677], [78, 677]],
  ],
  report: [
    [[337, 383], [1112, 383], [1112, 506], [337, 506]],
    [[1248, 496], [1381, 496], [1381, 604], [1248, 604]],
    [[175, 180], [207, 180], [207, 385], [175, 385]],
    [[19, 318], [161, 318], [161, 344], [19, 344]],
    [[1168, 444], [1235, 444], [1235, 504], [1168, 504]],
    [[1324, 160], [1344, 160], [1344, 422], [1324, 422]],
    [[1334, 410], [1448, 410], [1448, 440], [1334, 440]],
    [[1412, 120], [1448, 120], [1448, 690], [1412, 690]],
  ],
};

export const actors = {
  review: {
    huangshang: { x: 724, y: 415, h: 225, depth: 2, crop: 'inset(0 0 30% 0)' },
    empress: { x: 1045, y: 495, h: 220, depth: 5 },
    jianqiu: { x: 1150, y: 505, h: 220, depth: 6 },
    supeisheng: { x: 325, y: 520, h: 225, depth: 6, handMask: 'inset(59% 42% 27% 40%)' },
  },
  report: {
    huangshang: { x: 724, y: 398, h: 230, depth: 2, crop: 'inset(0 0 32% 0)' },
    supeisheng: { x: 285, y: 530, h: 238, depth: 6, handMask: 'inset(59% 42% 27% 40%)' },
  },
};

export function foregroundActors(scene, current) {
  if (scene === 'report') return [{ id: current, x: 724, y: 855, h: 285, depth: 23, current: true }];
  const others = playableRoles.filter(id => id !== current);
  const left = others[0], right = others[1];
  const list = [
    { id: left, x: 320, y: 840, h: 250, depth: 22 },
    { id: current, x: 724, y: 855, h: 285, depth: 23, current: true },
    { id: right, x: 1130, y: 840, h: 250, depth: 22 },
  ];
  if ([left, current, right].includes('zhenhuan')) {
    const owner = list.find(a => a.id === 'zhenhuan');
    list.push({ id: 'jingxi', x: owner.x + (owner.current ? 166 : 153), y: owner.y, h: owner.h, depth: owner.depth - 1 });
  }
  if ([left, current, right].includes('huafei')) {
    const owner = list.find(a => a.id === 'huafei');
    list.push({ id: 'songzhi', x: owner.x + (owner.current ? 166 : -153), y: owner.y, h: owner.h, depth: owner.depth - 1 });
  }
  return list;
}

export const imageSize = { width: 1448, height: 1086 };

export function bindPreparedArt() {
  entryArt.background = assetUrl(entryArt.background);
  Object.values(sceneArt).forEach(art => { art.background = assetUrl(art.background); });
}
