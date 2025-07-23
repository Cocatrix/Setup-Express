const AEONSEND_CORE = "aeonsend_core";
const AEONSEND_PARIAS = "aeonsend_parias";

const CardType = {
  GEM: "gem",
  RELIC: "relic",
  SPELL: "spell",
};

class Card {
  constructor(boxKey, key, name, type, cost, image) {
    this.boxKey = boxKey;
    this.key = key;
    this.name = name;
    this.type = type;
    this.cost = cost;
  }
  get imageUrl() {
    return `static/images/aeonsend/${this.boxKey}/${this.type}s/${this.key}.webp`;
  }
}

let coreCards = [
  new Card(
    AEONSEND_CORE,
    "agregat_de_diamants",
    "Agrégat de diamants",
    CardType.GEM,
    4
  ),
  new Card(
    AEONSEND_CORE,
    "ambre_de_v_risbois",
    "Ambre de V'risbois",
    CardType.GEM,
    3
  ),
  new Card(AEONSEND_CORE, "jade", "Jade", CardType.GEM, 2),
  new Card(AEONSEND_CORE, "opale_brulante", "Opale brûlante", CardType.GEM, 5),
  new Card(
    AEONSEND_CORE,
    "perle_filtrante",
    "Perle filtrante",
    CardType.GEM,
    3
  ),
  new Card(
    AEONSEND_CORE,
    "rubis_fulgurant",
    "Rubis fulgurant",
    CardType.GEM,
    4
  ),
  new Card(AEONSEND_CORE, "saphir_nuageux", "Saphir nuageux", CardType.GEM, 6),

  new Card(
    AEONSEND_CORE,
    "baton_d_explosion",
    "Bâton d'explosion",
    CardType.RELIC,
    4
  ),
  new Card(
    AEONSEND_CORE,
    "dague_flechissante",
    "Dague fléchissante",
    CardType.RELIC,
    2
  ),
  new Card(
    AEONSEND_CORE,
    "orbe_de_stabilisation",
    "Orbe de stabilisation",
    CardType.RELIC,
    4
  ),
  new Card(
    AEONSEND_CORE,
    "prisme_instable",
    "Prisme instable",
    CardType.RELIC,
    3
  ),
  new Card(
    AEONSEND_CORE,
    "talisman_de_mage",
    "Talisman de mage",
    CardType.RELIC,
    5
  ),
  new Card(
    AEONSEND_CORE,
    "vortex_en_bouteille",
    "Vortex en bouteille",
    CardType.RELIC,
    3
  ),

  new Card(
    AEONSEND_CORE,
    "flamme-du-phenix",
    "Flamme du phénix",
    CardType.SPELL,
    3
  ),
  new Card(AEONSEND_CORE, "echo-spectral", "Écho spectral", CardType.SPELL, 3),
  new Card(
    AEONSEND_CORE,
    "vision_amplifiee",
    "Vision amplifiée",
    CardType.SPELL,
    4
  ),
  new Card(AEONSEND_CORE, "mise_a_feu", "Mise à feu", CardType.SPELL, 4),
  new Card(
    AEONSEND_CORE,
    "tentacule_de_lave",
    "Tentacule de lave",
    CardType.SPELL,
    4
  ),
  new Card(AEONSEND_CORE, "feu_obscur", "Feu obscur", CardType.SPELL, 5),
  new Card(AEONSEND_CORE, "vol_d_essence", "Vol d'essence", CardType.SPELL, 5),
  new Card(AEONSEND_CORE, "eclair_enrage", "Éclair enragé", CardType.SPELL, 5),
  new Card(AEONSEND_CORE, "vague_d_oubli", "Vague d'oubli", CardType.SPELL, 5),
  new Card(AEONSEND_CORE, "arc_chaotique", "Arc chaotique", CardType.SPELL, 6),
  new Card(
    AEONSEND_CORE,
    "apercu_planaire",
    "Aperçu planaire",
    CardType.SPELL,
    6
  ),
  new Card(AEONSEND_CORE, "fouet_ardent", "Fouet ardent", CardType.SPELL, 6),
  new Card(
    AEONSEND_CORE,
    "nexus_des_arcanes",
    "Nexus des arcanes",
    CardType.SPELL,
    7
  ),
  new Card(AEONSEND_CORE, "vide_devorant", "Vidé dévorant", CardType.SPELL, 7),
];

let boxToCards = {
  [AEONSEND_CORE]: coreCards,
  // "parias": [...],
};

let availableCards = [];
let selectedCards = {
  gem: [],
  relic: [],
  spell: [],
};

function initBoxDelegation() {
  document.body.addEventListener("click", (event) => {
    const tile = event.target.closest(".box-tile");
    if (tile) {
      toggleBox(tile);
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

function toggleBox(tile) {
  tile.classList.toggle("selected");
  updateResult();
}

function getCardsFromBoxes(selectedBoxes) {
  return selectedBoxes.flatMap((box) => boxToCards[box] || []);
}

function shuffleAndPick(cards, count, type) {
  return cards
    .filter((c) => c.type === type)
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .sort((a, b) => a.cost - b.cost);
}

function updateResult() {
  const selectedTiles = document.querySelectorAll(".box-tile.selected");
  const selectedValues = Array.from(selectedTiles).map((t) => t.dataset.value);
  const resultDiv = document.getElementById("result");

  if (selectedValues.length === 0) {
    resultDiv.innerHTML =
      '<p class="empty-note">Aucune boîte sélectionnée.</p>';
    return;
  }

  availableCards = getCardsFromBoxes(selectedValues);

  const usedKeys = new Set();

  function pick(type, count) {
    const options = availableCards.filter(
      (c) => c.type === type && !usedKeys.has(c.key)
    );
    const shuffled = options.sort(() => 0.5 - Math.random()).slice(0, count);
    shuffled.forEach((c) => usedKeys.add(c.key));
    return shuffled.sort((a, b) => a.cost - b.cost);
  }

  selectedCards.gem = pick("gem", 3);
  selectedCards.relic = pick("relic", 2);
  selectedCards.spell = pick("spell", 4);

  if (
    selectedCards.gem.length < 3 ||
    selectedCards.relic.length < 2 ||
    selectedCards.spell.length < 4
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
  const currentList = selectedCards[type];
  const idx = currentList.findIndex((c) => c.key === clickedKey);
  if (idx === -1) return;

  // 1) pioche
  const usedKeys = new Set(
    [...selectedCards.gem, ...selectedCards.relic, ...selectedCards.spell].map(
      (c) => c.key
    )
  );
  const options = availableCards.filter(
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
    ...selectedCards.gem,
    ...selectedCards.relic,
    ...selectedCards.spell,
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

if (document.readyState !== "loading") {
  initBoxDelegation();
  initCardDelegation();
  updateResult();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initBoxDelegation();
    initCardDelegation();
    updateResult();
  });
}
