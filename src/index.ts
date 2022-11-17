import p5 from "./p5";

import { RotatingSounds } from "./rotating-sounds";
import { io } from "socket.io-client";
import { Clip } from "./clip";
import { SoundMix } from "./sound-mix";
import { Timeline } from "./timeline";
import * as math from "./math";

new p5((p5js: p5) => {
  let rotating: RotatingSounds;
  let ambience: SoundMix;

  let running = false;
  let recording = false;
  let playing = false;
  let freshClip = false;

  // let ratio = 16 / 9;
  let ratio = 4 / 3;
  let w = 640;
  let h = w / ratio;

  let clips = [];
  let clip: Clip;
  const CLIP_LENGTH = 10;
  const FRAME_RATE = 60;
  const CLIP_SIZE = CLIP_LENGTH * FRAME_RATE;
  let buffer: p5.Image[] = [];
  buffer.length = CLIP_SIZE;
  let recordingClip: Clip = new Clip(CLIP_SIZE, FRAME_RATE);
  let playingClip: Clip = new Clip(CLIP_SIZE, FRAME_RATE);

  let capture: p5.Element;

  let timeline: Timeline = new Timeline(p5js);

  let rhythmIndex = 0;

  function createCapture() {
    if (capture) {
      capture.remove();
    }
    capture = p5js.createCapture(p5js.VIDEO);
    capture.size(w, h);
    capture.hide();
  }

  function render(frame: p5.Image) {
    if (frame) p5js.image(frame, 0, 0, w, h);
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
  }

  function loadSound(path: string) {
    return ((p5js as any) as p5.SoundFile).loadSound(path);
  }

  p5js.preload = () => {
    console.log("preloading");
    ambience = new SoundMix(p5js);
    ["dragging stick.wav"].forEach((file) => {
      ambience.push(loadSound(`assets/ambience/${file}`));
    });

    rotating = new RotatingSounds(p5js);
    [
      "Office Space Printer Wake Up From Sleep Mode XY.wav",
      "40_FallingSun_SH101_E1-1LSN.wav",
      "63_OneShots_SH101_D3-LKO7.wav",
      "70_OneShots_SH101_A3-PVMV.wav",
      "VCV Yarrow 7-1-1.wav",
      "75_OneShots_SH101_D4-LHAN.wav",
      "76_OneShots_SH101_E4-CKI9.wav",
      "RulerTwang-Clean.wav",
      "SFM-MicroMoog6-33.wav",
      "SFM-MicroMoog6-45.wav",
      "SFM-MicroMoog6-59.wav",
      // "36734__sagetyrtle__citystreet3.wav",
      // "413549__inspectorj__ambience-creepy-wind-a.wav",
      // "scrubby brush.wav",
      // "silence.wav",
      // "airplane scrub.m4a",
      "bike horn.wav",
      // "laundry loud.m4a",
      // "machine belt.m4a",
      // "walking.wav",
      "kids say woah.wav",
      // "book.m4a",
      // "door knob.m4a",
      // "necklace.m4a",
      // "shoe laces.m4a",
      // "stool growl.m4a",
      // "rim shot.wav",
      // "applause.wav",
      // "ukulele perc.m4a",
    ].forEach((file) => {
      rotating.push(loadSound(`assets/rotating/${file}`));
    });
    rotating.setVolume(0);
  };

  p5js.setup = () => {
    console.log("setup");
    createCapture();
    p5js.createCanvas(w, h);
  };

  p5js.draw = () => {
    if (running) {
      const events = timeline.getAllExpiredEvents();
      events.forEach((event) => event.fn());

      let frame = getCameraFrame();
      if (playing) {
        render(playingClip.get());
        playingClip.advance();
      } else {
        render(frame);
        recordingClip.push(frame);
        if (recordingClip.isFull()) {
          playingClip = recordingClip;
          console.log("done recording");
          const rhythms = [
            [3, 1, 0.25, 0.25, 0.5, 5],
            [0.5, 0.5, 2, 0.5, 0.75, 2],
            [2, 1, 3, 0.25, 1, 0.25, 3],
          ]
          const millis = rhythms[rhythmIndex++].map(math.secondsToMillis).reduce((abs, rel) => {
            const millis = abs + rel;
            console.log("scheduling", millis);
            timeline.schedule(millis, () => {
              console.log(millis, "advancing...");
              rotating.advance();
              playingClip.skipToRandom();
            });
            return abs + rel;
          }, 0);
          if (rhythmIndex == rhythms.length) rhythmIndex = 0;
          console.log("after millis", millis);
          timeline.schedule(millis, () => {
            console.log("recording again");
            recordingClip.reset();
            playing = false;
          });
          playing = true;
        }
      }
    }
  };

  p5js.keyPressed = () => {
    const keyCode = p5js.keyCode;
    if (keyCode === 82 /* r */) {
      createCapture();
    } else if (keyCode === 80 /* p */) {
      playClip();
    } else if (keyCode === 78 /* n */) {
      [3, 1, 0.25, 0.25, 0.25, 6].map(math.secondsToMillis).reduce((abs, rel) => {
        const millis = abs + rel;
        timeline.schedule(millis, () => {
          console.log(millis, "advancing...");
          rotating.advance();
        });
        return abs + rel;
      }, 0);
    } else if (keyCode === 71 /* g */) {
    } else if (keyCode === 83 /* s */) {
      running = true;
      playSounds();
      recording = true;
    } else if (keyCode === 70 /* f */) {
      rotating.shift();
    } else if (keyCode == 32 /* space */) {
      archiveClip();
    }
  };
});
