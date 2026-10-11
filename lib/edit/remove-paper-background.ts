// Gemini can't output transparency — watercolour comes back painted on white
// paper. This removes the paper that touches the image edges (flood fill from
// the border), so white *inside* the subject (a plate, a highlight) survives.

// Colour distance (max channel difference) from the detected paper colour.
const FULLY_TRANSPARENT_BELOW = 10; // reads as bare paper
const PAPER_UP_TO = 56; // pale washes fading into paper — partially transparent

// Only treat the border as paper if it's near-white and near-neutral. A
// full-bleed scene (no paper margin) is left untouched instead of being eaten.
const MIN_PAPER_CHANNEL = 200;
const MAX_PAPER_SPREAD = 30;

type Rgb = [number, number, number];

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function detectPaper(data: Uint8ClampedArray, width: number, height: number): Rgb | null {
  const channels: [number[], number[], number[]] = [[], [], []];
  const sample = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    for (let c = 0; c < 3; c++) channels[c].push(data[i + c]);
  };
  for (let x = 0; x < width; x++) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    sample(0, y);
    sample(width - 1, y);
  }

  const paper: Rgb = [median(channels[0]), median(channels[1]), median(channels[2])];
  const isPaper = Math.min(...paper) >= MIN_PAPER_CHANNEL && Math.max(...paper) - Math.min(...paper) <= MAX_PAPER_SPREAD;
  return isPaper ? paper : null;
}

/** Mutates `data` (RGBA) in place. Returns false if no paper margin was found. */
export function removePaperBackground(data: Uint8ClampedArray, width: number, height: number): boolean {
  const paper = detectPaper(data, width, height);
  if (!paper) return false;

  const distance = (pixel: number) => {
    const i = pixel * 4;
    return Math.max(Math.abs(data[i] - paper[0]), Math.abs(data[i + 1] - paper[1]), Math.abs(data[i + 2] - paper[2]));
  };

  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const enqueue = (pixel: number) => {
    if (visited[pixel] || distance(pixel) > PAPER_UP_TO) return;
    visited[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % width;
    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (pixel >= width) enqueue(pixel - width);
    if (pixel < width * (height - 1)) enqueue(pixel + width);
  }

  for (let n = 0; n < tail; n++) {
    const pixel = queue[n];
    const i = pixel * 4;
    const opacity = Math.min(
      1,
      Math.max(0, (distance(pixel) - FULLY_TRANSPARENT_BELOW) / (PAPER_UP_TO - FULLY_TRANSPARENT_BELOW)),
    );
    // Un-mix the paper out of semi-transparent pixels, otherwise soft edges keep
    // a white fringe that shows on any background colour.
    if (opacity > 0) {
      for (let c = 0; c < 3; c++) data[i + c] = (data[i + c] - paper[c] * (1 - opacity)) / opacity;
    }
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }

  return true;
}
