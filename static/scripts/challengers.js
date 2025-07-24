import { NO_HOVER_TIMEOUT } from "./utils.js";
import { GameEngine } from "./game_engine.js";
import { fetchChallengersData } from "../model/challengers_model.js";

export class ChallengersEngine extends GameEngine {
  constructor() {
    super({
      pickers: { set: 5 },
    });
  }

  fetchData() {
    return fetchChallengersData();
  }

  renderGrid() {
    this.resultEl.innerHTML = `
      <div class="challenger-list">
        ${this.selectedItems.map(renderSetCard).join("")}
      </div>`;
  }

  attachHandlers() {
    super.attachHandlers();
    initMouseEventsDelegation(this.resultEl);
  }

  reloadItem(button) {
    const oldKey = button.closest(".set-card").dataset.key;
    const idx = this.selectedItems.findIndex((s) => s.key === oldKey);
    if (idx === -1) return;

    const excluded = this.selectedItems.map((s) => s.key);
    const options = this.getPool().filter((s) => !excluded.includes(s.key));
    if (options.length === 0) return;

    const newSet = options[Math.floor(Math.random() * options.length)];
    const cardElem = document.querySelector(`.set-card[data-key="${oldKey}"]`);

    clearHighlights();
    this.resultEl.classList.add("no-hover-global");

    cardElem.style.transition = "transform 0.4s ease";
    cardElem.style.transform = "rotateX(90deg)";

    const onHalf = (e) => {
      if (e.propertyName !== "transform") return;
      cardElem.removeEventListener("transitionend", onHalf);

      this.selectedItems[idx] = newSet;
      cardElem.style.setProperty("--set-col", newSet.color);
      cardElem.dataset.boxKey = newSet.boxKey;
      cardElem.dataset.key = newSet.key;

      const front = cardElem.querySelector(".card-face.front");
      const back = cardElem.querySelector(".card-face.back");
      front.innerHTML = renderCardFace(newSet);
      back.innerHTML = renderCardFace(newSet);

      cardElem.style.transition = "transform 0.4s ease";
      cardElem.style.transform = "rotateX(180deg)";

      const onEnd = (e2) => {
        if (e2.propertyName !== "transform") return;
        cardElem.removeEventListener("transitionend", onEnd);

        cardElem.style.transition = "";
        cardElem.style.transform = "";
        setTimeout(() => {
          this.resultEl.classList.remove("no-hover-global");
          if (cardElem.matches(":hover")) {
            document
              .querySelector(`.box-tile[data-value="${newSet.boxKey}"]`)
              ?.classList.add("highlight");
          }
        }, NO_HOVER_TIMEOUT);
      };

      cardElem.addEventListener("transitionend", onEnd);
    };

    cardElem.addEventListener("transitionend", onHalf);
  }
}

new ChallengersEngine().init();

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

function initMouseEventsDelegation(resultEl) {
  document.body.addEventListener("mouseover", (event) => {
    if (resultEl.classList.contains("no-hover-global")) return;
    const card = event.target.closest(".set-card");
    if (card) {
      const tile = document.querySelector(
        `.box-tile[data-value="${card.dataset.boxKey}"]`
      );
      tile?.classList.add("highlight");
    }
  });

  document.body.addEventListener("mouseout", (event) => {
    if (resultEl.classList.contains("no-hover-global")) return;
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
