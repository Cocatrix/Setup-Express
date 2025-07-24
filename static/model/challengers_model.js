import { fetchMessages } from "./messages_model.js";

class SetItem {
  constructor(boxKey, key, name, color, type) {
    this.boxKey = boxKey;
    this.key = key;
    this.name = name;
    this.color = color;
    this.type = type;
  }
}

export async function fetchChallengersData() {
  const messages = await fetchMessages().catch(() => ({}));
  const res = await fetch("/static/data/challengers_sets.json");
  if (!res.ok) throw new Error(messages.cannot_load_sets);
  const raw = await res.json();
  return raw.map(
    ({ boxKey, key, name, color, type }) =>
      new SetItem(boxKey, key, name, color, type)
  );
}
