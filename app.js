const videoConfig = window.ARTEMIS_VIDEOS || {};
const placeholderContents = new Map();
function mountVideo(slot) {
  if (!placeholderContents.has(slot)) placeholderContents.set(slot, slot.innerHTML);
  const source = videoConfig[slot.dataset.video];
  slot.querySelectorAll('video').forEach(v => v.pause());
  slot.innerHTML = placeholderContents.get(slot);
  if (!source) return false;
  const video = document.createElement('video');
  video.controls = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = source;
  video.setAttribute('aria-label', slot.dataset.video.replaceAll('-', ' '));
  video.addEventListener('error', () => {
    slot.innerHTML = placeholderContents.get(slot);
    slot.querySelector('.slot-title').textContent = 'Video unavailable';
    slot.querySelector('.slot-note').textContent = 'Please try again later.';
  }, {once:true});
  slot.replaceChildren(video);
  return true;
}
document.querySelectorAll('[data-video]').forEach(mountVideo);
const scenarioNames = {opposing:'Opposing', following:'Following', crossing:'Turning & crossing'};
document.querySelectorAll('[data-scenario]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-scenario]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const scenario = button.dataset.scenario;
    let available = 0;
    document.querySelectorAll('#comparison-videos [data-video]').forEach(slot => {
      slot.dataset.video = slot.dataset.video.replace(/^comparison-(opposing|following|crossing)-/, `comparison-${scenario}-`);
      slot.setAttribute('aria-label', slot.dataset.video.replaceAll('-', ' '));
      if (mountVideo(slot)) available++;
    });
    document.getElementById('comparison-description').textContent = `${scenarioNames[scenario]} scenario · ${available ? 'Matched initial observations and action sequence' : 'Videos coming soon'}`;
  });
});
// Paired agent/camera streams and comparison clips share playback timing.
document.querySelectorAll('.demo-grid, .comparison-grid').forEach(group => {
  let syncing = false;
  group.addEventListener('play', event => {
    if (syncing || event.target.tagName !== 'VIDEO') return;
    syncing = true;
    group.querySelectorAll('video').forEach(video => {
      if (video !== event.target) {
        if (Math.abs(video.currentTime - event.target.currentTime) > .15) video.currentTime = event.target.currentTime;
        video.play().catch(() => {});
      }
    });
    queueMicrotask(() => { syncing = false; });
  }, true);
  group.addEventListener('pause', event => {
    if (syncing || event.target.tagName !== 'VIDEO') return;
    syncing = true;
    group.querySelectorAll('video').forEach(video => { if (video !== event.target) video.pause(); });
    queueMicrotask(() => { syncing = false; });
  }, true);
  group.addEventListener('seeked', event => {
    if (event.target.tagName !== 'VIDEO') return;
    group.querySelectorAll('video').forEach(video => {
      if (video !== event.target && Math.abs(video.currentTime - event.target.currentTime) > .15) video.currentTime = event.target.currentTime;
    });
  }, true);
});
const dialog = document.querySelector('.lightbox');
document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = document.getElementById('expanded-figure');
    expanded.src = button.dataset.figure;
    expanded.alt = button.querySelector('img').alt;
    dialog.showModal();
  });
});
document.getElementById('close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
