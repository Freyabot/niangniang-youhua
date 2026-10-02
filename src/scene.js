import { scenes, roles, openings, monologues, quotes, sceneHotspots, ui } from './content.js?v=1.25';
import { actors, foregroundActors, hotspots, imageSize, propArt, roleStateArt, sceneArt, sceneOccluders, bustArt, doorArt } from './game-data.js?v=1.25';
import { getState, updateState, quoteId, collect, hasQuote } from './store.js?v=1.25';
import { playSound, setDucked, setMusicContext, stopEffect } from './audio.js?v=1.25';
import { assetUrl } from './assets.js?v=1.25';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function mountScene(host, { onBack, onLibrary, onCase, onSwitchRole, onToast, skipIntro = false }) {
  const state = getState(), scene = state.scene, profession = state.profession;
  if (!scene || !profession || !state.role) return onBack();
  let role = state.role, alive = true, dialogue = null, acting = null, introBusy = true, introAdvance = null;
  let zoom = 1, pan = 0, pointerStart = null, pinch = null, hintQueue = [], lastHint = null;
  let foundVisual = null, visualPending = null, pendingWasFound = false, completion = false, visitMonologues = new Set();
  const art = sceneArt[scene];

  host.innerHTML = `
    <section class="scene-page" aria-label="${scenes[scene].palaceName}">
      <div class="scene-topbar">
        <button class="icon-button scene-back" aria-label="返回选场景">‹</button>
        <div class="scene-title"><small>${scenes[scene].workName}</small><strong>${scenes[scene].palaceName}</strong></div>
        <button class="icon-button scene-library" aria-label="案卷库">卷</button>
      </div>
      <div class="scene-viewport" role="group" aria-label="可左右探索的宫廷场景">
        <div class="scene-world"><img class="scene-background" src="${art.background}" alt="" draggable="false"/><div class="scene-objects"></div></div>
        <div class="scene-shade"></div><img class="scene-miss" src="${assetUrl('./assets/ui/wrong-hotspot.svg')}" alt="" aria-hidden="true"/>
        <div class="scene-intro" hidden></div>
        <div class="scene-bottom">
          <div class="scene-tools"><button class="plain-button scene-hint">提灯一照</button><button class="plain-button scene-switch">换位主子</button><button class="plain-button scene-sound" aria-label="声音开关">音</button></div>
          <div class="scene-progress">已寻得 0 / 5</div>
          <p class="scene-guide" hidden>${ui['ui.scene.first_guide']}</p>
          <div class="scene-dialogue" hidden></div>
          <div class="scene-complete" hidden></div>
        </div>
      </div>
    </section>`;
  const $ = sel => host.querySelector(sel);
  const viewport = $('.scene-viewport'), world = $('.scene-world'), objects = $('.scene-objects');
  const intro = $('.scene-intro'), dialogueEl = $('.scene-dialogue'), guide = $('.scene-guide');
  const progressEl = $('.scene-progress'), completeEl = $('.scene-complete');
  const shade = $('.scene-shade');
  const currentHotspots = () => [...sceneHotspots[scene].shared, sceneHotspots[scene].exclusive[role]];
  const actualHolder = h => {
    const p = hotspots[scene][h];
    if (scene !== 'review' || sceneHotspots.review.exclusive[role] !== h) return p.mergeActor;
    return foregroundActors(scene, role)
      .filter(a => !a.current && roles[a.id]?.playable)
      .sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0]?.id;
  };
  const quoteFor = hotspot => quoteId(profession, scene, role, hotspot);
  const count = () => currentHotspots().filter(h => hasQuote(quoteFor(h))).length;
  const screenScale = () => viewport.clientHeight / imageSize.height;
  const maxPan = () => Math.max(0, (imageSize.width * screenScale() * zoom - viewport.clientWidth) / 2);
  const clampPan = () => { pan = Math.max(-maxPan(), Math.min(maxPan(), pan)); world.style.setProperty('--pan', `${pan}px`); world.style.setProperty('--zoom', zoom); };
  const updateProgress = () => {
    const n = count(), shown = n - (visualPending && !pendingWasFound ? 1 : 0);
    progressEl.textContent = ui['ui.scene.progress'].replace('{current}', shown).replace('{total}', 5);
    $('.scene-hint').textContent = n === 5 ? ui['ui.scene.hint_complete'] : ui['ui.scene.hint'];
    $('.scene-hint').disabled = n === 5 || !!dialogue || introBusy;
  };
  const placement = (x, y, w, h) => `left:${x / imageSize.width * 100}%;top:${y / imageSize.height * 100}%;width:${w / imageSize.width * 100}%;height:${h / imageSize.height * 100}%;`;
  const polygon = points => `polygon(${points.map(([x, y]) => `${x / imageSize.width * 100}% ${y / imageSize.height * 100}%`).join(',')})`;

  function actorState(a, active = foundVisual) {
    if (!active) return 'idle';
    if (a.id === role) return sceneHotspots[scene].exclusive[role] === active ? 'action' : 'pressure';
    if (scene === 'review' && actualHolder(active) === a.id) return 'action';
    if (scene === 'review' && ['zhenhuan','huafei','anlingrong','jingxi','songzhi'].includes(a.id) && sceneHotspots.review.shared.includes(active)) return 'pressure';
    if (a.id === 'huangshang') {
      if (['new_decree','clothing_overspend','third_tea'].includes(active)) return 'action';
      if (['ritual_v8','total_ledger'].includes(active)) return 'pressure';
    }
    if (a.id === 'empress' && active === 'empress_rule') return 'action';
    if (a.id === 'jianqiu' && active === 'empress_rule') return 'action';
    if (a.id === 'supeisheng' && ['auspicious_time','new_decree','receipt_booklets'].includes(active)) return active === 'new_decree' ? 'action' : 'pressure';
    return 'idle';
  }

  function renderObjects(returnFrom = null) {
    const fixed = Object.entries(actors[scene]).map(([id, a]) => ({ id, ...a }));
    const people = [...fixed, ...foregroundActors(scene, role)];
    const personHtml = people.map(a => {
      const w = a.h * 0.85;
      const state = actorState(a), old = state === 'idle' && returnFrom ? actorState(a, returnFrom) : 'idle';
      return `<div class="scene-actor ${a.current ? 'current' : ''} ${state !== 'idle' ? 'reacting' : ''}" data-actor="${a.id}" data-state="${state}" style="${placement(a.x - w / 2, a.y - a.h, w, a.h)}z-index:${a.depth};${a.crop ? `clip-path:${a.crop};` : ''}"><img class="actor-idle" src="${roleStateArt(a.id)}" alt="" draggable="false"/>${state !== 'idle' ? `<img class="actor-result" src="${roleStateArt(a.id, state)}" alt="" draggable="false"/>` : old !== 'idle' ? `<img class="actor-exit" src="${roleStateArt(a.id, old)}" alt="" draggable="false"/>` : ''}</div>`;
    }).join('');
    const handHtml = people.filter(a => a.handMask).map(a => {
      const w = a.h * 0.85, state = actorState(a), old = state === 'idle' && returnFrom ? actorState(a, returnFrom) : 'idle';
      const style = `${placement(a.x - w / 2, a.y - a.h, w, a.h)}clip-path:${a.handMask};z-index:${a.depth + 2}`;
      return `<img class="scene-hand ${state === 'idle' ? '' : 'departing'}" src="${roleStateArt(a.id)}" alt="" draggable="false" style="${style}"/>${state !== 'idle' ? `<img class="scene-hand arriving" src="${roleStateArt(a.id, state)}" alt="" draggable="false" style="${style}"/>` : old !== 'idle' ? `<img class="scene-hand exiting" src="${roleStateArt(a.id, old)}" alt="" draggable="false" style="${style}"/>` : ''}`;
    }).join('');
    const propHtml = currentHotspots().map(h => {
      const p = hotspots[scene][h], isFound = hasQuote(quoteFor(h));
      const settled = isFound && (visualPending !== h || pendingWasFound);
      const mergeActor = actualHolder(h);
      const holder = people.find(a => a.id === mergeActor);
      const depth = holder?.depth > 20 ? holder.depth + 1 : p.depth;
      return `<button type="button" class="scene-prop ${settled ? 'found' : ''} ${foundVisual === h ? 'active' : ''}" data-hotspot="${h}" data-motion="${p.motion}" ${mergeActor ? `data-merge-actor="${mergeActor}"` : ''} aria-label="${p.label}" style="${placement(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h)}z-index:${depth}"><img src="${propArt(scene, h, settled ? 'found' : 'idle')}" alt="" draggable="false"/>${settled ? '<span class="found-mark">已寻得</span>' : ''}</button>`;
    }).join('');
    const occluderHtml = sceneOccluders[scene].map(points => `<img class="scene-occluder" src="${art.background}" alt="" draggable="false" style="clip-path:${polygon(points)}"/>`).join('');
    objects.innerHTML = personHtml + propHtml + handHtml + occluderHtml;
    updateProgress();
  }

  function closeDialogue() {
    const previous = foundVisual;
    dialogue = null; foundVisual = null; dialogueEl.hidden = true; shade.classList.remove('visible');
    setDucked(false); renderObjects(previous);
    if (completion) showCompletion();
  }
  function showDialogue(h) {
    if (!alive) return;
    const id = quoteFor(h), q = quotes[id];
    if (!q) return onToast('此句暂不可查');
    dialogue = id; foundVisual = h; visualPending = null; updateProgress();
    const prop = objects.querySelector(`[data-hotspot="${h}"]`);
    if (prop) {
      prop.classList.remove('revealing'); prop.classList.add('found');
      if (prop.dataset.mergeActor) prop.classList.add('merged');
      const image = prop.querySelector('img'); if (image) image.src = propArt(scene, h, 'found');
      if (!prop.querySelector('.found-mark')) prop.insertAdjacentHTML('beforeend', '<span class="found-mark">已寻得</span>');
    }
    shade.classList.add('visible'); setDucked(true);
    dialogueEl.innerHTML = `<span class="dialogue-continue">点击任意空白处继续</span><img src="${bustArt(role)}" alt=""/><button class="dialogue-paper" type="button" aria-label="翻看案卷"><span class="dialogue-name">${roles[role].name} · ${roles[role].rank}</span><span class="dialogue-text">${q.text}</span><span class="dialogue-link">${ui['ui.dialogue.open_case']}</span></button>`;
    dialogueEl.hidden = false;
    $('.scene-hint').disabled = true;
  }
  function showCompletion() {
    if (!completion || dialogue || !alive) return;
    completion = false;
    completeEl.innerHTML = `<div class="complete-paper"><p>${ui['ui.scene.complete']}</p><button data-complete="library">${ui['ui.scene.open_library']}</button><button data-complete="switch">${ui['ui.scene.switch_role']}</button><button data-complete="close" aria-label="关闭">×</button></div>`;
    completeEl.hidden = false;
  }
  async function trigger(h) {
    if (introBusy || !currentHotspots().includes(h) || acting?.hotspot === h) return;
    if (introBusy || !currentHotspots().includes(h)) return;
    if (acting?.hotspot === h) return;
    if (acting) { acting.timers.forEach(clearTimeout); acting = null; stopEffect(); }
    if (dialogue) { dialogueEl.hidden = true; dialogue = null; }
    completeEl.hidden = true;
    const id = quoteFor(h), first = collect(id);
    if (first && count() === 5) completion = true;
    visualPending = h; pendingWasFound = !first; foundVisual = h; renderObjects();
    playSound('correct');
    const p = hotspots[scene][h];
    const duration = reduced() ? 0 : first ? 1120 : 680;
    const prop = objects.querySelector(`[data-hotspot="${h}"]`);
    prop?.classList.add('revealing');
    const timers = [];
    if (duration) {
      const image = prop?.querySelector('img');
      if (image) image.src = propArt(scene, h, 'action-01');
      timers.push(setTimeout(() => {
        if (acting?.hotspot !== h) return;
        if (image) image.src = propArt(scene, h, 'action-02');
        playSound(p.sound);
      }, Math.min(360, duration * .4)));
      timers.push(setTimeout(() => { if (acting?.hotspot === h && image) image.src = propArt(scene, h, 'found'); }, Math.min(800, duration * .8)));
    }
    timers.push(setTimeout(() => {
      if (!alive || acting?.hotspot !== h) return;
      acting = null;
      if (first) playSound('seal-stamp');
      showDialogue(h);
    }, duration));
    acting = { hotspot: h, timers };
  }
  function showMiss(x, y) {
    const miss = $('.scene-miss'); miss.style.left = `${x}px`; miss.style.top = `${y}px`;
    miss.classList.remove('run'); void miss.offsetWidth; miss.classList.add('run');
    playSound('blocked-wood-knock');
  }
  function dismissGuide() { guide.hidden = true; }

  function hint() {
    if (introBusy || dialogue || count() === 5) return;
    dismissGuide();
    const remaining = currentHotspots().filter(h => !hasQuote(quoteFor(h)));
    hintQueue = hintQueue.filter(h => remaining.includes(h));
    if (!hintQueue.length) hintQueue = remaining.sort(() => Math.random() - .5);
    let h = hintQueue.shift();
    if (h === lastHint && hintQueue.length) { hintQueue.push(h); h = hintQueue.shift(); }
    lastHint = h;
    const p = hotspots[scene][h];
    const target = (imageSize.width / 2 - p.x) * screenScale() * zoom;
    pan = Math.max(-maxPan(), Math.min(maxPan(), target)); clampPan();
    const el = objects.querySelector(`[data-hotspot="${h}"]`);
    el?.classList.add('hinted'); setTimeout(() => el?.classList.remove('hinted'), 1500);
    playSound('lantern-light');
  }

  async function showMonologue() {
    if (visitMonologues.has(role) || !alive) { introBusy = false; updateProgress(); return; }
    visitMonologues.add(role);
    const text = monologues[`monologue.${profession}.${scene}.${role}`];
    if (!text) { introBusy = false; updateProgress(); return; }
    intro.innerHTML = `<div class="thought-bubble">${text}</div><span class="intro-continue">点击任意空白处继续</span>`;
    intro.hidden = false; setDucked(true);
    await waitIntroAdvance();
    if (!alive) return;
    intro.hidden = true; introBusy = false; setDucked(false); updateProgress();
    guide.hidden = false;
  }
  function waitIntroAdvance() {
    return new Promise(resolve => {
      const finish = () => {
        intro.removeEventListener('click', finish);
        intro.removeEventListener('keydown', onKey);
        intro.tabIndex = -1;
        introAdvance = null;
        resolve();
      };
      const onKey = e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); }
      };
      introAdvance = finish;
      intro.tabIndex = 0;
      intro.addEventListener('click', finish);
      intro.addEventListener('keydown', onKey);
      intro.focus({ preventScroll: true });
    });
  }
  async function runIntro() {
    setMusicContext('scene');
    introBusy = true; updateProgress();
    intro.innerHTML = `<div class="door-transition"><img class="door-left" src="${doorArt(art.door, 'left')}" alt=""/><img class="door-right" src="${doorArt(art.door, 'right')}" alt=""/><img class="door-frame" src="${doorArt(art.door, 'frame')}" alt=""/></div>`;
    intro.hidden = false; playSound('palace-door-open');
    await wait(reduced() ? 80 : 920);
    if (!alive) return;
    const opening = openings[scene];
    if (opening) {
      intro.innerHTML = `<p class="opening-narration">${opening}</p><span class="intro-continue">点击任意空白处继续</span>`;
      await waitIntroAdvance();
    }
    if (!alive) return;
    intro.hidden = true; await showMonologue();
  }

  // Pointer movement and prop hit testing share the same transformed world.
  viewport.addEventListener('pointerdown', e => {
    if (introBusy || e.target.closest('.scene-bottom,.scene-topbar')) return;
    if (e.pointerType === 'touch' && e.isPrimary === false) {
      const points = [...(viewport._touches || new Map()).values()];
      if (points.length) pinch = { x: points[0].x, y: points[0].y, distance: Math.hypot(points[0].x - e.clientX, points[0].y - e.clientY), zoom };
    }
    viewport.setPointerCapture(e.pointerId);
    viewport._touches ??= new Map(); viewport._touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pointerStart = { x: e.clientX, y: e.clientY, pan, target: e.target.closest('[data-hotspot]'), moved: false };
  });
  viewport.addEventListener('pointermove', e => {
    if (!pointerStart) return;
    viewport._touches?.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && viewport._touches?.size >= 2) {
      const [a, b] = [...viewport._touches.values()];
      zoom = Math.max(1, Math.min(1.3, pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance)); clampPan(); pointerStart.moved = true; return;
    }
    const dx = e.clientX - pointerStart.x, dy = e.clientY - pointerStart.y;
    if (Math.hypot(dx, dy) > 8) pointerStart.moved = true;
    if (pointerStart.moved) { pan = pointerStart.pan + dx; clampPan(); dismissGuide(); }
  });
  viewport.addEventListener('pointerup', e => {
    viewport._touches?.delete(e.pointerId); if (viewport._touches?.size < 2) pinch = null;
    if (!pointerStart) return;
    const tap = !pointerStart.moved && Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) <= 8;
    const target = pointerStart.target; pointerStart = null;
    if (!tap || introBusy) return;
    dismissGuide();
    if (target?.dataset.hotspot) trigger(target.dataset.hotspot);
    else if (dialogue) closeDialogue();
    else { const box = viewport.getBoundingClientRect(); showMiss(e.clientX - box.left, e.clientY - box.top); }
  });
  viewport.addEventListener('pointercancel', e => { viewport._touches?.delete(e.pointerId); pointerStart = null; pinch = null; });
  viewport.addEventListener('dblclick', () => { zoom = 1; pan = 0; clampPan(); });
  window.addEventListener('resize', clampPan);

  $('.scene-back').onclick = () => { stopEffect(); onBack(); };
  $('.scene-library').onclick = () => { stopEffect(); onLibrary(); };
  $('.scene-hint').onclick = hint;
  $('.scene-switch').onclick = () => { stopEffect(); onSwitchRole(role); };
  dialogueEl.onclick = () => { if (dialogue) onCase(dialogue); };
  completeEl.onclick = e => {
    const action = e.target.dataset.complete;
    if (action === 'library') onLibrary(); else if (action === 'switch') onSwitchRole(role); else if (action === 'close') completeEl.hidden = true;
  };
  renderObjects(); clampPan();
  if (skipIntro) { introBusy = false; setMusicContext('scene'); updateProgress(); }
  else runIntro();
  return {
    async switchRole(next) {
      if (!alive || next === role) return;
      if (!alive) return;
      if (acting) { acting.timers.forEach(clearTimeout); acting = null; }
      stopEffect(); dialogue = null; foundVisual = null; visualPending = null; dialogueEl.hidden = true; completeEl.hidden = true; shade.classList.remove('visible');
      role = next; updateState({ role: next, lastRole: next });
      introBusy = true;
      hintQueue = []; lastHint = null; zoom = 1; pan = 0; clampPan(); renderObjects();
      showMonologue();
    },
    destroy() { alive = false; introAdvance?.(); if (acting) acting.timers.forEach(clearTimeout); stopEffect(); setDucked(false); window.removeEventListener('resize', clampPan); },
  };
}
