export function scaleNumber(v: number, vmin: number, vmax: number, tmin: number, tmax: number) {
  return tmin + ((v - vmin) / (vmax - vmin)) * (tmax - tmin);
}

export function secondsToMillis(seconds: number): number {
  return seconds * 1000;
}