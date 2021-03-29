export class RotatingSounds {
  constructor(p5) {
    this.p5 = p5;
    this.sounds = [];
    this.current = 0;
    this.start = 0;
    this.size = 4;
  }

  setVolume(value) {
    this.sounds.forEach(sound => sound.setVolume(value))
  }

  addSound(filePath) {
    console.log(`loading ${filePath}`);
    this.sounds.push(this.p5.loadSound(filePath));
  }

  playCurrent() {
    console.log(`playing ${this.getIndex()}`);
    this.sounds[this.getIndex()].loop();
  }

  stopCurrent() {
    console.log(`stopping ${this.getIndex()}`);
    this.sounds[this.getIndex()].stop();
  }

  getIndex() {
    let index = this.start + this.current;
    if (index >= this.sounds.length) {
      index = index - this.sounds.length;
    }
    return index;
  }

  advance() {
    this.stopCurrent();
    this.current++;
    if (this.current >= this.size) this.current = 0;
    this.playCurrent();
  }

  shift() {
    this.start++;
    if (this.start >= this.sounds.length) this.start = 0;
    console.log(`start = ${this.start}`);
  }
}