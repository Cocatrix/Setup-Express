import { GameEngine } from "./game_engine.js";
import { fetchLegendaryData } from "../model/legendary_model.js";

export class LegendaryEngine extends GameEngine {
  constructor() {
    super({
      pickers: { mastermind: 1, scheme: 1 },
    });
  }

  async fetchData() {
    return await fetchLegendaryData();
  }

  renderGrid() {
    this.resultEl.innerHTML = `
      <pre style="max-height:80vh; overflow:auto;">
        ${JSON.stringify(this.allItems, null, 2)}
      </pre>;
    `;
  }

  reloadItem(button) {
    return;
  }
}

new LegendaryEngine().init();
