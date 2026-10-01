import { ui, roles, scenes, causes, quotes, previews, sceneHotspots } from './content.js';
import { professions, playableRoles, roleOrder, sceneOrder, sceneArt, entryArt, roleArt, roleStateArt, doorArt, propArt, actors, foregroundActors } from './game-data.js';
import { getState, updateState, hasQuote, clearCollection, quoteId, isTemporary } from './store.js';
import { unlockAudio, playSound, setMusicContext, toggleMute } from './audio.js';
import { mountScene } from './scene.js';
import { makeQuoteImage } from './export.js';

const app = document.querySelector('#app');
let sceneHandle = null, exportController = null, exportResult = null, libraryRole = null, libraryScroll = 0, previewRole = null;
let toastTimer = null;
const $ = (s, root = app) => root.querySelector(s);
const profName = id => professions.find(x => x.id === id)?.name || '';
const pathLabel = () => {
  const s = getState(); return [profName(s.profession), roles[s.role]?.name, scenes[s.scene]?.palaceName].filter(Boolean).join(' › ');
};
const route = () => decodeURIComponent(location.hash.slice(2) || 'entry');
function navigate(to, state = {}) {
  clearTimeout(toastTimer); document.querySelector('#toast')?.classList.remove('show');
  if (sceneHandle) { sceneHandle.destroy(); sceneHandle = null; }
  if (exportController) { exportController.abort(); exportController = null; }
  if (exportResult) { URL.revokeObjectURL(exportResult.url); exportResult = null; }
  history.pushState(state, '', `#/${encodeURIComponent(to).replaceAll('%2F', '/')}`);
  render();
}
function toast(message) {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.append(el); }
  el.textContent = message; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}
function buttonSound() { playSound('click-button'); }
function blocked(message) { playSound('blocked-wood-knock'); toast(message); }
function shell(page, title, body, back, options = {}) {
  const s = getState();
  app.innerHTML = `<main class="game-shell ${page}">
    <header class="topbar">
      ${back ? '<button class="icon-button back-button" aria-label="返回">‹</button>' : '<span class="topbar-spacer"></span>'}
      <span class="breadcrumb">${pathLabel() || '娘娘有话'}</span>
      <div class="top-actions">
        ${options.library ? '<button class="small-link library-link">案卷库</button>' : ''}
        <button class="icon-button sound-button" aria-label="声音开关" aria-pressed="${s.muted}">${s.muted ? '静' : '音'}</button>
      </div>
    </header>
    <div class="page-content"><div class="page-heading"><span class="eyebrow">NIANG NIANG YOU HUA</span><h1>${title}</h1></div>${body}</div>
  </main>`;
  $('.back-button')?.addEventListener('click', () => { buttonSound(); back(); });
  $('.library-link')?.addEventListener('click', () => { buttonSound(); openLibrary(); });
  $('.sound-button')?.addEventListener('click', toggleSound);
}
function toggleSound() {
  const muted = toggleMute();
  document.querySelectorAll('.sound-button,.scene-sound').forEach(el => { el.textContent = muted ? '静' : '音'; el.setAttribute('aria-pressed', String(muted)); });
}
function canOpenLibrary() {
  const s = getState(); return (!!s.profession && !!s.role) || s.collected.length > 0;
}
function openLibrary() {
  const s = getState();
  if (!canOpenLibrary()) return;
  libraryRole = s.role || s.lastRole || playableRoles[0];
  navigate('library', { source: route() });
}
function renderEntry() {
  setMusicContext('menu');
  const s = getState();
  app.innerHTML = `<main class="game-shell entry-page">
    <div class="entry-bg" style="background-image:url('${entryArt.background}')"></div>
    <div class="entry-doors"><img class="door-left" src="${doorArt(entryArt.door, 'left')}" alt=""/><img class="door-right" src="${doorArt(entryArt.door, 'right')}" alt=""/><img class="door-frame" src="${doorArt(entryArt.door, 'frame')}" alt=""/></div>
    <button class="entry-sound icon-button sound-button" aria-label="声音开关" aria-pressed="${s.muted}">${s.muted ? '静' : '音'}</button>
    <div class="entry-content"><span class="entry-overline">一卷职场宫廷心事</span><h1>${ui['ui.brand.name']}</h1><p>${ui['ui.entry.hook']}</p><button class="primary-button entry-enter">${ui['ui.entry.enter']}</button>${s.collected.length ? '<button class="entry-library plain-button">案卷库</button>' : ''}</div>
  </main>`;
  $('.sound-button').onclick = toggleSound;
  $('.entry-library')?.addEventListener('click', () => { buttonSound(); openLibrary(); });
  $('.entry-enter').onclick = async () => {
    playSound('palace-door-open'); $('.entry-page').classList.add('opening');
    await new Promise(r => setTimeout(r, matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 800));
    navigate('profession');
  };
}
function renderProfessions() {
  setMusicContext('menu');
  const cards = professions.map(p => `<button class="choice-card profession-card ${p.playable ? '' : 'locked'}" data-id="${p.id}">
    <span class="choice-sigil" aria-hidden="true">${p.sigil}</span><span class="choice-copy"><strong>${p.name}</strong><small>${ui[`ui.profession.${p.id}.situation`]}</small></span><span class="choice-state">${p.playable ? '领此差事 ›' : '筹备中 · 锁'}</span>
  </button>`).join('');
  shell('selection-page profession-page', ui['ui.profession.title'], `<div class="choice-list">${cards}</div>`, () => navigate('entry'), { library: canOpenLibrary() });
  app.querySelectorAll('.profession-card').forEach(el => el.onclick = () => {
    const p = professions.find(x => x.id === el.dataset.id);
    if (!p.playable) return blocked(ui['ui.locked.profession']);
    buttonSound(); updateState({ profession: p.id, lastProfession: p.id }); navigate('roles');
  });
}
function renderRoles() {
  setMusicContext('menu');
  if (!getState().profession) return navigate('profession');
  let index = Math.max(0, roleOrder.indexOf(getState().lastRole));
  shell('selection-page roles-page', '今日，借哪位主子的胆？', `
    <p class="page-lede">同一桩心事，换个人说，便是另一番滋味。</p>
    <div class="role-carousel" aria-label="左右滑动选择角色">
      <button class="role-nav role-prev" type="button" aria-label="上一位角色">‹</button>
      <div class="role-stage" tabindex="0" aria-live="polite"></div>
      <button class="role-nav role-next" type="button" aria-label="下一位角色">›</button>
    </div>
    <div class="role-dots" aria-label="角色位置"></div>
    <p class="role-swipe-hint">‹ 左右滑动，看看谁与你同心 ›</p>
    <button class="primary-button role-stage-select" type="button">听她说一句</button>`, () => navigate('profession'), { library: canOpenLibrary() });
  const stage = $('.role-stage'), carousel = $('.role-carousel'), dots = $('.role-dots'), select = $('.role-stage-select');
  let gesture = null;
  function showRole(next) {
    index = Math.max(0, Math.min(roleOrder.length - 1, next));
    const id = roleOrder[index], r = roles[id];
    stage.innerHTML = `<div class="role-stage-character ${r.playable ? '' : 'locked'}"><img src="${roleArt(id)}" alt="${r.name}" draggable="false"/></div>
      <div class="role-stage-copy"><span class="role-rank">${r.rank} · ${r.residence}</span><strong>${r.name}</strong><span>${r.selfReference} · ${r.persona}</span><small>${r.playable ? r.suitsYou : '尚未入宫'}</small></div>`;
    stage.dataset.id = id;
    stage.setAttribute('aria-label', `${r.name}，第 ${index + 1} 位，共 ${roleOrder.length} 位${r.playable ? '' : '，尚未入宫'}`);
    select.textContent = r.playable ? '听她说一句' : '尚未入宫 · 锁';
    select.classList.toggle('locked', !r.playable);
    $('.role-prev').disabled = index === 0;
    $('.role-next').disabled = index === roleOrder.length - 1;
    dots.innerHTML = roleOrder.map((roleId, i) => `<button type="button" class="role-dot ${i === index ? 'active' : ''}" data-index="${i}" aria-label="查看${roles[roleId].name}" aria-current="${i === index}"></button>`).join('');
  }
  function stepRole(delta) { if (index + delta >= 0 && index + delta < roleOrder.length) { buttonSound(); showRole(index + delta); } }
  $('.role-prev').onclick = () => stepRole(-1);
  $('.role-next').onclick = () => stepRole(1);
  dots.onclick = e => { const dot = e.target.closest('.role-dot'); if (dot && Number(dot.dataset.index) !== index) { buttonSound(); showRole(Number(dot.dataset.index)); } };
  carousel.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; gesture = { x: e.clientX, y: e.clientY, id: e.pointerId }; stage.setPointerCapture(e.pointerId); });
  carousel.addEventListener('pointerup', e => {
    if (!gesture || gesture.id !== e.pointerId) return;
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) stepRole(dx < 0 ? 1 : -1);
  });
  carousel.addEventListener('pointercancel', () => { gesture = null; });
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); stepRole(e.key === 'ArrowRight' ? 1 : -1); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select.click(); }
  });
  select.onclick = () => {
    const id = roleOrder[index];
    if (!roles[id].playable) return blocked(ui['ui.locked.role']);
    buttonSound(); previewRole = id; showPreview(id);
  };
  showRole(index);
}
function showPreview(id) {
  const r = roles[id], qid = previews[`preview.${getState().profession}.${id}`], q = quotes[qid];
  const modal = document.createElement('div'); modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="preview-sheet" role="dialog" aria-modal="true" aria-label="${r.name}试听签"><button class="modal-close" aria-label="关闭">×</button><div class="preview-person"><img src="${roleArt(id)}" alt=""/></div><span class="eyebrow">听她说一句</span><h2>${r.name}<small>${r.rank} · ${r.residence}</small></h2><p class="preview-quote">${q.text}</p><div class="preview-actions"><button class="primary-button preview-confirm">${ui['ui.preview.confirm']}</button><button class="plain-button preview-back">${ui['ui.preview.back']}</button></div></section>`;
  app.append(modal);
  const close = () => modal.remove();
  $('.modal-close', modal).onclick = close; $('.preview-back', modal).onclick = close;
  $('.preview-confirm', modal).onclick = () => { buttonSound(); updateState({ role: id, lastRole: id }); close(); navigate('scenes'); };
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
}
function renderScenes() {
  setMusicContext('menu');
  const s = getState(); if (!s.profession) return navigate('profession'); if (!s.role) return navigate('roles');
  const cards = sceneOrder.map(id => {
    const sc = scenes[id];
    return `<button class="scene-choice ${sc.playable ? '' : 'locked'}" data-id="${id}"><img src="${sceneArt[id].background}" alt="" loading="lazy"/><span class="scene-card-shade"></span><span class="scene-card-copy"><small>${sc.workName}</small><strong>${sc.palaceName}</strong><em>${sc.mood}</em></span><span class="scene-status">${sc.statusLabel}</span></button>`;
  }).join('');
  shell('selection-page scenes-page', '今日入哪一殿？', `<p class="page-lede">择一处旧景，说一件今日的事。</p><div class="scene-choice-list">${cards}</div>`, () => navigate('roles'), { library: true });
  app.querySelectorAll('.scene-choice').forEach(el => el.onclick = () => {
    const id = el.dataset.id;
    if (!scenes[id].playable) return blocked(ui['ui.locked.scene']);
    buttonSound(); updateState({ scene: id }); enterScene();
  });
}
function preload(url) { return new Promise((resolve, reject) => { const img = new Image(); img.onload = resolve; img.onerror = reject; img.src = url; }); }
async function enterScene() {
  const s = getState();
  if (!s.profession || !s.role || !scenes[s.scene]?.playable) return navigate('profession');
  app.innerHTML = `<main class="game-shell loading-page"><div class="loading-sigil">景</div><p>此景正在布置…</p></main>`;
  try {
    const hs = [...sceneHotspots[s.scene].shared, sceneHotspots[s.scene].exclusive[s.role]];
    const people = new Set([...Object.keys(actors[s.scene]), ...foregroundActors(s.scene, s.role).map(a => a.id)]);
    const resources = [
      sceneArt[s.scene].background,
      ...['left', 'right', 'frame'].map(part => doorArt(sceneArt[s.scene].door, part)),
      ...[...people].flatMap(id => ['idle', 'pressure', 'action'].map(state => roleStateArt(id, state))),
      ...hs.flatMap(h => ['idle', 'action-01', 'action-02', 'found'].map(state => propArt(s.scene, h, state))),
    ];
    await Promise.all(resources.map(preload));
  } catch {
    app.innerHTML = `<main class="game-shell error-page"><img src="./assets/ui/scene-unready.webp" alt=""/><p>${ui['ui.resource.failed']}</p><button class="primary-button retry">${ui['ui.resource.retry']}</button><button class="plain-button back">${ui['ui.resource.back']}</button></main>`;
    $('.retry').onclick = enterScene; $('.back').onclick = () => navigate('scenes'); return;
  }
  navigate('scene');
}
async function renderScene() {
  const s = getState();
  if (!s.profession || !s.role || !scenes[s.scene]?.playable) return navigate('profession');
  app.innerHTML = '<main class="game-shell scene-shell"></main>';
  sceneHandle = await mountScene($('.scene-shell'), {
    onBack: () => { buttonSound(); navigate('scenes'); },
    onLibrary: () => { buttonSound(); openLibrary(); },
    onCase: id => { buttonSound(); navigate(`case/${id}`, { source: 'scene' }); },
    onSwitchRole: () => showRoleSwitcher(), onToast: toast,
    skipIntro: !!history.state?.skipIntro,
  });
  $('.scene-sound')?.addEventListener('click', toggleSound);
  $('.scene-sound').textContent = getState().muted ? '静' : '音';
}
function showRoleSwitcher() {
  const modal = document.createElement('div'); modal.className = 'modal-backdrop role-switcher';
  modal.innerHTML = `<section class="switch-sheet" role="dialog" aria-modal="true" aria-label="换位主子"><h2>换位主子再看</h2><p>这殿还是这殿，换双眼睛来看。</p>${playableRoles.map(id => `<button data-role="${id}" class="switch-option ${id === getState().role ? 'selected' : ''}"><img src="${roleArt(id)}" alt=""/>${roles[id].name}<span>${id === getState().role ? '当前主子' : '去看看 ›'}</span></button>`).join('')}<button class="plain-button switch-close">暂且不换</button></section>`;
  app.append(modal);
  $('.switch-close', modal).onclick = () => modal.remove();
  modal.querySelectorAll('[data-role]').forEach(b => b.onclick = () => { const id = b.dataset.role; buttonSound(); modal.remove(); sceneHandle?.switchRole(id); });
}
function libraryContext() {
  const s = getState();
  let profession = s.profession || s.lastProfession;
  if (!profession && s.collected.length) profession = s.collected[0].split('.')[1];
  return profession;
}
function renderLibrary() {
  setMusicContext('menu');
  const profession = libraryContext(); if (!profession) return navigate('profession');
  const s = getState(); libraryRole = libraryRole || s.role || s.lastRole || playableRoles[0];
  const roleCount = role => ['review', 'report'].reduce((n, scene) => n + [...sceneHotspots[scene].shared, sceneHotspots[scene].exclusive[role]].filter(h => hasQuote(quoteId(profession, scene, role, h))).length, 0);
  const tabs = playableRoles.map(id => `<button class="library-tab ${id === libraryRole ? 'active' : ''}" data-role="${id}">${roles[id].name}册 <small>${roleCount(id)} / 10</small>${id === s.role ? '<i>当前主子</i>' : ''}</button>`).join('');
  const sections = ['review','report'].map(scene => {
    const hs = [...sceneHotspots[scene].shared, sceneHotspots[scene].exclusive[libraryRole]];
    const items = hs.map(h => {
      const id = quoteId(profession, scene, libraryRole, h), found = hasQuote(id);
      return `<button class="case-tile ${found ? 'found' : 'locked'}" data-id="${id}">${found ? `<span class="case-tile-cause">${causes[`hotspot.${scene}.${h}`]}</span><span class="case-tile-quote">${quotes[id].text}</span><small>${scenes[scene].palaceName}</small>` : `<span class="locked-case-icon">封</span><span>${ui['ui.library.locked_case']}</span>`}</button>`;
    }).join('');
    return `<section class="library-section"><h2>${scenes[scene].palaceName}<small>${scenes[scene].workName}</small></h2><div class="case-grid">${items}</div></section>`;
  }).join('');
  shell('library-page', ui['ui.library.title'].replace('{profession}', profName(profession)), `<div class="library-header"><img src="${roleArt(libraryRole)}" alt=""/><div><span>${profName(profession)} · ${roles[libraryRole].name}</span><strong>已寻得 ${roleCount(libraryRole)} / 10</strong></div></div><nav class="library-tabs" aria-label="角色分册">${tabs}</nav>${sections}<button class="clear-record plain-button">${ui['ui.storage.clear']}</button>`, () => {
    const source = history.state?.source || (s.scene ? 'scene' : 'scenes');
    navigate(source, source === 'scene' ? { skipIntro: true } : {});
  }, { library: false });
  $('.page-content').scrollTop = libraryScroll;
  app.querySelectorAll('.library-tab').forEach(b => b.onclick = () => { buttonSound(); libraryRole = b.dataset.role; libraryScroll = 0; renderLibrary(); });
  app.querySelectorAll('.case-tile').forEach(b => b.onclick = () => {
    if (!hasQuote(b.dataset.id)) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return playSound('blocked-wood-knock'); }
    buttonSound(); libraryScroll = $('.page-content').scrollTop;
    navigate(`case/${b.dataset.id}`, { source: 'library', librarySource: history.state?.source, libraryRole, libraryScroll });
  });
  $('.clear-record').onclick = () => confirmClear();
}
function confirmClear() {
  const modal = document.createElement('div'); modal.className = 'modal-backdrop';
  modal.innerHTML = `<section class="confirm-sheet" role="dialog" aria-modal="true"><h2>清空本地记录</h2><p>${ui['ui.storage.clear_confirm']}</p><div><button class="plain-button cancel">暂不清空</button><button class="primary-button confirm">仍要清空</button></div></section>`;
  app.append(modal); $('.cancel', modal).onclick = () => modal.remove();
  $('.confirm', modal).onclick = () => { clearCollection(); modal.remove(); libraryScroll = 0; renderLibrary(); };
}
function caseBack(source) {
  if (source === 'scene') navigate('scene', { skipIntro: true });
  else {
    let librarySource;
    if (source === 'library') { libraryRole = history.state?.libraryRole || libraryRole; libraryScroll = history.state?.libraryScroll || 0; librarySource = history.state?.librarySource; }
    navigate('library', { source: librarySource });
  }
}
function renderCase(id) {
  setMusicContext('menu');
  const item = quotes[id], found = item && hasQuote(id), source = history.state?.source;
  if (!item) {
    shell('case-page error-case', ui['ui.case.title'], `<div class="case-paper"><h2>${ui['ui.case.unavailable']}</h2><button class="primary-button go-library">返回案卷库</button><button class="plain-button go-entry">重新入宫</button></div>`, () => navigate('entry'));
    $('.go-library').onclick = () => openLibrary(); $('.go-entry').onclick = () => navigate('entry'); return;
  }
  const { profession, role, scene, hotspot } = item;
  if (!found) {
    shell('case-page locked-case-page', ui['ui.case.title'], `<div class="case-paper"><span class="locked-case-icon">封</span><h2>${ui['ui.library.locked_case']}</h2><button class="primary-button go-scene">去此场景</button></div>`, () => caseBack(source));
    $('.go-scene').onclick = () => { updateState({ profession, role, scene }); enterScene(); }; return;
  }
  const fields = [['差事', profName(profession)], ['主子', roles[role].name], ['位份', roles[role].rank], ['宫廷场景', scenes[scene].palaceName], ['职场场景', scenes[scene].workName], ['案由', causes[`hotspot.${scene}.${hotspot}`]]];
  shell('case-page', ui['ui.case.title'], `<article class="case-paper"><div class="case-topline">${scenes[scene].palaceName} · ${roles[role].name}册</div><div class="case-hero"><img src="./generated/characters/${role}-bust.webp" alt=""/><div><span>判词</span><blockquote>${item.text}</blockquote></div></div><dl class="case-fields">${fields.map(([k,v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><div class="case-actions"><button class="plain-button case-go">${source === 'scene' ? ui['ui.case.back_scene'] : ui['ui.case.go_scene']}</button><button class="primary-button case-export">${ui['ui.case.export']}</button></div><div class="export-area" hidden></div></article>`, () => caseBack(source), { library: true });
  $('.case-go').onclick = () => { buttonSound(); if (source === 'scene') navigate('scene', { skipIntro: true }); else { updateState({ profession, role, scene, lastProfession: profession, lastRole: role }); enterScene(); } };
  $('.case-export').onclick = () => startExport(id);
}
async function startExport(id) {
  const button = $('.case-export'), area = $('.export-area');
  if (!button || button.disabled) return;
  button.disabled = true; button.textContent = ui['ui.export.generating'];
  area.hidden = true; exportController = new AbortController();
  try {
    const result = await makeQuoteImage(id, exportController.signal);
    exportResult = result; playSound('seal-stamp');
    area.innerHTML = `<div class="export-preview"><img src="${result.url}" alt="已生成的语录图片预览"/><div class="export-actions"><a class="primary-button" href="${result.url}" download="${result.filename}">${ui['ui.export.save']}</a>${navigator.share && navigator.canShare ? `<button class="plain-button share-image">${ui['ui.export.sharing']}</button>` : ''}</div><p>若浏览器未直接保存，可长按图片保存。</p></div>`;
    area.hidden = false;
    area.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    $('.export-actions a').onclick = () => toast(ui['ui.export.success']);
    $('.share-image')?.addEventListener('click', async () => {
      try { const file = new File([result.blob], result.filename, { type: 'image/png' }); await navigator.share({ files: [file] }); toast(ui['ui.export.success']); }
      catch (error) { if (error.name !== 'AbortError') toast(ui['ui.export.failed']); }
    });
  } catch (error) {
    if (error.name !== 'AbortError') { playSound('blocked-wood-knock'); toast(ui['ui.export.failed']); }
  } finally { exportController = null; button.disabled = false; button.textContent = ui['ui.case.export']; }
}
function render() {
  const current = route();
  if (sceneHandle) { sceneHandle.destroy(); sceneHandle = null; }
  if (exportController) { exportController.abort(); exportController = null; }
  if (current === 'entry') renderEntry();
  else if (current === 'profession') renderProfessions();
  else if (current === 'roles') renderRoles();
  else if (current === 'scenes') renderScenes();
  else if (current === 'scene') renderScene();
  else if (current === 'library') renderLibrary();
  else if (current.startsWith('case/')) renderCase(current.slice(5));
  else navigate('entry');
}

document.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
window.addEventListener('popstate', () => {
  if (route() === 'scene') history.replaceState({ ...history.state, skipIntro: true }, '');
  render();
});
if (!location.hash) history.replaceState({}, '', '#/entry');
if (route() === 'scene' && performance.getEntriesByType('navigation')[0]?.type === 'reload') {
  history.replaceState({ ...history.state, skipIntro: true }, '');
}
render();
if (isTemporary()) setTimeout(() => toast(ui['ui.storage.temporary']), 500);
