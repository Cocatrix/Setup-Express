import { shuffle, NO_HOVER_TIMEOUT } from "./utils.js";
import { fetchMessages } from "../model/messages_model.js";
import { fetchChallengersData } from "../model/challengers_model.js";

// Private variables

let boxToSets = {};
let availableSets = [];
let selectedSets = [];
let messages;

// Page init

if (document.readyState !== "loading") {
  initChallengers();
} else {
  document.addEventListener("DOMContentLoaded", initChallengers);
}

async function initChallengers() {
  messages = await fetchMessages().catch(() => ({}));
  const allSets = await fetchChallengersData();

  boxToSets = allSets.reduce((map, set) => {
    (map[set.boxKey] ??= []).push(set);
    return map;
  }, {});

  initEventDelegation();
  updateResult();
}

// UI updating

function getSetsFromBoxes(selectedBoxes) {
  return selectedBoxes.flatMap((box) => boxToSets[box] || []);
}

function shuffleAndPickSets(sets, count) {
  return shuffle(sets).slice(0, count);
}

function renderCardFace(set) {
  return `
    <button class="reload-button" aria-label="Relancer">⟳</button>
    <div class="set-content">
      <div class="set-icon">
        <img
          src="/static/images/challengers/${set.boxKey}/${set.key}.jpg"
          alt="${set.name}"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="set-name">${set.name}</div>
    </div>
  `;
}

function renderSetCard(set) {
  return `
    <div
      class="set-card"
      data-box-key="${set.boxKey}"
      data-key="${set.key}"
      tabindex="0"
      role="button"
      aria-label="${set.name}"
      style="--set-col: ${
        set.color
      }; background-color: var(--set-col); border-color: var(--set-col);"
    >
      <div class="flip-container">
        <div class="card-face front">
          ${renderCardFace(set)}
        </div>
        <div class="card-face back" aria-hidden="true">
          ${renderCardFace(set)}
        </div>
      </div>
    </div>
  `;
}

function renderList() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <div class="challenger-list">
      ${selectedSets.map((set) => renderSetCard(set)).join("")}
    </div>
  `;
}

function updateResult() {
  const selectedBoxes = [
    ...document.querySelectorAll(".box-tile.selected"),
  ].map((el) => el.dataset.value);
  const resultDiv = document.getElementById("result");

  if (selectedBoxes.length === 0) {
    resultDiv.innerHTML = `<p class="empty-note">${messages.no_box_selected}</p>`;
    return;
  }

  availableSets = getSetsFromBoxes(selectedBoxes);
  if (availableSets.length < 5) {
    resultDiv.innerHTML = `<p class="empty-note">${messages.not_enough_sets}</p>`;
    return;
  }

  selectedSets = shuffleAndPickSets(availableSets, 5);
  renderList();
}

async function reloadSet(oldKey) {
  console.log("reloadSet called for", oldKey);
  const idx = selectedSets.findIndex((s) => s.key === oldKey);
  if (idx === -1) return;

  const excluded = selectedSets.map((s) => s.key);
  const options = availableSets.filter((s) => !excluded.includes(s.key));
  if (options.length === 0) return;

  const newSet = options[Math.floor(Math.random() * options.length)];
  const cardElem = document.querySelector(`.set-card[data-key="${oldKey}"]`);
  const resultDiv = document.getElementById("result");

  clearHighlights();
  resultDiv.classList.add("no-hover-global");

  cardElem.style.transition = "transform 0.4s ease";
  cardElem.style.transform = "rotateX(90deg)";

  cardElem.addEventListener("transitionend", function onHalf(e) {
    if (e.propertyName !== "transform") return;
    cardElem.removeEventListener("transitionend", onHalf);

    selectedSets[idx] = newSet;
    cardElem.style.setProperty("--set-col", newSet.color);
    cardElem.dataset.boxKey = newSet.boxKey;
    cardElem.dataset.key = newSet.key;

    const front = cardElem.querySelector(".card-face.front");
    const back = cardElem.querySelector(".card-face.back");
    front.innerHTML = renderCardFace(newSet);
    back.innerHTML = renderCardFace(newSet);

    cardElem.style.transition = "transform 0.4s ease";
    cardElem.style.transform = "rotateX(180deg)";

    cardElem.addEventListener("transitionend", function onEnd(e2) {
      if (e2.propertyName !== "transform") return;
      cardElem.removeEventListener("transitionend", onEnd);

      cardElem.style.transition = "";
      cardElem.style.transform = "";
      setTimeout(() => {
        resultDiv.classList.remove("no-hover-global");
        if (cardElem.matches(":hover")) {
          document
            .querySelector(`.box-tile[data-value="${newSet.boxKey}"]`)
            ?.classList.add("highlight");
        }
      }, NO_HOVER_TIMEOUT);
    });
  });
}

function initEventDelegation() {
  document.body.addEventListener("click", (event) => {
    const tile = event.target.closest(".box-tile");
    if (tile) {
      tile.classList.toggle("selected");
      updateResult();
    }

    const reloadBtn = event.target.closest(".reload-button");
    if (reloadBtn) {
      event.stopPropagation();
      const card = reloadBtn.closest(".set-card");
      reloadSet(card.dataset.key);
    }
  });

  const resultDiv = document.getElementById("result");

  document.body.addEventListener("mouseover", (event) => {
    if (resultDiv.classList.contains("no-hover-global")) return;
    const card = event.target.closest(".set-card");
    if (card) {
      const tile = document.querySelector(
        `.box-tile[data-value="${card.dataset.boxKey}"]`
      );
      tile?.classList.add("highlight");
    }
  });

  document.body.addEventListener("mouseout", (event) => {
    if (resultDiv.classList.contains("no-hover-global")) return;
    const card = event.target.closest(".set-card");
    if (card) {
      const tile = document.querySelector(
        `.box-tile[data-value="${card.dataset.boxKey}"]`
      );
      tile?.classList.remove("highlight");
    }
  });
}

function clearHighlights() {
  document
    .querySelectorAll(".box-tile.highlight")
    .forEach((tile) => tile.classList.remove("highlight"));
}
