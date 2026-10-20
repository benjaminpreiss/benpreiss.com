<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { ProjectRecording } from "../lib/project-media";
  import { attachHls, type HlsPlayback } from "../lib/hls-playback";
  import ui from "../../content/ui.json";

  let { recording, device, title, locale }: {
    recording: ProjectRecording; device: "mobile" | "desktop";
    title: string; locale: "de" | "en";
  } = $props();
  let frame: HTMLDivElement;
  let video: HTMLVideoElement;
  let ready = $state(false);
  let enhanced = $state(false);
  let playing = $state(false);
  let message = $state("");
  let toggle = () => {};
  let reportFailure = () => {};
  const text = $derived(ui[locale].video);

  onMount(() => {
    const desktop = matchMedia("(min-width: 769px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let userPaused = false;
    let manual = false;
    let loaded = false;
    let loading: Promise<void> | undefined;
    let streaming: HlsPlayback | undefined;
    let sourceAbort = new AbortController();
    let failed = false;
    let revision = 0;
    const eligible = () => device === "mobile" || desktop.matches;
    const shouldPlay = () => visible && !document.hidden && eligible() && !failed && !userPaused && (!motion.matches || manual);
    const fail = () => {
      if (disposed) return;
      failed = true;
      message = text.failed;
      video.pause();
      streaming?.suspend();
    };
    reportFailure = fail;
    const unload = () => {
      revision++;
      sourceAbort.abort();
      sourceAbort = new AbortController();
      streaming?.destroy();
      streaming = undefined;
      loading = undefined;
      video.pause();
      video.replaceChildren();
      video.removeAttribute("src");
      video.load();
      loaded = false;
      enhanced = false;
    };
    const createSource = async (signal: AbortSignal) => {
      await import("@videojs/html/video/player");
      if (signal.aborted || disposed || !shouldPlay()) return;
      enhanced = true;
      await tick();
      if (signal.aborted || disposed || !shouldPlay()) return;
      video.muted = true;
      if ("hls" in recording) {
        streaming = await attachHls(video, recording.hls, signal, fail);
      } else {
        const sources = [
          { src: recording.webm, type: "video/webm" },
          { src: recording.mp4, type: "video/mp4" },
        ];
        for (const [index, source] of sources.entries()) {
          const element = document.createElement("source");
          element.src = source.src;
          element.type = source.type;
          if (index === sources.length - 1) element.addEventListener("error", fail, { once: true });
          video.append(element);
        }
        video.load();
      }
      if (!signal.aborted) loaded = true;
    };
    const load = () => {
      if (loaded) return Promise.resolve();
      if (loading) return loading;
      const task = createSource(sourceAbort.signal);
      loading = task;
      return task.finally(() => { if (loading === task) loading = undefined; });
    };
    const sync = async () => {
      const current = ++revision;
      if (!shouldPlay()) {
        video.pause();
        streaming?.suspend();
        if (!loaded) unload();
        return;
      }
      try {
        await load();
        if (disposed || current !== revision || !loaded || !shouldPlay()) return;
        streaming?.resume();
        await video.play();
        if (disposed || !shouldPlay()) video.pause();
        else message = "";
      } catch (error) {
        if (disposed || current !== revision) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          message = text.blocked;
          streaming?.suspend();
        } else fail();
      }
    };
    toggle = () => {
      if (!video.paused) { userPaused = true; manual = false; revision++; video.pause(); streaming?.suspend(); }
      else {
        if (failed) { unload(); failed = false; }
        userPaused = false;
        manual = true;
        void sync();
      }
    };
    const viewportChanged = () => {
      if (!eligible()) unload();
      void sync();
    };
    const motionChanged = () => { manual = false; void sync(); };
    const visibilityChanged = () => { void sync(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; void sync(); });
    observer.observe(frame);
    desktop.addEventListener("change", viewportChanged);
    motion.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    ready = true;
    return () => {
      disposed = true;
      observer.disconnect();
      desktop.removeEventListener("change", viewportChanged);
      motion.removeEventListener("change", motionChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      unload();
      // Removing the custom element disconnects Video.js's controller and its subscriptions.
    };
  });
</script>

<div bind:this={frame} class={`group/video relative mx-auto w-[65%] ${device === "desktop" ? "hidden min-[769px]:block" : "min-[769px]:w-[15%]"}`} data-device={device}>
  <svelte:element this={enhanced ? "video-player" : "div"} class="block overflow-hidden shadow-video-sm">
    <!-- These silent screen recordings have no spoken content; project prose supplies their description. -->
    <!-- svelte-ignore a11y_media_has_caption -->
    <video class="block w-full h-auto scale-[1.01]" bind:this={video} width={recording.width} height={recording.height} poster={recording.poster} preload="none" muted loop playsinline
      aria-label={`${title} — ${text.devices[device]}`} onplay={() => playing = true} onpause={() => playing = false}
      onerror={() => reportFailure()}></video>
  </svelte:element>
  {#if ready}
    <button class="[font:inherit] bg-white text-ben-black py-1 px-2 rounded absolute bottom-2 left-2 max-w-[calc(100%-1rem)] opacity-0 group-hover/video:opacity-100 focus-visible:opacity-100 motion-reduce:opacity-100 [@media(hover:none)]:opacity-100" type="button" onclick={() => toggle()} aria-label={`${playing ? text.pause : text.play}: ${title} — ${text.devices[device]}`}>
      {playing ? text.pause : text.play}
    </button>
  {:else}
    <a class="[font:inherit] bg-white text-ben-black py-1 px-2 rounded" href={"hls" in recording ? recording.hls : recording.mp4}>{text.open}</a>
  {/if}
  <p class="text-sm leading-normal bg-white" role="status">{message}</p>
</div>
