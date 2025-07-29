import { GameEngine } from "./game_engine.js";
import { fetchLegendaryData } from "../model/legendary_model.js";
import { PauseableTimer } from "./pauseable_timer.js";

export class LegendaryEngine extends GameEngine {
  constructor() {
    super({
      pickers: { mastermind: 1, scheme: 1 },
    });
    this._revealTimer = null;
    this._flipTimers = [];
    this._progress1Timer = null;
    this._progress2Timer = null;
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
    clearTimeout(this._progress1Timer);
    this._progress2Timer?.clear();
  }

  _stopProgress(block) {
    block.classList.remove("progress");
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
    const otherCards = Array.from(
      this.resultEl.querySelectorAll(
        ".block2 .legendary-card, .block3 .legendary-card"
      )
    );
    const revealDelay = 1800;
    const between = 300;
    const progressDelay = 3000;

    this._stopTimeouts();
    this._stopProgress(block1);
    this._stopAnimations(block1Cards);
    this._stopAnimations(otherCards);

    block1Cards.forEach((el) => el.classList.add("reveal"));

    this._revealTimer = setTimeout(() => {
      block1Cards.forEach((el, i) => {
        const t = setTimeout(() => {
          el.classList.add("flip");
        }, i * between);
        this._flipTimers.push(t);
      });
    }, revealDelay);

    const totalFlipTime = between * (block1Cards.length + 1);

    this._progress1Timer = setTimeout(() => {
      block1.classList.add("progress");
      this._progress2Timer = new PauseableTimer(() => {
        otherCards.forEach((el, i) => {
          const t = setTimeout(() => {
            el.classList.add("flip");
          }, i * between);
          this._flipTimers.push(t);
        });
      }, progressDelay);
      this._attachHoverPause();
      this._progress2Timer.startTimer();
    }, revealDelay + totalFlipTime);
  }

  _attachHoverPause() {
    const block1 = this.resultEl.querySelector(".block1");
    this.resultEl
      .querySelectorAll(".block1 .legendary-card")
      .forEach((card) => {
        card.addEventListener("mouseenter", () => {
          this._progress2Timer.pause();
          block1.classList.add("paused");
          card.classList.add("hovered");
        });
        card.addEventListener("mouseleave", () => {
          this._progress2Timer.resume();
          block1.classList.remove("paused");
          card.classList.remove("hovered");
        });
      });
  }

  reloadItem() {
    // no per‑card reload in Legendary—for now just do nothing
  }
}

new LegendaryEngine().init();
