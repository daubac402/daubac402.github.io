const WORD_LENGTH = 3;

const RAW_WORDS = [
  "cat", "dog", "hat", "sun", "run", "fun", "bed", "red", "pen", "hen",
  "pig", "big", "dig", "log", "fog", "bug", "mug", "cup", "map", "cap",
  "tap", "nap", "lap", "top", "pop", "mop", "hop", "box", "fox", "mix",
  "fix", "six", "wax", "jam", "ham", "ram", "yam", "web", "leg", "peg",
  "egg", "jet", "wet", "net", "pet", "set", "get", "let", "met", "bet",
  "hot", "pot", "lot", "dot", "cot", "not", "got", "boy", "toy", "joy",
  "car", "bar", "far", "jar", "tar", "war", "bay", "day", "may", "say",
  "way", "pay", "ray", "key", "sky", "fly", "cry", "try", "dry", "why",
  "zoo", "too", "two", "you", "new", "few", "dew", "bee", "see", "sea",
  "tea", "pea", "pie", "tie", "die", "lie", "gum", "rum", "sum", "hum",
  "bus", "cut", "nut", "hut", "but", "rug", "hug", "jug", "mud", "bud",
  "pad", "bad", "sad", "mad", "dad", "had", "kid", "lid", "rid", "bid",
  "win", "pin", "tin", "bin", "fin", "kin", "arm", "art", "ant", "act",
  "add", "and", "all", "ask", "ate", "air", "aim", "age", "eat", "end",
  "elf", "elk", "elm", "eve", "eye", "ice", "ink", "inn", "job", "jog",
  "jot", "law", "low", "oil", "old", "one", "ore", "our", "out", "owl",
  "own", "owe", "pit", "raw", "row", "rub", "saw", "sip", "sir", "sit",
  "son", "tab", "tag", "tan", "ten", "tip", "toe", "ton", "tub", "tug",
  "van", "vat", "vet", "via", "vie", "vow", "wag", "was", "wig", "wit",
  "woe", "wok", "won", "wow", "yak", "yap", "yes", "yet", "zip", "zit",
];

const FEMALE_VOICE_NAME_PATTERNS = [
  /female/i,
  /samantha|karen|victoria|zira|jenny|aria|libby|sonia|serena|moira|tessa|fiona/i,
  /susan|kate|linda|heather|laura|sarah|allison|ava|emma|nicky|joanna|salli|kimberly/i,
];

const MALE_VOICE_NAME_PATTERNS = [
  /male/i,
  /\b(david|mark|guy|ryan|daniel|james|fred|ralph|tom|aaron|nathan|richard|george|alex)\b/i,
];

const CONFIG = {
  wordLength: WORD_LENGTH,
  nextProblemDelayMs: 2800,
  speechRate: 0.76,
  speechWordRate: 0.72,
  speechPitch: 1,
  speechPauseBetweenMs: 450,
  speechEndFallbackMs: 8000,
  speechCancelDelayMs: 50,
  voicesWaitMs: 800,
  keyboardLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  words: RAW_WORDS.filter(
    (word, index, list) => word.length === WORD_LENGTH && list.indexOf(word) === index
  ),
};

const MESSAGES = {
  promptOnScreen: "Can you spell this word?",
  promptAfterWord: "Can you spell this word?",
  promptFullSpoken: (word) => `Can you spell ${word}?`,
  correct: "That's correct!",
  wrong: "Nice try!",
  answerReveal: (word) => `The answer is ${word.toUpperCase()}.`,
};

const state = {
  currentWord: "",
  chosenLetters: [],
  score: { correct: 0, total: 0 },
  locked: false,
  lastWord: "",
  speakToken: 0,
  preferredVoice: null,
  revealedWord: "",
};

const dom = {
  promptText: document.getElementById("promptText"),
  letterSlots: document.getElementById("letterSlots"),
  feedback: document.getElementById("feedback"),
  keyboard: document.getElementById("keyboard"),
  checkBtn: document.getElementById("checkBtn"),
  clearBtn: document.getElementById("clearBtn"),
  hearAgain: document.getElementById("hearAgain"),
  score: document.getElementById("score"),
  app: document.querySelector(".app"),
  startScreen: document.getElementById("startScreen"),
  startBtn: document.getElementById("startBtn"),
  answerOkBtn: document.getElementById("answerOkBtn"),
  answerCard: document.getElementById("answerCard"),
  answerMedia: document.getElementById("answerMedia"),
  answerImage: document.getElementById("answerImage"),
  answerEmoji: document.getElementById("answerEmoji"),
  answerWord: document.getElementById("answerWord"),
  answerCredit: document.getElementById("answerCredit"),
};

function pickRandomWord() {
  const pool = CONFIG.words.filter((w) => w !== state.lastWord);
  const list = pool.length > 0 ? pool : CONFIG.words;
  return list[Math.floor(Math.random() * list.length)];
}

function isSpeechActive(token) {
  return token === state.speakToken;
}

function waitForVoices() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      resolve([]);
      return;
    }
    const existing = synth.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }
    const onVoices = () => {
      synth.removeEventListener("voiceschanged", onVoices);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", onVoices);
    window.setTimeout(() => resolve(synth.getVoices()), CONFIG.voicesWaitMs);
  });
}

function scoreVoice(voice) {
  const name = voice.name;
  let points = 0;

  if (FEMALE_VOICE_NAME_PATTERNS.some((pattern) => pattern.test(name))) points += 120;
  if (MALE_VOICE_NAME_PATTERNS.some((pattern) => pattern.test(name))) points -= 80;

  if (/natural|neural|enhanced|premium/i.test(name)) points += 40;
  if (/google us english/i.test(name)) points += 25;
  if (voice.lang.toLowerCase() === "en-us") points += 10;
  else if (voice.lang.toLowerCase().startsWith("en")) points += 5;

  return points;
}

function pickBestEnglishVoice(voices) {
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const ranked = english
    .map((voice) => ({ voice, points: scoreVoice(voice) }))
    .sort((a, b) => b.points - a.points);

  return ranked[0]?.voice ?? voices[0] ?? null;
}

async function ensurePreferredVoice() {
  if (state.preferredVoice) return state.preferredVoice;
  const voices = await waitForVoices();
  state.preferredVoice = pickBestEnglishVoice(voices);
  return state.preferredVoice;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function stopAllSound() {
  state.speakToken += 1;
  window.SpellingPronunciation.stopPronunciationAudio();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function speakLine(text, token, options = {}) {
  return new Promise((resolve) => {
    if (!isSpeechActive(token) || !window.speechSynthesis) {
      resolve();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? CONFIG.speechRate;
    utterance.pitch = options.pitch ?? CONFIG.speechPitch;
    utterance.lang = "en-US";
    if (state.preferredVoice) utterance.voice = state.preferredVoice;

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    window.setTimeout(finish, CONFIG.speechEndFallbackMs);
  });
}

function speak(text, onEnd) {
  const token = ++state.speakToken;
  window.SpellingPronunciation.stopPronunciationAudio();
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  const run = async () => {
    await ensurePreferredVoice();
    if (!isSpeechActive(token)) return;
    await delay(CONFIG.speechCancelDelayMs);
    if (!isSpeechActive(token)) return;
    await speakLine(text, token);
    if (isSpeechActive(token) && onEnd) onEnd();
  };

  run();
}

function formatWordForSpeech(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function playWordAudio(word, token) {
  const audioUrl = await window.SpellingPronunciation.fetchWordAudioUrl(word);
  if (!isSpeechActive(token) || !audioUrl) return false;

  return window.SpellingPronunciation.playPronunciationUrl(audioUrl, () => isSpeechActive(token));
}

function speakPrompt({ wordOnly = false, onEnd } = {}) {
  if (!state.currentWord) return;

  const token = ++state.speakToken;
  const spokenWord = formatWordForSpeech(state.currentWord);
  window.SpellingPronunciation.stopPronunciationAudio();
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  const run = async () => {
    await ensurePreferredVoice();
    if (!isSpeechActive(token)) return;
    await delay(CONFIG.speechCancelDelayMs);

    const playedWordAudio = await playWordAudio(state.currentWord, token);
    if (!isSpeechActive(token)) return;

    if (wordOnly) {
      if (!playedWordAudio) {
        await speakLine(spokenWord, token, { rate: CONFIG.speechWordRate });
      }
    } else if (playedWordAudio) {
      await delay(CONFIG.speechPauseBetweenMs);
      if (!isSpeechActive(token)) return;
      await speakLine(MESSAGES.promptAfterWord, token);
    } else {
      await speakLine(MESSAGES.promptFullSpoken(spokenWord), token, { rate: CONFIG.speechWordRate });
    }

    if (isSpeechActive(token) && onEnd) onEnd();
  };

  run();
}

function speakCurrentPrompt(onEnd) {
  speakPrompt({ wordOnly: false, onEnd });
}

function repeatCurrentWord(onEnd) {
  speakPrompt({ wordOnly: true, onEnd });
}

function hearWordAgain() {
  if (!state.currentWord) return;
  repeatCurrentWord();
}

function primeAudio() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(" ");
  utterance.volume = 0.01;
  if (state.preferredVoice) utterance.voice = state.preferredVoice;
  window.speechSynthesis.speak(utterance);
}

function renderSlots() {
  dom.letterSlots.innerHTML = Array.from({ length: CONFIG.wordLength }, (_, i) => {
    const letter = state.chosenLetters[i] ?? "";
    const filled = letter ? " filled" : "";
    return `<div class="slot${filled}" aria-label="Letter ${i + 1}">${letter}</div>`;
  }).join("");
}

function updateScoreDisplay() {
  dom.score.textContent =
    state.score.total === 0
      ? "Let's spell some words!"
      : `Score: ${state.score.correct} / ${state.score.total}`;
}

function setLocked(locked) {
  state.locked = locked;
  dom.app.classList.toggle("locked", locked);
  dom.checkBtn.disabled = locked;
  dom.clearBtn.disabled = locked;
}

function hideAnswerOk() {
  dom.answerOkBtn.hidden = true;
}

function showAnswerOk() {
  dom.answerOkBtn.hidden = false;
}

function hideAnswerCard() {
  state.revealedWord = "";
  dom.answerCard.hidden = true;
  dom.answerMedia.hidden = false;
  dom.answerImage.hidden = true;
  dom.answerImage.removeAttribute("src");
  dom.answerImage.alt = "";
  dom.answerEmoji.textContent = "";
  dom.answerEmoji.hidden = false;
  dom.answerCredit.hidden = true;
  dom.answerCredit.removeAttribute("href");
  dom.answerCredit.textContent = "";
}

function showAnswerSearchLink(word) {
  if (state.revealedWord !== word) return;
  dom.answerCredit.href = `https://www.google.com/search?tbm=isch&safe=active&q=${encodeURIComponent(
    `${word} for kids`
  )}`;
  dom.answerCredit.textContent = "See pictures";
  dom.answerCredit.hidden = false;
}

function applyAnswerPhoto(word, info) {
  if (state.revealedWord !== word) return;

  const image = dom.answerImage;
  image.alt = word;
  image.onload = () => {
    if (state.revealedWord !== word) return;
    dom.answerMedia.hidden = false;
    image.hidden = false;
    dom.answerEmoji.hidden = true;
  };
  image.onerror = () => {
    if (state.revealedWord !== word) return;
    image.hidden = true;
    dom.answerMedia.hidden = !dom.answerEmoji.textContent;
    dom.answerEmoji.hidden = !dom.answerEmoji.textContent;
    showAnswerSearchLink(word);
  };
  image.src = info.url;

  dom.answerCredit.href = info.creditUrl || "#";
  dom.answerCredit.textContent = info.creditLabel || "Photo: Wikipedia";
  dom.answerCredit.hidden = false;
}

function showAnswerCard(word) {
  state.revealedWord = word;
  dom.answerWord.textContent = word.toUpperCase();
  dom.answerCard.hidden = false;

  const images = window.SpellingImages;
  const emoji = images ? images.emojiFor(word) : null;
  dom.answerEmoji.textContent = emoji || "";
  dom.answerEmoji.hidden = !emoji;
  dom.answerMedia.hidden = !emoji;
  dom.answerImage.hidden = true;
  dom.answerImage.removeAttribute("src");
  dom.answerImage.alt = "";
  dom.answerCredit.hidden = true;
  dom.answerCredit.removeAttribute("href");
  dom.answerCredit.textContent = "";

  if (!images) {
    showAnswerSearchLink(word);
    return;
  }

  const info = images.get(word);
  if (info === undefined) {
    images.whenReady(word, (readyInfo) => {
      if (state.revealedWord !== word) return;
      if (readyInfo?.url) {
        applyAnswerPhoto(word, readyInfo);
      } else {
        showAnswerSearchLink(word);
      }
    });
  } else if (info?.url) {
    applyAnswerPhoto(word, info);
  } else {
    showAnswerSearchLink(word);
  }
}

function preloadWordImage(word) {
  const images = window.SpellingImages;
  if (!images) return;

  images.preload(word);
  images.ensure(word).then((info) => {
    if (!info?.url || state.currentWord !== word) return;
    const image = new Image();
    image.decoding = "async";
    image.src = info.url;
  });
}

function clearAnswer() {
  state.chosenLetters = [];
  dom.feedback.textContent = "";
  dom.feedback.className = "feedback";
  hideAnswerOk();
  hideAnswerCard();
  renderSlots();
}

function removeLastLetter() {
  if (state.locked) return;
  if (state.chosenLetters.length === 0) return;
  state.chosenLetters.pop();
  dom.feedback.textContent = "";
  dom.feedback.className = "feedback";
  renderSlots();
}

function isGameActive() {
  return dom.startScreen.classList.contains("hidden");
}

function addLetter(letter) {
  if (state.locked) return;
  if (state.chosenLetters.length >= CONFIG.wordLength) return;
  state.chosenLetters.push(letter);
  renderSlots();
}

function onKeyPress(event) {
  const key = event.target.closest(".key");
  if (!key || state.locked) return;
  event.preventDefault();
  addLetter(key.dataset.letter);
}

function onPhysicalKeyDown(event) {
  if (!isGameActive()) return;

  const { key } = event;

  if (key === "Enter") {
    event.preventDefault();
    if (!dom.answerOkBtn.hidden) {
      dom.answerOkBtn.click();
    } else {
      checkAnswer();
    }
    return;
  }

  if (key === " " || event.code === "Space") {
    event.preventDefault();
    hearWordAgain();
    return;
  }

  if (key === "Escape" || key === "Backspace") {
    event.preventDefault();
    removeLastLetter();
    return;
  }

  if (state.locked) return;

  if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
    event.preventDefault();
    addLetter(key.toUpperCase());
  }
}

function buildKeyboard() {
  dom.keyboard.innerHTML = CONFIG.keyboardLetters.map(
    (letter) =>
      `<button type="button" class="key" data-letter="${letter}" aria-label="Letter ${letter}">${letter}</button>`
  ).join("");

  dom.keyboard.addEventListener("click", onKeyPress);
  dom.keyboard.addEventListener("touchend", onKeyPress, { passive: false });
}

function startNewProblem() {
  clearAnswer();
  setLocked(false);

  state.currentWord = pickRandomWord();
  state.lastWord = state.currentWord;
  dom.promptText.textContent = MESSAGES.promptOnScreen;

  preloadWordImage(state.currentWord);
  speakCurrentPrompt();
}

function checkAnswer() {
  if (state.locked) return;
  if (state.chosenLetters.length !== CONFIG.wordLength) {
    dom.feedback.textContent = `Pick ${CONFIG.wordLength} letters.`;
    dom.feedback.className = "feedback wrong";
    speak(`Pick ${CONFIG.wordLength} letters.`);
    return;
  }

  const attempt = state.chosenLetters.join("").toLowerCase();
  const isCorrect = attempt === state.currentWord;

  state.score.total += 1;
  if (isCorrect) state.score.correct += 1;
  updateScoreDisplay();

  setLocked(true);

  if (isCorrect) {
    dom.feedback.textContent = MESSAGES.correct;
    dom.feedback.className = "feedback correct";
    showAnswerCard(state.currentWord);
    speak(MESSAGES.correct, () => {
      window.setTimeout(startNewProblem, CONFIG.nextProblemDelayMs);
    });
  } else {
    dom.feedback.textContent = MESSAGES.wrong;
    dom.feedback.className = "feedback wrong";
    showAnswerCard(state.currentWord);
    speak(MESSAGES.wrong, () => {
      dom.feedback.textContent = `${MESSAGES.wrong}\n${MESSAGES.answerReveal(state.currentWord)}`;
      showAnswerOk();
    });
  }
}

async function beginGame() {
  dom.startScreen.classList.add("hidden");
  await window.SpellingPronunciation.unlockAudioPlayback();
  await ensurePreferredVoice();
  primeAudio();
  startNewProblem();
}

dom.checkBtn.addEventListener("click", checkAnswer);
dom.clearBtn.addEventListener("click", () => {
  removeLastLetter();
});
dom.hearAgain.addEventListener("click", hearWordAgain);
dom.startBtn.addEventListener("click", beginGame);
dom.answerOkBtn.addEventListener("click", () => {
  hideAnswerOk();
  startNewProblem();
});

document.addEventListener("keydown", onPhysicalKeyDown);

buildKeyboard();
renderSlots();
updateScoreDisplay();
dom.promptText.textContent = "Tap Start to begin.";
