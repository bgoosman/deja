import { RotatingSounds } from "./rotating-sounds.js";
import { io } from "socket.io-client";

new p5((p5) => {
  let rotating;
  let socket = io();
  let ratio = 16 / 9;
  let w = 640;
  let h = w / ratio;
  let recording = false;
  let playing = false;
  let clips = [];
  let buffer = [];
  buffer.length = 600;
  let playIndex = 0;
  let recordIndex = 0;
  let ambience = [];
  let minDelta = 15000;
  let maxDelta = 20000;
  let scheduledPlayTime;
  let freshClip = false;
  let nightVideo;
  let isNightMode = false;
  let nightDuration = 1500;
  let scheduledNightMode;
  let scheduledNightFinish;
  let nightModeCadence = 30000;
  let running = true;
  let capture;

  function makeVideo() {
    if (capture) {
      capture.remove();
    }
    capture = p5.createCapture(p5.VIDEO);
    capture.size(w, h);
    capture.hide();
  }

  function render(frame) {
    p5.image(frame, 0, 0, w, h);
  }

  function scaleNumber(v, vmin, vmax, tmin, tmax) {
    return tmin + ((v - vmin) / (vmax - vmin)) * (tmax - tmin);
  }

  function getNightVideoFrame() {
    return nightVideo.get(0, 0, w, h);
  }

  function getCameraFrame() {
    return capture.get(0, 0, w, h);
  }

  function playSounds() {
    ambience.forEach((sound) => {
      sound.setVolume(0.5);
      sound.loop();
    });
    rotating.playCurrent();
    rotating.setVolume(1);
  }

  function recordClip() {
    console.log("recording");
    recordIndex = 0;
    recording = true;
  }

  function playClip() {
    console.log("playing");
    rotating.advance();
    playIndex = 0;
    playing = true;
  }

  function nightMode() {
    console.log("night mode");
    scheduledNightFinish = millis() + nightDuration;
    isNightMode = true;
  }

  function archiveClip() {
    console.log("archiving clip");
    // let writer = createWriter('newFile.clip');
    // let data = buffer.map(image => image.canvas.toDataURL());
    clips.push(buffer);
    buffer = [];
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

  p5.preload = () => {
    [
      "See How This Goes.wav",
      "181805__klankbeeld__heart-beat-increasing-116642.wav",
      "244961__patricklieberkind__dark-ambience.wav",
    ].forEach((file) => {
      ambience.push(p5.loadSound(`assets/ambience/${file}`));
    });
    rotating = new RotatingSounds(p5);
    [
      "36734__sagetyrtle__citystreet3.wav",
      "413549__inspectorj__ambience-creepy-wind-a.wav",
      "scrubby brush.wav",
      "silence.wav",
    ].forEach((file) => {
      rotating.addSound(`assets/rotating/${file}`);
    });
    nightVideo = p5.createVideo(`assets/video/Screen Recording 2021-03-13 at 11.36.39 PM.mov`);
    nightVideo.hide();
  };

  p5.setup = () => {
    p5.createCanvas(w, h);
    makeVideo();
    nightVideo.loop();
    nightVideo.size(w, h);
    scheduledNightMode = p5.millis() + nightModeCadence;
    console.log(`scheduled night mode at ${scheduledNightMode}`);
    rotating.setVolume(0);
  };

  p5.draw = () => {
    if (running) {
      let time = p5.millis();
      if (time >= scheduledNightMode) {
        scheduledNightMode = time + nightModeCadence;
        nightMode();
      }
      if (capture.loadedmetadata) {
        if (isNightMode) {
          let frame = getNightVideoFrame();
          render(frame);
          if (time >= scheduledNightFinish) {
            isNightMode = false;
          }
        } else if (recording) {
          let frame = getCameraFrame();
          render(frame);
          buffer[recordIndex] = frame;
          recordIndex++;
          if (recordIndex >= buffer.length) {
            console.log("done recording");
            scheduledPlayTime = time + scaleNumber(Math.random(), 0, 1, minDelta, maxDelta);
            console.log(`scheduled clip to play at ${scheduledPlayTime}`);
            freshClip = true;
            recording = false;
          }
        } else if (playing) {
          render(buffer[playIndex]);
          playIndex++;
          if (playIndex >= buffer.length || !buffer[playIndex]) {
            console.log("done playing");
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
    }
  };

  p5.keyPressed = (keyCode) => {
    if (keyCode === 82 /* r */) {
      makeVideo();
    } else if (keyCode === 80 /* p */) {
      playClip();
    } else if (keyCode === 78 /* n */) {
      rotating.advance();
    } else if (keyCode === 71 /* g */) {
      running = true;
    } else if (keyCode === 83 /* s */) {
      playSounds();
    } else if (keyCode === 86 /* v */) {
      nightMode();
    } else if (keyCode === 70 /* f */) {
      rotating.shift();
    } else if (keyCode == 32 /* space */) {
      archiveClip();
    }
  };
});
