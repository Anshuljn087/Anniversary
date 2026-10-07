// --- Microphone "blow" detection ---
// Listens to mic RMS energy over a short window; a sustained loud burst counts as a blow.
export type BlowDetector = {
  stop: () => void;
};

export async function startBlowDetection(onBlow: () => void): Promise<BlowDetector> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let sustainedFrames = 0;
  let fired = false;
  let raf = 0;

  const tick = () => {
    analyser.getByteFrequencyData(data);
    // Blowing into a mic energizes low-mid frequencies broadly; use RMS as a simple proxy.
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    const rms = Math.sqrt(sum / data.length);

    if (rms > 35) {
      sustainedFrames++;
    } else {
      sustainedFrames = Math.max(0, sustainedFrames - 1);
    }

    if (sustainedFrames > 6 && !fired) {
      fired = true;
      onBlow();
    }

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    stop: () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();
    },
  };
}
