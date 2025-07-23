import { fetchAeonsendData } from "../model/aeonsend_model.js";

// Private variables

let cardsFromAllBoxes = [];
let cardsFromSelectedBoxes = [];
let cardsRandomlyPicked = {
  gem: [],
  relic: [],
  spell: [],
};

// Page init

if (document.readyState !== "loading") {
  initAll();
} else {
  document.addEventListener("DOMContentLoaded", initAll);
}

async function initAll() {
  initBoxDelegation();
  initCardDelegation();
  cardsFromAllBoxes = await fetchAeonsendData();
  updateResult();
}

function initBoxDelegation() {
  document.body.addEventListener("click", (event) => {
    const tile = event.target.closest(".box-tile");
    if (tile) {
      tile.classList.toggle("selected");
      updateResult();
    }
  });
}

function initCardDelegation() {
  document.body.addEventListener("click", (event) => {
    const btn = event.target.closest(".reload-button");
    if (!btn) return;
    event.stopPropagation();
    reloadCard(btn);
  });
}

// UI updating

function updateResult() {
  const selectedTiles = document.querySelectorAll(".box-tile.selected");
  const selectedValues = Array.from(selectedTiles).map((t) => t.dataset.value);
  const resultDiv = document.getElementById("result");

  if (selectedValues.length === 0) {
    resultDiv.innerHTML =
      '<p class="empty-note">Aucune boîte sélectionnée.</p>';
    return;
  }

  cardsFromSelectedBoxes = cardsFromAllBoxes.filter((card) =>
    selectedValues.includes(card.boxKey)
  );

  const usedKeys = new Set();

  function pick(type, count) {
    const options = cardsFromSelectedBoxes.filter(
      (c) => c.type === type && !usedKeys.has(c.key)
    );
    const shuffled = options.sort(() => 0.5 - Math.random()).slice(0, count);
    shuffled.forEach((c) => usedKeys.add(c.key));
    return shuffled.sort((a, b) => a.cost - b.cost);
  }

  cardsRandomlyPicked.gem = pick("gem", 3);
  cardsRandomlyPicked.relic = pick("relic", 2);
  cardsRandomlyPicked.spell = pick("spell", 4);

  if (
    cardsRandomlyPicked.gem.length < 3 ||
    cardsRandomlyPicked.relic.length < 2 ||
    cardsRandomlyPicked.spell.length < 4
  ) {
    resultDiv.innerHTML = `<p class="empty-note">Pas assez de cartes disponibles.</p>`;
    return;
  }

  renderGrid();
}

function reloadCard(button) {
  const cardTile = button.closest(".card-tile");
  const clickedKey = cardTile.dataset.key;
  const type = cardTile.querySelector(".card-label").classList.contains("gem")
    ? "gem"
    : cardTile.querySelector(".card-label").classList.contains("relic")
    ? "relic"
    : "spell";
  const currentList = cardsRandomlyPicked[type];
  const idx = currentList.findIndex((c) => c.key === clickedKey);
  if (idx === -1) return;

  // 1) pioche
  const usedKeys = new Set(
    [
      ...cardsRandomlyPicked.gem,
      ...cardsRandomlyPicked.relic,
      ...cardsRandomlyPicked.spell,
    ].map((c) => c.key)
  );
  const options = cardsFromSelectedBoxes.filter(
    (c) => c.type === type && !usedKeys.has(c.key)
  );
  if (!options.length) return;
  const newCard = options[Math.floor(Math.random() * options.length)];

  // 2) prépare le flip
  const back = cardTile.querySelector(".card-back");
  back.querySelector("img").src = newCard.imageUrl;
  back.querySelector("img").alt = newCard.name;
  const backLabel = back.querySelector(".card-label");
  backLabel.textContent = newCard.name;
  backLabel.className = `card-label ${newCard.type}`;

  // 3) déclenche flip + bloque hover global
  cardTile.classList.add("flipping", "disabled-hover");
  const resultDiv = document.getElementById("result");
  resultDiv.classList.add("no-hover-global");

  // 4) à mi‑animation (1.3s) on met à jour la liste et calcule les déplacements
  setTimeout(() => {
    const oldOrder = currentList.map((c) => c.key);
    currentList[idx] = newCard;
    currentList.sort((a, b) => a.cost - b.cost);
    const newOrder = currentList.map((c) => c.key);

    // on repère les clefs qui changent d’index
    const moved = oldOrder
      .map((k, i) => (k !== newOrder[i] ? k : null))
      .filter((k) => k !== null);

    if (moved.length > 1) {
      // --- fade–out / fade–in seulement si on a des échanges ---
      moved.forEach((key) => {
        const t = document.querySelector(`.card-tile[data-key="${key}"]`);
        if (t) t.classList.add("fade-out");
      });

      setTimeout(() => {
        renderGrid();

        // fade-in sur les nouvelles positions
        moved.forEach((key) => {
          const t = document.querySelector(`.card-tile[data-key="${key}"]`);
          if (t) t.classList.add("fade-in");
        });

        // cleanup
        setTimeout(() => {
          resultDiv.classList.remove("no-hover-global");
          document
            .querySelectorAll(".card-tile.fade-out, .card-tile.fade-in")
            .forEach((t) => t.classList.remove("fade-out", "fade-in"));
        }, 800);
      }, 600);
    } else {
      // --- pas de déplacement : on rafraîchit direct et on débloque le hover ---
      renderGrid();
      setTimeout(() => resultDiv.classList.remove("no-hover-global"), 400);
    }
  }, 1300);
}

function renderGrid() {
  const resultDiv = document.getElementById("result");

  const all = [
    ...cardsRandomlyPicked.gem,
    ...cardsRandomlyPicked.relic,
    ...cardsRandomlyPicked.spell,
  ];

  resultDiv.innerHTML = `
        <div class="aeon-grid">
            ${all.map(renderCardTile).join("")}
        </div>
    `;
}

function renderCardTile(card) {
  return `
        <div class="card-tile" data-key="${card.key}">
            <div class="flip-container">
                <div class="card-face card-front">
                    <img src="${card.imageUrl}" alt="${card.name}">
                    <div class="card-label ${card.type}">${card.name}</div>
                    <div class="reload-button" data-key="${card.key}">⟳</div>
                </div>
                <div class="card-face card-back">
                    <img src="${card.imageUrl}" alt="${card.name}">
                    <div class="card-label ${card.type}">${card.name}</div>
                </div>
            </div>
        </div>
    `;
}
