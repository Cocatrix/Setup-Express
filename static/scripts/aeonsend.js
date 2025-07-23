import { GameEngine } from "./game_engine.js";
import { fetchAeonsendData } from "../model/aeonsend_model.js";

export class AeonsendEngine extends GameEngine {
  constructor() {
    super({
      boxSelector: ".box-tile",
      resultSelector: "#result",
      minItems: null, // on gère gem/relic/spell séparément
      pickers: { gem: 3, relic: 2, spell: 4 },
    });
  }

  async fetchData() {
    const data = await fetchAeonsendData();
    // on peut stocker tout en this.allItems
    return data;
  }

  renderGrid() {
    this.selectedItems = ["gem", "relic", "spell"].flatMap((type) =>
      this.selectedItems
        .filter((item) => item.type === type)
        .slice()
        .sort((a, b) => a.cost - b.cost)
    );
    this.resultEl.innerHTML = `
      <div class="aeon-grid">
        ${this.selectedItems.map(renderCardTile).join("")}
      </div>
    `;
  }

  reloadItem(button) {
    const cardTile = button.closest(".card-tile");
    const clickedKey = cardTile.dataset.key;
    const type = cardTile.querySelector(".card-label").classList.contains("gem")
      ? "gem"
      : cardTile.querySelector(".card-label").classList.contains("relic")
      ? "relic"
      : "spell";

    const idx = this.selectedItems.findIndex((c) => c.key === clickedKey);
    if (idx === -1) return;

    const selectedKeys = Array.from(
      document.querySelectorAll(this.boxSelector + ".selected")
    ).map((el) => el.dataset.value);
    const pool = this.getPool(selectedKeys);

    const usedKeys = new Set(this.selectedItems.map((c) => c.key));

    const sameTypeCards = pool.filter(
      (c) => c.type === type && !usedKeys.has(c.key)
    );
    if (sameTypeCards.length === 0) return;
    const newItem =
      sameTypeCards[Math.floor(Math.random() * sameTypeCards.length)];

    const back = cardTile.querySelector(".card-back");
    back.querySelector("img").src = newItem.imageUrl;
    back.querySelector("img").alt = newItem.name;
    const backLabel = back.querySelector(".card-label");
    backLabel.textContent = newItem.name;
    backLabel.className = `card-label ${newItem.type}`;

    cardTile.classList.add("flipping", "disabled-hover");
    this.resultEl.classList.add("no-hover-global");

    setTimeout(() => {
      const oldOrder = this.selectedItems
        .filter((c) => c.type === type)
        .map((c) => c.key);

      this.selectedItems[idx] = newItem;

      const typeItems = this.selectedItems
        .filter((c) => c.type === type)
        .sort((a, b) => a.cost - b.cost);

      let ti = 0;
      this.selectedItems = this.selectedItems.map((c) =>
        c.type === type ? typeItems[ti++] : c
      );

      const newOrder = typeItems.map((c) => c.key);

      const moved = oldOrder
        .map((k, i) => (k !== newOrder[i] ? k : null))
        .filter((k) => k !== null);

      if (moved.length > 1) {
        moved.forEach((key) => {
          const t = document.querySelector(`.card-tile[data-key="${key}"]`);
          if (t) t.classList.add("fade-out");
        });

        setTimeout(() => {
          this.renderGrid();
          moved.forEach((key) => {
            const t = document.querySelector(`.card-tile[data-key="${key}"]`);
            if (t) t.classList.add("fade-in");
          });
          setTimeout(() => {
            this.resultEl.classList.remove("no-hover-global");
            document
              .querySelectorAll(".card-tile.fade-out, .card-tile.fade-in")
              .forEach((t) => t.classList.remove("fade-out", "fade-in"));
          }, 800);
        }, 600);
      } else {
        this.renderGrid();
        setTimeout(() => {
          this.resultEl.classList.remove("no-hover-global");
        }, 400);
      }
    }, 1300);
  }
}

new AeonsendEngine().init();

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
