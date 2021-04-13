import p5 from "./p5";

import { RotatingSounds } from "./rotating-sounds";
import { io } from "socket.io-client";
import { Clip } from "./clip";
import { SoundMix } from "./sound-mix";
import { VideoFile } from "./video-file";

new p5((p: p5) => {
  let rotating: RotatingSounds;
  let ambience: SoundMix;

  let socket = io();

  let running = true;
  let recording = false;
  let playing = false;
  let freshClip = false;

  let ratio = 16 / 9;
  let w = 640;
  let h = w / ratio;

  let clips = [];
  let clip: Clip;
  const CLIP_LENGTH = 10;
  const FRAME_RATE = 60;
  const CLIP_SIZE = CLIP_LENGTH * FRAME_RATE;
  let buffer: p5.Image[] = [];
  buffer.length = CLIP_SIZE;

  let minDelta = 15000;
  let maxDelta = 20000;
  let scheduledPlayTime: number;
  let capture: p5.Element;

  function createCapture() {
    if (capture) {
      capture.remove();
    }
    capture = p.createCapture(p.VIDEO);
    capture.size(w, h);
    capture.hide();
  }

  function render(frame: p5.Image) {
    p.image(frame, 0, 0, w, h);
  }

  function scaleNumber(v: number, vmin: number, vmax: number, tmin: number, tmax: number) {
    return tmin + ((v - vmin) / (vmax - vmin)) * (tmax - tmin);
  }

  function getCameraFrame() {
    return ((capture as any) as p5.Image).get(0, 0, w, h);
  }

  function playSounds() {
    ambience.setVolume(0.5);
    ambience.play();
    rotating.playCurrent();
    rotating.setVolume(1);
  }

  function recordClip() {
    console.log("recording");
    recording = true;
  }

  function playClip() {
    console.log("playing");
    rotating.advance();
    playing = true;
  }

  function archiveClip() {
    console.log("archiving clip");
    // let writer = createWriter('newFile.clip');
    // let data = buffer.map(image => image.canvas.toDataURL());
    // clips.push(buffer);
    // buffer = [];
    // let max = 1;
    // let data = buffer.slice(0, max).map(image => image.drawingContext.getImageData(0, 0, w, h).data);
    // let data = [buffer[0].canvas.toDataURL()];
    // let data = [buffer[0].drawingContext.getImageData(0, 0, w, h).data.buffer]
    // data = data.slice(0, 1);
    // socket.emit('image', data);
    // socket.emit('image', { image: true, buffer: data[0] });
    // writer.write(data)
    // writer.close()
  }

  function loadSound(path: string) {
    return ((p as any) as p5.SoundFile).loadSound(path);
  }

  p.preload = () => {
    console.log("preloading");
    ambience = new SoundMix(p);
    ["dragging stick.wav"].forEach((file) => {
      ambience.push(loadSound(`assets/ambience/${file}`));
    });

    rotating = new RotatingSounds(p);
    [
      // "36734__sagetyrtle__citystreet3.wav",
      // "413549__inspectorj__ambience-creepy-wind-a.wav",
      // "scrubby brush.wav",
      // "silence.wav",
      "airplane scrub.m4a",
      "laundry loud.m4a",
      "machine belt.m4a",
      "walking.wav",
      "book.m4a",
      "door knob.m4a",
      "necklace.m4a",
      "shoe laces.m4a",
      "stool growl.m4a",
      "ukulele perc.m4a",
    ].forEach((file) => {
      rotating.push(loadSound(`assets/rotating/${file}`));
    });
  };

  p.setup = () => {
    console.log("setup");
    p.createCanvas(w, h);
    createCapture();
    rotating.setVolume(0);
  };

  p.draw = () => {
    if (running) {
      let time = p.millis();
      if (recording) {
        if (!clip) clip = new Clip(CLIP_SIZE);
        let frame = getCameraFrame();
        render(frame);
        clip.push(frame);
        if (clip.isFull()) {
          console.log("done recording");
          scheduledPlayTime = time + scaleNumber(Math.random(), 0, 1, minDelta, maxDelta);
          console.log(`scheduled clip to play at ${scheduledPlayTime}`);
          freshClip = true;
          recording = false;
        }
      } else if (playing) {
        render(clip.get());
        clip.advance();
        if (clip.isDone()) {
          console.log("done playing");
          clip.reset();
          playing = false;
        }
      } else {
        let frame = getCameraFrame();
        render(frame);
        if (freshClip && time >= scheduledPlayTime) {
          freshClip = false;
          archiveClip();
          playClip();
        } else if (!freshClip) {
          recordClip();
        }
      }
    }
  };

  p.keyPressed = () => {
    const keyCode = p.keyCode;
    if (keyCode === 82 /* r */) {
      createCapture();
    } else if (keyCode === 80 /* p */) {
      playClip();
    } else if (keyCode === 78 /* n */) {
      rotating.advance();
    } else if (keyCode === 71 /* g */) {
      running = true;
    } else if (keyCode === 83 /* s */) {
      playSounds();
    } else if (keyCode === 70 /* f */) {
      rotating.shift();
    } else if (keyCode == 32 /* space */) {
      archiveClip();
    }
  };
});
