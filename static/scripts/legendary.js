import { GameEngine } from "./game_engine.js";
import { fetchLegendaryData } from "../model/legendary_model.js";

export class LegendaryEngine extends GameEngine {
  constructor() {
    super({
      pickers: { mastermind: 1, scheme: 1 },
    });
    this._revealTimer = null;
    this._flipTimers = [];
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

  _stopTimeouts() {
    clearTimeout(this._revealTimer);
    this._flipTimers.forEach(clearTimeout);
    this._flipTimers = [];
  }


  _stopAnimations(cards) {
    cards.forEach((el) => el.classList.remove("reveal", "flip"));
    void cards[0].offsetWidth; // trick to force reflow
  }

  _startRevealAndFlip() {
    const block1 = this.resultEl.querySelector(".block1");
    const block1Cards = Array.from(
      this.resultEl.querySelectorAll(".block1 .legendary-card")
    );
    const revealDelay = 1800;
    const between = 300;

    this._stopTimeouts();
    this._stopAnimations(block1Cards);

    block1Cards.forEach((el) => el.classList.add("reveal"));

    this._revealTimer = setTimeout(() => {
      block1Cards.forEach((el, i) => {
        const t = setTimeout(() => {
          el.classList.add("flip");
        }, i * between);
        this._flipTimers.push(t);
      });
    }, revealDelay);
  }

  reloadItem() {
    // no per‑card reload in Legendary—for now just do nothing
  }
}

new LegendaryEngine().init();
