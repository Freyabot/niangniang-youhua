// Every runtime resource stays local for the lifetime of this game session.
const resources = new Map(), images = new Map();
export const resourceStatus = { ready: false, count: 0, totalBytes: 0, downloadedBytes: 0, cacheHits: 0 };
export const assetUrl = url => resources.get(url)?.url || url;
export const paperAssets = {
  audition: './assets/ui/audition-slip.webp',
  dialogue: './assets/ui/dialogue-frame.webp',
  case: './assets/ui/case-paper.webp',
};
function decodeImage(url) {
  const image = new Image(); image.src = url;
  return image.decode().then(() => image);
}
export function loadImage(source) {
  const url = assetUrl(source);
  if (!images.has(url)) images.set(url, decodeImage(url).catch(error => { images.delete(url); throw error; }));
  return images.get(url);
}
export function loadImages(urls) { return Promise.all([...new Set(urls)].map(loadImage)); }
export async function prepareResources(manifest, onProgress) {
  const total = manifest.reduce((sum, item) => sum + item.bytes, 0);
  resourceStatus.totalBytes = total;
  const received = new Map();
  let prepared = 0, next = 0, stopped = false;
  const controller = new AbortController();
  let cache;
  try { cache = await caches.open('nyh-runtime-assets'); } catch { /* Private mode can use the session cache. */ }
  const report = () => {
    if (!stopped) onProgress({ bytes: [...received.values()].reduce((a, b) => a + b, 0), total, prepared, count: manifest.length });
  };
  const prepare = async item => {
    if (resources.has(item.url)) {
      received.set(item.url, item.bytes); prepared++; report(); return;
    }
    const key = new URL(item.file || item.url, location.href); key.searchParams.set('asset', item.hash);
    let response;
    try { response = await cache?.match(key.href); } catch { /* Continue without durable storage. */ }
    if (response && Number(response.headers.get('content-length')) !== item.bytes) response = null;
    const cached = !!response;
    const timeout = setTimeout(() => controller.abort(), 120000);
    let blob;
    try {
      response ||= await fetch(key, { signal: controller.signal });
      if (!response.ok) throw new Error(`Resource unavailable: ${item.url}`);
      const file = item.file || item.url;
      const type = file.endsWith('.mp3') ? 'audio/mpeg' : file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.webp') ? 'image/webp' : 'image/png';
      if (response.body?.getReader) {
        const reader = response.body.getReader(), chunks = [];
        let size = 0;
        while (true) {
          const { value, done } = await reader.read(); if (done) break;
          chunks.push(value); size += value.byteLength;
          received.set(item.url, Math.min(size, item.bytes)); report();
        }
        blob = new Blob(chunks, { type });
      } else blob = new Blob([await response.arrayBuffer()], { type });
      if (blob.size !== item.bytes) throw new Error(`Incomplete resource: ${item.url}`);
      const url = URL.createObjectURL(blob);
      try {
        if (!item.url.endsWith('.mp3')) images.set(url, Promise.resolve(await decodeImage(url)));
      } catch (error) { URL.revokeObjectURL(url); throw error; }
      resources.set(item.url, { url });
      if (cached) resourceStatus.cacheHits++;
      else {
        resourceStatus.downloadedBytes += blob.size;
        try { await cache?.put(key.href, new Response(blob, { headers: { 'content-type': type, 'content-length': String(blob.size) } })); } catch { /* Session cache remains available. */ }
      }
      received.set(item.url, item.bytes); resourceStatus.count = resources.size;
      prepared++; report();
    } finally { clearTimeout(timeout); }
  };
  try {
    await prepare(manifest.find(item => item.url.includes('loading-ensemble')));
    const queue = manifest.filter(item => !item.url.includes('loading-ensemble'));
    await Promise.all(Array.from({ length: Math.min(6, queue.length) }, async () => {
      while (!stopped && next < queue.length) await prepare(queue[next++]);
    }));
    for (const [name, source] of Object.entries(paperAssets)) document.documentElement.style.setProperty(`--paper-${name}`, `url("${assetUrl(source)}")`);
    resourceStatus.ready = true;
  } catch (error) { stopped = true; controller.abort(); throw error; }
}
export function watchImage(image) {
  image.src = assetUrl(image.getAttribute('src'));
}
