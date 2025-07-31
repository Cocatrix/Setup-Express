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

    this.nbTwists = 0;
    this.nbBystanders = 0;
  }

  async fetchData() {
    return await fetchLegendaryData();
  }

  _renderCard(key, name) {
    return `
            <div class="legendary-card" data-index="${key}">
              <div class="flip-container">
                <div class="face back"></div>
                <div class="face front"><h2>${name}</h2></div>
              </div>
            </div>
          `;
  }

  _renderCards(types) {
    this.selectedItems
      .filter((c) => types.includes(c.type))
      .map((card) => this._renderCard(card.key, card.name))
      .join("");
  }

  renderGrid() {
    this.resultEl.innerHTML = `
    <div class="legendary-section">
      <div class="legendary-block block1">
        <div class="legendary-cards">
          ${this._renderCards(["mastermind", "scheme"])}
        </div>
      </div>
      <div class="legendary-block block2">
        <div class="legendary-cards">
          ${this._renderCards(["villain", "henchman"])}
        </div>
      </div>
      <div class="legendary-block block3">
        <div class="legendary-cards">
          ${this._renderCards(["hero"])}
        </div>
      </div>
    </div>
  `;
    this._startRevealAndFlip();
  }

  _refreshBlocksTwoAndThree() {
    document.querySelector("block2").innerHTML = `
      <div class="legendary-cards">
        ${this._renderCards(["villain", "henchman"])}
      </div>
    `;
    document.querySelector("block3").innerHTML = `
      <div class="legendary-cards">
        ${this._renderCards(["hero"])}
      </div>
    `;
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
    let otherCards = Array.from(
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
      this._pickOtherCards();
      this._progress2Timer = new PauseableTimer(() => {
        _refreshBlocksTwoAndThree();
        otherCards = Array.from(
          this.resultEl.querySelectorAll(
            ".block2 .legendary-card, .block3 .legendary-card"
          )
        );
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

  _pickOtherCards(nbPlayers) {
    let alwaysLed1, alwaysLed2;

    let nbHeroes = this.selectedItems[1].nbHeroes(nbPlayers);
    let nbVillains = this.selectedItems[1].nbVillains(nbPlayers);
    let nbHenchmen = this.selectedItems[1].nbHenchmen(nbPlayers);

    this.nbTwists = this.selectedItems[1].nbTwists(nbPlayers);
    this.nbBystanders = this.selectedItems[1].nbBystanders(nbPlayers);

    let pool = this.getPool();

    if (this.selectedItems[0].alwaysLeads != null) {
      alwaysLed1 = pool.find(
        (card) => card.key === this.selectedItems[0].alwaysLeads
      );
      this.selectedItems.push(alwaysLed1);
      if (alwaysLed1.type === "villain") {
        nbVillains -= 1;
      } else {
        nbHenchmen -= 1;
      }
      pool = pool.filter((card) => card !== alwaysLed1);
    }
    if (this.selectedItems[1].alwaysLeads != null) {
      alwaysLed2 = pool.find(
        (card) => card.key === this.selectedItems[1].alwaysLeads
      );
      this.selectedItems.push(alwaysLed2);
      if (alwaysLed2.type === "villain") {
        nbVillains -= 1;
      } else {
        nbHenchmen -= 1;
      }
      pool = pool.filter((card) => card !== alwaysLed2);
    }

    this.pickRandom(pool, {
      hero: nbHeroes,
      villain: nbVillains,
      henchman: nbHenchmen,
    });
  }
}

new LegendaryEngine().init();
