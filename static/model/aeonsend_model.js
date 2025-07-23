class Card {
  constructor(boxKey, key, name, type, cost) {
    this.boxKey = boxKey;
    this.key = key;
    this.name = name;
    this.type = type;
    this.cost = cost;
  }
  get imageUrl() {
    return `static/images/aeonsend/${this.boxKey}/${this.type}s/${this.key}.webp`;
  }
}

export async function fetchAeonsendData() {
  const res = await fetch("/static/data/aeonsend_cards.json");
  if (!res.ok) throw new Error("Impossible de charger les cartes Aeon's End"); // Tester
  const data = await res.json();
  return data.map(
    ({ boxKey, key, name, type, cost }) =>
      new Card(boxKey, key, name, type, cost)
  );
}
