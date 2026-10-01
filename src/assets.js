// Share decoded images; failed requests remain retryable.
const images = new Map();
export function loadImage(url) {
  if (!images.has(url)) {
    const pending = new Promise((resolve, reject) => {
      const image = new Image();
      const timeout = setTimeout(() => { image.src = ''; reject(new Error('Image timeout')); }, 60000);
      image.onload = () => { clearTimeout(timeout); resolve(image); };
      image.onerror = () => { clearTimeout(timeout); reject(new Error(`Image unavailable: ${url}`)); };
      image.src = url;
    }).catch(error => { images.delete(url); throw error; });
    images.set(url, pending);
  }
  return images.get(url);
}
export async function loadImages(urls, progress = () => {}) {
  const queue = [...new Set(urls)];
  let done = 0, next = 0, failed = false;
  progress(done, queue.length);
  await Promise.all(Array.from({ length: Math.min(3, queue.length) }, async () => {
    while (!failed && next < queue.length) {
      try { await loadImage(queue[next++]); }
      catch (error) { failed = true; throw error; }
      if (!failed) progress(++done, queue.length);
    }
  }));
}
export function watchImage(image) {
  const parent = image.parentElement;
  const status = document.createElement('button');
  status.type = 'button'; status.className = 'image-status'; status.textContent = '画面加载中…'; status.disabled = true;
  parent.classList.add('image-host'); parent.append(status);
  const finish = () => { if (image.naturalWidth) { status.remove(); parent.classList.remove('image-host'); } };
  image.addEventListener('load', finish);
  image.addEventListener('error', () => { status.disabled = false; status.textContent = '图片未加载 · 点击重试'; });
  status.onclick = async event => {
    event.stopPropagation(); status.disabled = true; status.textContent = '正在重试…';
    try { await loadImage(image.getAttribute('src')); image.src = image.getAttribute('src'); finish(); }
    catch { status.disabled = false; status.textContent = '图片未加载 · 点击重试'; }
  };
  if (image.complete) { if (image.naturalWidth) finish(); else { status.disabled = false; status.textContent = '图片未加载 · 点击重试'; } }
}
