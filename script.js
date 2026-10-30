const intro = document.querySelector("#intro");
const openEditionButton = document.querySelector("#open-edition");
const siteShell = document.querySelector("#site-shell");

openEditionButton.addEventListener("click", () => {
  intro.classList.add("is-opening");
  siteShell.classList.add("is-visible");
  siteShell.removeAttribute("aria-hidden");
  document.body.classList.remove("is-locked");
  window.setTimeout(() => intro.setAttribute("aria-hidden", "true"), 900);
});

document.body.classList.add("is-locked");

const herNameInput = document.querySelector("#her-name");
const yourNameInput = document.querySelector("#your-name");
const messageInput = document.querySelector("#birthday-message");

function updateLetter() {
  const herName = herNameInput.value.trim() || "her";
  const yourName = yourNameInput.value.trim() || "Your person";
  const message = messageInput.value.trim();
  document.querySelectorAll(".person-name").forEach((element) => {
    element.textContent = herName.toLocaleUpperCase();
  });
  document.querySelector("#letter-recipient").textContent = herName;
  document.querySelector("#letter-signature").textContent = yourName;
  document.querySelector("#letter-preview").textContent = message || "Your birthday message will appear here as you write it.";
  document.title = `The Birthday Edition — ${herName}`;
  try {
    localStorage.setItem("birthday-edition-letter", JSON.stringify({ herName: herNameInput.value, yourName: yourNameInput.value, message: messageInput.value }));
  } catch {
    // The preview still works if browser storage is unavailable.
  }
}

try {
  const savedLetter = JSON.parse(localStorage.getItem("birthday-edition-letter") || "null");
  if (savedLetter) {
    herNameInput.value = savedLetter.herName || herNameInput.value;
    yourNameInput.value = savedLetter.yourName || "";
    messageInput.value = savedLetter.message || "";
  }
} catch {
  // Ignore malformed or unavailable local storage and use the editable defaults.
}

[herNameInput, yourNameInput, messageInput].forEach((field) => field.addEventListener("input", updateLetter));

function setImageFromInput(input, imageElement) {
  input.addEventListener("change", () => {
    const [file] = input.files || [];
    if (!file || !file.type.startsWith("image/")) return;
    imageElement.src = URL.createObjectURL(file);
    imageElement.alt = `${herNameInput.value.trim() || "Birthday girl"} — uploaded birthday photo`;
  });
}

setImageFromInput(document.querySelector("#cover-photo-input"), document.querySelector("#cover-photo"));

const gallery = document.querySelector("#gallery");
document.querySelector("#gallery-upload").addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
  files.forEach((file) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card gallery-added";
    card.setAttribute("aria-label", `View ${file.name}`);
    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = file.name;
    const caption = document.createElement("span");
    caption.textContent = `A NEW MEMORY — ${file.name}`;
    card.append(image, caption);
    gallery.append(card);
  });
});

const audio = document.querySelector("#birthday-audio");
const playButton = document.querySelector("#play-button");
const record = document.querySelector("#record");
const progress = document.querySelector("#track-progress");
const elapsed = document.querySelector("#elapsed");
const duration = document.querySelector("#duration");
const trackTitle = document.querySelector("#track-title");
const trackFilename = document.querySelector("#track-filename");
const playingDot = document.querySelector(".playing-dot");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function setPlayingState(isPlaying) {
  playButton.textContent = isPlaying ? "Ⅱ" : "▶";
  playButton.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");
  record.classList.toggle("is-playing", isPlaying);
  playingDot.classList.toggle("is-playing", isPlaying);
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch {
      trackFilename.textContent = "Choose an audio file to play this track.";
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => setPlayingState(true));
audio.addEventListener("pause", () => setPlayingState(false));
audio.addEventListener("ended", () => setPlayingState(false));
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  elapsed.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = String((audio.currentTime / audio.duration) * 100);
  }
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

const volume = document.querySelector("#track-volume");
audio.volume = Number(volume.value);
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

document.querySelector("#track-upload").addEventListener("change", (event) => {
  const [file] = event.target.files || [];
  if (!file || !file.type.startsWith("audio/")) return;
  audio.pause();
  audio.src = URL.createObjectURL(file);
  audio.load();
  const name = file.name.replace(/\.[^.]+$/, "");
  trackTitle.textContent = name;
  trackFilename.textContent = name;
  progress.value = "0";
  elapsed.textContent = "0:00";
  duration.textContent = "0:00";
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("is-locked");
}

gallery.addEventListener("click", (event) => {
  const card = event.target.closest(".gallery-card");
  if (!card) return;
  const image = card.querySelector("img");
  if (!image) return;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.hidden = false;
  document.body.classList.add("is-locked");
  lightboxClose.focus();
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  if (event.key === "Enter" && event.target === intro) openEditionButton.click();
});

updateLetter();
