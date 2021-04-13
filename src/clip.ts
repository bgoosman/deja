import p5 from "./p5";

export class Clip {
  buffer: p5.Image[];
  playIndex: number;
  recordIndex: number;
  maxSize: number;

  constructor(maxSize: number) {
    this.buffer = [];
    this.maxSize = maxSize;
    this.playIndex = 0;
    this.recordIndex = 0;
  }

  advance() {
    this.playIndex++;
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
}
