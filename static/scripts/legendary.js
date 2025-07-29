import { GameEngine } from "./game_engine.js";
import { fetchLegendaryData } from "../model/legendary_model.js";

export class LegendaryEngine extends GameEngine {
  constructor() {
    super({
      pickers: { mastermind: 1, scheme: 1 },
    });
    this._revealTimer = null;
  }

  async fetchData() {
    return await fetchLegendaryData();
  }

  renderGrid() {
    this.resultEl.innerHTML = `
    <div class="legendary-section">
      <div class="legendary-block block1">
        <div class="legendary-cards">
          ${[0, 1]
            .map(
              (i) => `
            <div class="legendary-card" data-index="${i}">
              <div class="flip-container">
                <div class="face back"></div>
                <div class="face front"><h2>${this.selectedItems[i].name}</h2></div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="legendary-block block2">
        <div class="legendary-cards">
          <div class="legendary-card empty">
            <div class="flip-container">
              <div class="face back"></div>
              <div class="face front"><h2>&nbsp;</h2></div>
            </div>
          </div>
        </div>
      </div>
      <div class="legendary-block block3">
        <div class="legendary-cards">
          <div class="legendary-card empty">
            <div class="flip-container">
              <div class="face back"></div>
              <div class="face front"><h2>&nbsp;</h2></div>
            </div>
          </div>
          <div class="legendary-card empty">
            <div class="flip-container">
              <div class="face back"></div>
              <div class="face front"><h2>&nbsp;</h2></div>
            </div>
          </div>
          <div class="legendary-card empty">
            <div class="flip-container">
              <div class="face back"></div>
              <div class="face front"><h2>&nbsp;</h2></div>
            </div>
          </div>
          <div class="legendary-card empty">
            <div class="flip-container">
              <div class="face back"></div>
              <div class="face front"><h2>&nbsp;</h2></div>
            </div>
          </div>
          <div class="legendary-card empty">
            <div class="flip-container">
              <div class="face back"></div>
              <div class="face front"><h2>&nbsp;</h2></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    this._startRevealAndFlip();
  }

  _startRevealAndFlip() {
    // clear any prior animation
    clearTimeout(this._revealTimer);

    const cards = Array.from(
      this.resultEl.querySelectorAll(".block1 .legendary-card")
    );

    // add reveal class to trigger circle wipe
    cards.forEach((el) => el.classList.remove("reveal", "flip"));
    // force reflow then…
    void cards[0].offsetWidth;

    cards.forEach((el) => el.classList.add("reveal"));

    this._revealTimer = setTimeout(() => {
      cards.forEach((el) => el.classList.add("flip"));
    }, 1800);
  }

  reloadItem() {
    // no per‑card reload in Legendary—for now just do nothing
  }
}

new LegendaryEngine().init();
