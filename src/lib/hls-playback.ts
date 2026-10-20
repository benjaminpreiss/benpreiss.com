export interface HlsPlayback {
  resume(): void;
  suspend(): void;
  destroy(): void;
}

// Video.js continues to own the native video's player/store. This adapter only
// supplies HLS media to that same element and owns the streaming engine lifetime.
export async function attachHls(
  video: HTMLVideoElement,
  url: string,
  signal: AbortSignal,
  onFatal: () => void,
): Promise<HlsPlayback> {
  signal.throwIfAborted();
  const native = () => {
    video.src = url;
    video.load();
    return { resume() {}, suspend() {}, destroy() {} };
  };
  const nativeSupport = Boolean(video.canPlayType("application/vnd.apple.mpegurl"));
  // hls.js documents that Chromium may report native HLS without reliably
  // handling all streams. Prefer native on ManagedMediaSource platforms (Safari)
  // or older native-only browsers, rather than trusting canPlayType alone.
  if (nativeSupport && ("ManagedMediaSource" in window || !("MediaSource" in window)))
    return native();
  const { default: Hls } = await import("hls.js");
  signal.throwIfAborted();
  if (!Hls.isSupported()) {
    if (nativeSupport) return native();
    throw new Error("HLS playback is unavailable in this browser");
  }
  const hls = new Hls({
    autoStartLoad: false,
    capLevelToPlayerSize: true,
    maxBufferLength: 10,
    maxMaxBufferLength: 20,
    backBufferLength: 5,
  });
  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    signal.removeEventListener("abort", destroy);
    hls.destroy();
  };
  signal.addEventListener("abort", destroy, { once: true });
  hls.on(Hls.Events.ERROR, (_event, data) => {
    if (!destroyed && data.fatal) {
      hls.stopLoad();
      onFatal();
    }
  });
  hls.attachMedia(video);
  hls.loadSource(url);
  return {
    resume: () => {
      if (!destroyed) hls.startLoad();
    },
    suspend: () => {
      if (!destroyed) hls.stopLoad();
    },
    destroy,
  };
}
