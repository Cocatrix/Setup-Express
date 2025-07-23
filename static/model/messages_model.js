let _cachedMessages = null;

export async function fetchMessages() {
  if (_cachedMessages) return _cachedMessages;
  const res = await fetch("/static/data/messages.json");
  if (!res.ok) throw new Error("Impossible de charger les messages");
  _cachedMessages = await res.json();
  return _cachedMessages;
}
