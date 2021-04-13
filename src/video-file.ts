import p5 from "p5";

export class VideoFile {
  video: p5.MediaElement;
  width: number;
  height: number;

  constructor(p: p5, path: string, width: number, height: number) {
    this.video = p.createVideo(path);
    this.width = width;
    this.height = height;
    this.size(width, height);
  }

  get(): p5.Image {
    return ((this.video as any) as p5.Image).get(0, 0, this.width, this.height);
  }

  hide() {
    ((this.video as any) as p5.Element).hide();
  }

  loop() {
    this.video.loop();
  }

  size(width: number, height: number) {
    ((this.video as any) as p5.Element).size(width, height);
  }
}