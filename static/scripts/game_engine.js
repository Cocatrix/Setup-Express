import { shuffle } from "./utils.js";
import { fetchMessages } from "../model/messages_model.js";

export class GameEngine {
  constructor({ boxSelector, resultSelector, pickers }) {
    this.boxSelector = boxSelector;
    this.resultEl = document.querySelector(resultSelector);
    this.pickers = pickers; // e.g. { gem:3, relic:2, spell:4 } or { sets:5 }
    this.itemsByBox = {};
    this.allItems = [];
    this.selectedItems = [];
    this.messages = {};
  }

  async init() {
    this.messages = await fetchMessages().catch(() => ({}));
    this.allItems = await this.fetchData();
    this.buildIndex();
    this.attachHandlers();
    this.updateResult();
  }

  async fetchData() {
    throw new Error(this.messages.subclass_requirement);
  }

  buildIndex() {
    this.itemsByBox = this.allItems.reduce((map, item) => {
      (map[item.boxKey] ??= []).push(item);
      return map;
    }, {});
  }

  getPool(selectedKeys) {
    return selectedKeys.flatMap((k) => this.itemsByBox[k] || []);
  }

  attachHandlers() {
    document.body.addEventListener("click", (e) => {
      const tile = e.target.closest(this.boxSelector);
      if (tile) {
        tile.classList.toggle("selected");
        return this.updateResult();
      }
      const btn = e.target.closest(".reload-button");
      if (btn) {
        e.stopPropagation();
        return this.reloadItem(btn);
      }
    });
  }

  updateResult() {
    const selectedKeys = Array.from(
      document.querySelectorAll(this.boxSelector + ".selected")
    ).map((el) => el.dataset.value);

    if (selectedKeys.length === 0) {
      return this.showEmpty(this.messages.no_box_selected);
    }

    const pool = this.getPool(selectedKeys);

    for (let [type, count] of Object.entries(this.pickers)) {
      const available = pool.filter((c) => c.type === type).length;
      if (available < count) {
        return this.showEmpty(this.messages.not_enough_items);
      }
    }

    this.selectedItems = this.pickRandom(pool);
    this.renderGrid();
  }

  pickRandom(pool) {
    return Object.entries(this.pickers).flatMap(([type, count]) => {
      const options = pool.filter((item) => item.type === type);
      return shuffle(options).slice(0, count);
    });
  }

  renderGrid() {
    throw new Error(this.messages.subclass_requirement);
  }

  reloadItem(button) {
    throw new Error(this.messages.subclass_requirement);
  }

  showEmpty(msg) {
    this.resultEl.innerHTML = `<p class="empty-note">${msg}</p>`;
  }
}
