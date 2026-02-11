import { GameEngine } from "./game_engine.js";
import { fetchAeonsendData } from "../model/aeonsend_model.js";

export class AeonsendEngine extends GameEngine {
  constructor() {
    super({
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
        .sort((a, b) => a.cost - b.cost),
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

    const usedKeys = new Set(this.selectedItems.map((c) => c.key));

    const sameTypeCards = this.getPool().filter(
      (c) => c.type === type && !usedKeys.has(c.key),
    );
    if (sameTypeCards.length === 0) return;
    const newItem =
      sameTypeCards[Math.floor(Math.random() * sameTypeCards.length)];

    const back = cardTile.querySelector(".card-back");
    back.querySelector("img").src = ""; // Forcing blank image if delay instead of seeing old image
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
        c.type === type ? typeItems[ti++] : c,
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
                    <div class="reload-button" data-key="${card.key}">
                      <!-- License: MIT. Made by teenyicons: https://github.com/teenyicons/teenyicons -->
                      <svg width="800px" height="800px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 8.49475V7.99475H13V8.49475H14ZM7.5 2.99866H8V1.99866H7.5V2.99866ZM8.5 2.49866L8.85345 2.85232L9.20733 2.49865L8.85343 2.14499L8.5 2.49866ZM13 8.49475C13 11.5291 10.5372 13.9908 7.5 13.9908V14.9908C11.0888 14.9908 14 12.082 14 8.49475H13ZM7.5 13.9908C4.46284 13.9908 2 11.5291 2 8.49475H1C1 12.082 3.91116 14.9908 7.5 14.9908V13.9908ZM2 8.49475C2 5.46036 4.46284 2.99866 7.5 2.99866V1.99866C3.91116 1.99866 1 4.90746 1 8.49475H2ZM6.14657 0.853672L8.14657 2.85233L8.85343 2.14499L6.85343 0.146328L6.14657 0.853672ZM8.14655 2.145L6.14655 4.14378L6.85345 4.8511L8.85345 2.85232L8.14655 2.145Z" fill="#000000"/>
                      </svg>
                    </div>
                </div>
                <div class="card-face card-back">
                    <img src="${card.imageUrl}" alt="${card.name}">
                    <div class="card-label ${card.type}">${card.name}</div>
                </div>
            </div>
        </div>
    `;
}
