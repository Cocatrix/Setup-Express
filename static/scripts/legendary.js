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
            <div class="legendary-card" data-key="${key}">
              <div class="flip-container">
                <div class="face back"></div>
                <div class="face front"><h2>${name}</h2></div>
              </div>
            </div>
          `;
  }

  _pickType(pool, type, count) {
    const options = pool.filter((c) => c.type === type);
    const picked = options.sort(() => Math.random() - 0.5).slice(0, count);
    const pickedSet = new Set(picked);
    const newPool = pool.filter((c) => !pickedSet.has(c));
    return [picked, newPool];
  }

  _renderCardsFrom(list) {
    return list.map((c) => this._renderCard(c.key, c.name)).join("");
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
        <div class="legendary-cards"></div>
      </div>

      <div class="legendary-block block3">
        <div class="legendary-cards"></div>
      </div>
    </div>
  `;
    this._startRevealAndFlip();
  }

  _refreshBlocksTwoAndThree(block2List, block3List) {
    const b2 = this.resultEl.querySelector(".block2 .legendary-cards");
    const b3 = this.resultEl.querySelector(".block3 .legendary-cards");
    if (b2) b2.innerHTML = this._renderCardsFrom(block2List);
    if (b3) b3.innerHTML = this._renderCardsFrom(block3List);
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
    if (!cards || cards.length === 0) return;
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

      // 1) calculer les cartes des blocs 2 & 3
      const { block2, block3 } = this._pickOtherCards();

      // 2) les afficher côté verso tout de suite
      this._refreshBlocksTwoAndThree(block2, block3);

      // 3) leur appliquer le reveal (cercle) puis les flipper plus tard
      let otherCards = Array.from(
        this.resultEl.querySelectorAll(
          ".block2 .legendary-card, .block3 .legendary-card"
        )
      );
      otherCards.forEach((el) => el.classList.add("reveal"));

      this._progress2Timer = new PauseableTimer(() => {
        otherCards.forEach((el, i) => {
          const t = setTimeout(() => el.classList.add("flip"), i * between);
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

  _pickOtherCards(nbPlayers = 4) {
    let pool = this.getPool();

    const scheme = this.selectedItems.find((c) => c.type === "scheme");
    const mastermind = this.selectedItems.find((c) => c.type === "mastermind");

    let nbHeroes = scheme?.nbHeroes(nbPlayers);
    let nbVillains = scheme?.nbVillains(nbPlayers);
    let nbHenchmen = scheme?.nbHenchmen(nbPlayers);

    this.nbTwists = scheme?.nbTwists(nbPlayers);
    this.nbBystanders = scheme?.nbBystanders(nbPlayers);

    const takeAlwaysLeads = (card) => {
      if (!card?.alwaysLeads) return null;
      const found = pool.find((c) => c.key === card.alwaysLeads) || null;
      if (!found) return null;
      pool = pool.filter((c) => c !== found);
      if (found.type === "villain") nbVillains -= 1;
      else nbHenchmen -= 1;
      return found;
    };

    const forced1 = takeAlwaysLeads(mastermind);
    const forced2 = takeAlwaysLeads(scheme);

    let block2 = [];
    if (forced1) block2.push(forced1);
    if (forced2) block2.push(forced2);

    let picked;
    [picked, pool] = this._pickType(pool, "villain", Math.max(0, nbVillains));
    block2.push(...picked);
    [picked, pool] = this._pickType(pool, "henchman", Math.max(0, nbHenchmen));
    block2.push(...picked);
    const block3 = this._pickType(pool, "hero", Math.max(0, nbHeroes))[0];

    return { block2, block3 };
  }
}

new LegendaryEngine().init();
