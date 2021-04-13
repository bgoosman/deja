import p5 from './p5'

export class RotatingSounds {
  p: p5;
  current: number;
  start: number;
  sounds: p5.SoundFile[];

  constructor(p: p5) {
    this.p = p;
    this.sounds = [];
    this.current = 0;
    this.start = 0;
  }

  setVolume(value: number) {
    this.sounds.forEach(sound => sound.setVolume(value))
  }

  push(sound: p5.SoundFile) {
    this.sounds.push(sound);
  }

  playCurrent() {
    console.log(`playing ${this.getIndex()}`);
    this.sounds[this.getIndex()].play();
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
    if (this.current >= this.sounds.length) this.current = 0;
    this.playCurrent();
  }

  shift() {
    this.start++;
    if (this.start >= this.sounds.length) this.start = 0;
    console.log(`start = ${this.start}`);
  }
}