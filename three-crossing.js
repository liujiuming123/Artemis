(() => {
  const videos = [...document.querySelectorAll('[data-three-crossing-video]')];
  if (!videos.length) return;
  const master = videos[0];
  const playButton = document.getElementById('three-crossing-play');
  const restart = document.getElementById('three-crossing-restart');
  const seek = document.getElementById('three-crossing-seek');
  const time = document.getElementById('three-crossing-time');
  const status = document.getElementById('three-crossing-status');
  let playing = false;
  let moving = false;
  let syncFrame;
  let lastSync = 0;
  const format = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  function update() {
    if (!moving) seek.value = String(master.currentTime);
    time.textContent = `${format(master.currentTime)} / ${format(master.duration || 10.125)}`;
  }
  function pauseAll() {
    playing = false;
    videos.forEach(video => video.pause());
    playButton.textContent = 'Play all';
    playButton.setAttribute('aria-label', 'Play all six three-agent crossing videos');
    cancelAnimationFrame(syncFrame);
    update();
  }
  function seekAll(value) {
    videos.forEach(video => { video.currentTime = Math.min(value, video.duration || value); });
    update();
  }
  function sync(now) {
    if (!playing) return;
    if (now - lastSync > 250 && !moving && !master.seeking) {
      videos.slice(1).forEach(video => {
        if (!video.seeking && Math.abs(video.currentTime - master.currentTime) > 0.15) video.currentTime = master.currentTime;
      });
      lastSync = now;
    }
    update();
    syncFrame = requestAnimationFrame(sync);
  }
  async function playAll() {
    playButton.disabled = true;
    if (master.currentTime >= master.duration - 0.05) seekAll(0);
    try {
      const startTime = master.currentTime;
      videos.forEach(video => { if (Math.abs(video.currentTime - startTime) > 0.05) video.currentTime = startTime; });
      await Promise.all(videos.map(video => video.play()));
      playing = true;
      playButton.textContent = 'Pause all';
      playButton.setAttribute('aria-label', 'Pause all six three-agent crossing videos');
      syncFrame = requestAnimationFrame(sync);
    } catch {
      pauseAll();
      status.textContent = 'Playback could not start. Please try Play all again.';
    } finally {
      playButton.disabled = false;
    }
  }
  playButton.addEventListener('click', () => playing ? pauseAll() : playAll());
  restart.addEventListener('click', () => { pauseAll(); seekAll(0); playAll(); });
  seek.addEventListener('input', () => { moving = true; seekAll(Number(seek.value)); });
  seek.addEventListener('change', () => { moving = false; update(); });
  master.addEventListener('ended', () => { pauseAll(); seekAll(0); playAll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
  videos.forEach(video => video.addEventListener('error', () => {
    pauseAll();
    status.textContent = 'A video could not be loaded. Please refresh this page.';
  }));
  const ready = video => video.readyState >= 2 ? Promise.resolve() : new Promise((resolve, reject) => {
    video.addEventListener('loadeddata', resolve, { once: true });
    video.addEventListener('error', reject, { once: true });
  });
  Promise.all(videos.map(ready)).then(() => {
    seek.max = String(master.duration);
    playButton.disabled = restart.disabled = seek.disabled = false;
    playButton.textContent = 'Play all';
    update();
  }).catch(() => {
    playButton.textContent = 'Videos unavailable';
    status.textContent = 'A video could not be loaded. Please refresh this page.';
  });
})();
