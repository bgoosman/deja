import p5 from "./p5";

export class Clip {
  buffer: p5.Image[];
  playIndex: number;
  recordIndex: number;
  maxSize: number;
  frameRate: number;

  constructor(maxSize: number, frameRate: number) {
    this.buffer = [];
    this.maxSize = maxSize;
    this.playIndex = 0;
    this.recordIndex = 0;
    this.frameRate = frameRate;
  }

  advance() {
    this.playIndex++;
    if (this.isDone()) {
      this.playIndex = 0;
    }
  }

  isDone(): boolean {
    return this.playIndex >= this.maxSize || !this.buffer[this.playIndex];
  }

  isFull(): boolean {
    return this.recordIndex >= this.maxSize;
  }

  get(): p5.Image {
    return this.playIndex < this.buffer.length ? this.buffer[this.playIndex] : undefined;
  }

  push(image: p5.Image) {
    this.buffer[this.recordIndex] = image;
    this.recordIndex++;
  }

  reset() {
    this.buffer = [];
    this.playIndex = 0;
    this.recordIndex = 0;
  }

  skipToMillis(millis: number): void {
    this.playIndex = Math.floor(this.frameRate * (millis / 1000.0));
    console.log(`skipping to ${this.playIndex} / ${this.buffer.length}`)
  }

  skipToRandom(): void {
    this.playIndex = Math.floor(Math.random() * this.buffer.length);
    console.log(`skipping to ${this.playIndex} / ${this.buffer.length}`)
  }
}
