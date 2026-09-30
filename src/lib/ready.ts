// One-shot signal: the hero can be shown. Module state, so switching language doesn't replay the preloader.
let ready = false;
const listeners = new Set<() => void>();

export function markHeroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
  listeners.clear();
}

export function onHeroReady(cb: () => void): () => void {
  if (ready) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
