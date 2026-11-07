const WORD_IMAGE_CONFIG = {
  apiUrl: "https://en.wikipedia.org/w/api.php",
  thumbSize: 500,
  cacheKey: "spellingBee.wordImages.v2",
  cacheTtlMs: 14 * 24 * 60 * 60 * 1000,
  requestTimeoutMs: 7000,
  minRequestGapMs: 900,
};

// Fallback pictures that work offline. Used when Wikipedia has no photo for a word.
const WORD_EMOJI = {
  cat: "🐱",
  dog: "🐶",
  hat: "🎩",
  sun: "☀️",
  run: "🏃",
  fun: "🎉",
  bed: "🛏️",
  red: "🔴",
  pen: "🖊️",
  hen: "🐔",
  pig: "🐷",
  big: "🐘",
  dig: "⛏️",
  log: "🪵",
  fog: "🌫️",
  bug: "🐛",
  mug: "☕",
  cup: "🥤",
  map: "🗺️",
  cap: "🧢",
  tap: "🚰",
  nap: "😴",
  lap: "🦵",
  top: "🔝",
  pop: "🎈",
  mop: "🧹",
  hop: "🐰",
  box: "📦",
  fox: "🦊",
  mix: "🥣",
  fix: "🔧",
  six: "6️⃣",
  wax: "🕯️",
  jam: "🍓",
  ham: "🍖",
  ram: "🐏",
  yam: "🍠",
  web: "🕸️",
  leg: "🦵",
  peg: "📌",
  egg: "🥚",
  jet: "✈️",
  wet: "💧",
  net: "🥅",
  pet: "🐾",
  set: "🧩",
  get: "🤲",
  let: "🕊️",
  met: "🤝",
  bet: "🎲",
  hot: "🔥",
  pot: "🍲",
  lot: "🅿️",
  dot: "⚫",
  cot: "🛏️",
  not: "🚫",
  got: "🤲",
  boy: "👦",
  toy: "🧸",
  joy: "😊",
  car: "🚗",
  bar: "🍫",
  far: "🔭",
  jar: "🫙",
  tar: "🛢️",
  war: "⚔️",
  bay: "🌊",
  day: "📅",
  may: "🌸",
  say: "💬",
  way: "🛣️",
  pay: "💳",
  ray: "✨",
  key: "🔑",
  sky: "🌤️",
  fly: "🪰",
  cry: "😢",
  try: "💪",
  dry: "🏜️",
  why: "❓",
  zoo: "🦁",
  too: "➕",
  two: "2️⃣",
  you: "👤",
  new: "✨",
  few: "🔢",
  dew: "💧",
  bee: "🐝",
  see: "👀",
  sea: "🌊",
  tea: "🍵",
  pea: "🫛",
  pie: "🥧",
  tie: "👔",
  die: "🎲",
  lie: "🤥",
  gum: "🍬",
  rum: "🥃",
  sum: "➕",
  hum: "🎵",
  bus: "🚌",
  cut: "✂️",
  nut: "🥜",
  hut: "🛖",
  but: "🔄",
  rug: "🧶",
  hug: "🤗",
  jug: "🫗",
  mud: "🟤",
  bud: "🌱",
  pad: "📝",
  bad: "👎",
  sad: "😢",
  mad: "😠",
  dad: "👨",
  had: "✅",
  kid: "🧒",
  lid: "🥫",
  rid: "🗑️",
  bid: "💰",
  win: "🏆",
  pin: "📌",
  tin: "🥫",
  bin: "🗑️",
  fin: "🐟",
  kin: "👪",
  arm: "💪",
  art: "🎨",
  ant: "🐜",
  act: "🎭",
  add: "➕",
  and: "➕",
  all: "💯",
  ask: "🙋",
  ate: "🍽️",
  air: "🌬️",
  aim: "🎯",
  age: "🎂",
  eat: "🍽️",
  end: "🔚",
  elf: "🧝",
  elk: "🦌",
  elm: "🌳",
  eve: "🌙",
  eye: "👁️",
  ice: "🧊",
  ink: "🖋️",
  inn: "🏨",
  job: "💼",
  jog: "🏃",
  jot: "✍️",
  law: "⚖️",
  low: "⬇️",
  oil: "🛢️",
  old: "👴",
  one: "1️⃣",
  ore: "🪨",
  our: "👥",
  out: "🚪",
  owl: "🦉",
  own: "🔑",
  owe: "💸",
  pit: "🕳️",
  raw: "🥩",
  row: "🚣",
  rub: "🤲",
  saw: "🪚",
  sip: "🥤",
  sir: "🎩",
  sit: "🪑",
  son: "👦",
  tab: "📑",
  tag: "🏷️",
  tan: "🏖️",
  ten: "🔟",
  tip: "💡",
  toe: "🦶",
  ton: "🏋️",
  tub: "🛁",
  tug: "🪢",
  van: "🚐",
  vat: "🛢️",
  vet: "🩺",
  via: "➡️",
  vie: "🥊",
  vow: "🤞",
  wag: "🐕",
  was: "⏳",
  wig: "💇",
  wit: "🧠",
  woe: "😩",
  wok: "🍳",
  won: "🏆",
  wow: "😲",
  yak: "🐂",
  yap: "🗣️",
  yes: "✅",
  yet: "⏳",
  zip: "🤐",
  zit: "😣",
};

// Many 3-letter words are disambiguation pages on Wikipedia. These aliases point
// at an article whose lead photo clearly shows the word's meaning.
const WIKI_TITLE_ALIASES = {
  act: "Actor",
  age: "Old age",
  air: "Atmosphere of Earth",
  aim: "Bullseye (target)",
  bar: "Chocolate bar",
  bid: "Gavel",
  big: "Elephant",
  bin: "Waste container",
  bug: "Insect",
  cap: "Baseball cap",
  cot: "Camp bed",
  cry: "Crying",
  cut: "Cutting",
  dad: "Father",
  day: "Daytime",
  die: "Dice",
  dig: "Digging",
  dot: "Circle",
  dry: "Desert",
  eat: "Food",
  eve: "Christmas Eve",
  fix: "Maintenance",
  gum: "Chewing gum",
  hen: "Chicken",
  hop: "Kangaroo",
  hot: "Fire",
  jam: "Fruit preserves",
  jet: "Jet aircraft",
  job: "Construction worker",
  jog: "Jogging",
  key: "Lock and key",
  kid: "Child",
  kin: "Kinship",
  log: "Wood",
  lot: "Parking lot",
  mad: "Anger",
  met: "Meeting",
  mix: "Mixer (appliance)",
  net: "Fishing net",
  nut: "Nut (fruit)",
  oil: "Olive oil",
  old: "Old age",
  pad: "Notebook",
  pay: "Payment",
  peg: "Clothespin",
  pit: "Hole",
  pop: "Soft drink",
  pot: "Cooking pot",
  ram: "Sheep",
  row: "Rowing",
  rub: "Massage",
  rug: "Carpet",
  run: "Jogging",
  sad: "Crying",
  sir: "Knight",
  sit: "Sitting",
  son: "Family",
  tag: "Label",
  tap: "Tap (valve)",
  tie: "Necktie",
  tip: "Finger",
  top: "Spinning top",
  tug: "Tugboat",
  tub: "Bathtub",
  vat: "Barrel",
  vet: "Veterinarian",
  vie: "Competition",
  vow: "Wedding",
  wag: "Dog",
  way: "Road",
  web: "Spider web",
  win: "Trophy",
  won: "Trophy",
  yam: "Yam (vegetable)",
  yes: "Thumb signal",
  zip: "Zipper",
};

// Words where a photo would be confusing, unsafe, or simply unavailable.
// These use the emoji fallback instead of calling Wikipedia.
const NO_PHOTO_WORDS = new Set([
  "add",
  "all",
  "and",
  "ask",
  "bad",
  "bet",
  "but",
  "end",
  "far",
  "few",
  "get",
  "got",
  "had",
  "hum",
  "jot",
  "let",
  "low",
  "new",
  "not",
  "one",
  "our",
  "out",
  "own",
  "raw",
  "ray",
  "rid",
  "rum",
  "say",
  "see",
  "set",
  "six",
  "sip",
  "sum",
  "tab",
  "tan",
  "ten",
  "too",
  "try",
  "two",
  "via",
  "war",
  "was",
  "wet",
  "why",
  "woe",
  "wow",
  "yet",
  "you",
  "zit",
]);

const imageCache = new Map();
const pendingRequests = new Map();
const readyListeners = new Map();
let cacheLoaded = false;
let lastRequestAt = 0;
let requestQueue = Promise.resolve();

function pause(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function loadCache() {
  if (cacheLoaded) return;
  cacheLoaded = true;
  try {
    const raw = window.localStorage.getItem(WORD_IMAGE_CONFIG.cacheKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    if (!parsed.savedAt || Date.now() - parsed.savedAt > WORD_IMAGE_CONFIG.cacheTtlMs) return;
    if (!parsed.entries || typeof parsed.entries !== "object") return;
    Object.keys(parsed.entries).forEach((word) => {
      imageCache.set(word, parsed.entries[word]);
    });
  } catch {
    // localStorage can be unavailable (private mode, blocked cookies, etc.).
  }
}

function saveCache() {
  try {
    const entries = {};
    imageCache.forEach((value, key) => {
      entries[key] = value;
    });
    window.localStorage.setItem(
      WORD_IMAGE_CONFIG.cacheKey,
      JSON.stringify({ savedAt: Date.now(), entries })
    );
  } catch {
    // Ignore storage errors.
  }
}

function emojiFor(word) {
  return WORD_EMOJI[word] || null;
}

function get(word) {
  loadCache();
  return imageCache.has(word) ? imageCache.get(word) : undefined;
}

function notifyReady(word, value) {
  const listeners = readyListeners.get(word);
  if (!listeners) return;
  readyListeners.delete(word);
  listeners.forEach((callback) => {
    try {
      callback(value);
    } catch {
      // Ignore listener errors.
    }
  });
}

function whenReady(word, callback) {
  loadCache();
  if (imageCache.has(word)) {
    callback(imageCache.get(word));
    return;
  }
  if (!readyListeners.has(word)) readyListeners.set(word, new Set());
  readyListeners.get(word).add(callback);
  ensure(word);
}

function resolveTitle(word) {
  return WIKI_TITLE_ALIASES[word] || word;
}

function buildApiUrl(title) {
  const params = new URLSearchParams({
    action: "query",
    prop: "pageimages",
    piprop: "thumbnail|name",
    pithumbsize: String(WORD_IMAGE_CONFIG.thumbSize),
    format: "json",
    origin: "*",
    redirects: "1",
    titles: title,
  });
  return `${WORD_IMAGE_CONFIG.apiUrl}?${params.toString()}`;
}

function parseImageInfo(data) {
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined || !page.thumbnail?.source) return null;

  const url = page.thumbnail.source.split("?")[0];
  const fileName = page.pageimage;
  if (fileName && /\.(svg|ogv|webm|ogg|mp4)$/i.test(fileName)) return null;

  const creditUrl = fileName
    ? `https://en.wikipedia.org/wiki/File:${encodeURIComponent(fileName.replace(/ /g, "_"))}`
    : `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`;

  return {
    url,
    creditUrl,
    creditLabel: "Photo: Wikipedia",
    title: page.title,
  };
}

async function fetchWordImage(word) {
  const title = resolveTitle(word);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    WORD_IMAGE_CONFIG.requestTimeoutMs
  );

  try {
    const response = await fetch(buildApiUrl(title), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return { failed: true };
    const data = await response.json();
    return parseImageInfo(data);
  } catch {
    return { failed: true };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function scheduleRequest(task) {
  const run = requestQueue.then(async () => {
    const remaining = Math.max(
      0,
      WORD_IMAGE_CONFIG.minRequestGapMs - (Date.now() - lastRequestAt)
    );
    if (remaining > 0) await pause(remaining);
    lastRequestAt = Date.now();
    return task();
  });
  requestQueue = run.catch(() => {});
  return run;
}

function ensure(word) {
  loadCache();
  if (NO_PHOTO_WORDS.has(word)) {
    imageCache.set(word, null);
    saveCache();
    notifyReady(word, null);
    return Promise.resolve(null);
  }
  if (imageCache.has(word)) return Promise.resolve(imageCache.get(word));
  if (pendingRequests.has(word)) return pendingRequests.get(word);

  const promise = scheduleRequest(() => fetchWordImage(word))
    .then((info) => {
      if (info?.failed) {
        pendingRequests.delete(word);
        notifyReady(word, null);
        return null;
      }
      imageCache.set(word, info);
      saveCache();
      pendingRequests.delete(word);
      notifyReady(word, info);
      return info;
    })
    .catch(() => {
      pendingRequests.delete(word);
      notifyReady(word, null);
      return null;
    });

  pendingRequests.set(word, promise);
  return promise;
}

function preload(word) {
  const info = get(word);
  if (!info?.url) return;
  const img = new Image();
  img.decoding = "async";
  img.src = info.url;
}

window.SpellingImages = {
  get,
  ensure,
  preload,
  emojiFor,
  whenReady,
  resolveTitle,
};
