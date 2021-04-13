import p5 from "p5";
declare global {
  interface Window {
    p5: typeof p5;
  }
}
window.p5 = p5;

import "p5/lib/addons/p5.sound";

export = p5;
