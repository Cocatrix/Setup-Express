export class PauseableTimer {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.timerId = null;
    this.start = null;
  }

  startTimer() {
    this.start = Date.now();
    this.timerId = setTimeout(() => {
      this.callback();
      this.remaining = 0;
    }, this.remaining);
  }

  pause() {
    if (this.timerId == null) return;
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
    this.timerId = null;
  }

  resume() {
    if (this.remaining <= 0 || this.timerId != null) return;
    this.startTimer();
  }

  clear() {
    clearTimeout(this.timerId);
    this.timerId = null;
  }
}
