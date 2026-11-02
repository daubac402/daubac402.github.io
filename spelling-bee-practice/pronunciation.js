const PRONUNCIATION_CONFIG = {
  dictionaryApiUrl: "https://api.dictionaryapi.dev/api/v2/entries/en/",
  fetchTimeoutMs: 6000,
  audioEndFallbackMs: 6000,
};

const wordAudioCache = new Map();
let activeAudio = null;

function pickBestAudioUrl(phonetics) {
  const withAudio = phonetics.filter((entry) => entry.audio);
  const usAudio = withAudio.find((entry) => /-us\.mp3/i.test(entry.audio));
  if (usAudio) return usAudio.audio;

  const ukAudio = withAudio.find((entry) => /-uk\.mp3/i.test(entry.audio));
  if (ukAudio) return ukAudio.audio;

  return withAudio[0]?.audio ?? null;
}

async function fetchWordAudioUrl(word) {
  const key = word.toLowerCase();
  if (wordAudioCache.has(key)) return wordAudioCache.get(key);

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), PRONUNCIATION_CONFIG.fetchTimeoutMs);

  try {
    const response = await fetch(`${PRONUNCIATION_CONFIG.dictionaryApiUrl}${encodeURIComponent(key)}`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      wordAudioCache.set(key, null);
      return null;
    }

    const entries = await response.json();
    const phonetics = entries.flatMap((entry) => entry.phonetics ?? []);
    const audioUrl = pickBestAudioUrl(phonetics);
    wordAudioCache.set(key, audioUrl);
    return audioUrl;
  } catch {
    wordAudioCache.set(key, null);
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function stopPronunciationAudio() {
  if (!activeAudio) return;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

function playPronunciationUrl(url, isActive) {
  return new Promise((resolve) => {
    stopPronunciationAudio();
    if (!url || !isActive()) {
      resolve(false);
      return;
    }

    const audio = new Audio();
    audio.preload = "auto";
    audio.src = url;
    activeAudio = audio;

    let finished = false;
    const finish = (played) => {
      if (finished) return;
      finished = true;
      if (activeAudio === audio) activeAudio = null;
      resolve(played);
    };

    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);

    let playbackStarted = false;
    const startPlayback = () => {
      if (playbackStarted || finished) return;
      playbackStarted = true;
      if (!isActive()) {
        finish(false);
        return;
      }
      audio.play().then(() => {}).catch(() => finish(false));
    };

    audio.addEventListener("canplaythrough", startPlayback, { once: true });
    audio.load();

    window.setTimeout(() => {
      if (!finished && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        startPlayback();
      }
    }, 300);

    window.setTimeout(() => {
      if (!finished && audio.paused) finish(false);
    }, PRONUNCIATION_CONFIG.audioEndFallbackMs);
  });
}

function unlockAudioPlayback() {
  const silent = new Audio();
  silent.src =
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
  return silent.play().catch(() => {});
}

window.SpellingPronunciation = {
  fetchWordAudioUrl,
  playPronunciationUrl,
  stopPronunciationAudio,
  unlockAudioPlayback,
};
