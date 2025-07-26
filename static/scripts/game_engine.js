import { shuffle } from "./utils.js";
import { fetchMessages } from "../model/messages_model.js";

export class GameEngine {
  constructor({ pickers }) {
    this.pickers = pickers;
    this.boxSelector = ".box-tile";
    this.resultEl = document.querySelector("#result");
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

  getPool() {
    const selectedKeys = Array.from(
      document.querySelectorAll(this.boxSelector + ".selected"),
    ).map((el) => el.dataset.value);
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

    const sidebarScroll = document.querySelector(".sidebar-scroll");
    const scrollIndicator = document.getElementById("scrollIndicator");

    if (sidebarScroll && scrollIndicator) {
      const needsScroll =
        sidebarScroll.scrollHeight > sidebarScroll.clientHeight;
      if (needsScroll) {
        setTimeout(() => {
          scrollIndicator.style.display = "block";
        }, 1500);
        let hasScrolled = false;
        sidebarScroll.addEventListener("scroll", () => {
          if (!hasScrolled) {
            scrollIndicator.classList.add("hidden");
            hasScrolled = true;
          }
        });
      }
    }
  }

  updateResult() {
    this.resultEl.classList.remove("no-hover-global");
    const pool = this.getPool();

    if (pool.length === 0) {
      return this.showEmpty(this.messages.no_box_selected);
    }

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
