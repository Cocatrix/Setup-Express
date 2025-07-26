import { fetchMessages } from "../model/messages_model.js";

class Card {
  constructor({
    boxKey,
    key,
    name,
    type,
    cost = null,
    twists = null,
    nbBystanders = null,
    alwaysLeads = null,
    extraHeroes = 0,
    extraHenchmen = 0,
    byPlayerCount = {},
  }) {
    this.boxKey = boxKey;
    this.key = key;
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.twists = twists;
    this.nbBystanders = nbBystanders;
    this.alwaysLeads = alwaysLeads;
    this.extraHeroes = extraHeroes;
    this.extraHenchmen = extraHenchmen;
    this.byPlayerCount = byPlayerCount;
  }

  get imageUrl() {
    return `static/images/legendary/${this.boxKey}/${this.type}s/${this.key}.webp`;
  }

  nbTwists(nbPlayers) {
    const pKey = `${nbPlayers}p`;
    return this.byPlayerCount[pKey]?.twists ?? this.twists ?? 8;
  }

  nbTwists(nbPlayers) {
    const pKey = `${nbPlayers}p`;
    if (this.byPlayerCount[pKey]?.twists != null) {
      return this.byPlayerCount[pKey].twists;
    }
    return this.twists != null ? this.twists : 8;
  }

  defaultNbBystanders(nbPlayers) {
    if (nbPlayers == 2) {
      return 2;
    } else if (nbPlayers == 3 || nbPlayers == 4) {
      return 8;
    } else {
      return 12;
    }
  }

  nbBystanders(nbPlayers) {
    const pKey = `${nbPlayers}p`;
    return (
      this.byPlayerCount[pKey]?.bystanders ??
      this.nbBystanders ??
      this.defaultNbBystanders(nbPlayers)
    );
  }

  defaultNbVillains(nbPlayers) {
    if (nbPlayers == 2) {
      return 2;
    } else if (nbPlayers == 3 || nbPlayers == 4) {
      return 3;
    } else {
      return 4;
    }
  }

  nbVillains(nbPlayers) {
    return this.defaultNbVillains(nbPlayers);
  }

  defaultNbHenchmen(nbPlayers) {
    if (nbPlayers == 2 || nbPlayers == 3) {
      return 1;
    } else {
      return 2;
    }
  }

  nbHenchmen(nbPlayers) {
    const defaultNb = this.defaultNbHenchmen(nbPlayers);
    return defaultNb + (this.extraHenchmen ?? 0);
  }

  defaultNbHeroes(nbPlayers) {
    if (nbPlayers == 2 || nbPlayers == 3 || nbPlayers == 4) {
      return 5;
    } else {
      return 6;
    }
  }

  nbHeroes(nbPlayers) {
    const defaultNb = this.defaultNbHeroes(nbPlayers);
    const pKey = `${nbPlayers}p`;

    return (
      defaultNb +
      (this.byPlayerCount[pKey]?.extraHeroes ?? 0) +
      (this.extraHeroes ?? 0)
    );
  }
}

export async function fetchLegendaryData() {
  const messages = await fetchMessages().catch(() => ({}));
  const res = await fetch("/static/data/legendary_cards.json");
  if (!res.ok) throw new Error(messages.cannot_load_cards);
  const data = await res.json();

  return data.map((item) => {
    const {
      "2p": p2,
      "3p": p3,
      "4p": p4,
      "5p": p5,
      boxKey,
      key,
      name,
      type,
      cost,
      twists,
      nbBystanders,
      alwaysLeads,
      extraHeroes,
      extraHenchmen,
    } = item;

    const byPlayerCount = {};
    if (p2) byPlayerCount["2p"] = p2;
    if (p3) byPlayerCount["3p"] = p3;
    if (p4) byPlayerCount["4p"] = p4;
    if (p5) byPlayerCount["5p"] = p5;

    return new Card({
      boxKey,
      key,
      name,
      type,
      cost,
      twists,
      nbBystanders,
      alwaysLeads,
      extraHeroes,
      extraHenchmen,
      byPlayerCount,
    });
  });
}
