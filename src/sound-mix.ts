import p5 from "./p5";

export class SoundMix {
  p: p5;
  sounds: p5.SoundFile[];

  constructor(p: p5) {
    this.p = p;
    this.sounds = [];
  }

  push(sound: p5.SoundFile): void {
    this.sounds.push(sound);
  }

  play(): void {
    this.sounds.forEach(s => s.loop());
  }

  setVolume(volume: number) {
    this.sounds.forEach(s => s.setVolume(volume));
  }
}
