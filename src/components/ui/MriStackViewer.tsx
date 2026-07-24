import { useState, useEffect, useRef, useCallback } from "react";
import { wheelSliceStep } from "@/components/ui/mri-stack-wheel";

/**
 * Scrollable MRI stack viewer.
 *
 * Radiologist-style viewing:
 *   - Horizontal trackpad swipe or Shift+wheel to change slice
 *   - Click-and-drag (up/down) to scrub
 *   - Touch: drag to scrub, PINCH to zoom, double-tap to zoom, drag to pan when zoomed
 *   - Arrow keys ↑/↓ or ←/→ for one slice at a time; Home/End for first/last
 *   - Play/pause cine loop; Space toggles
 *
 * The whole active plane is preloaded up-front (stacks are small, ~2 MB) so fast
 * finger-scrolling on a phone never hits the loading spinner.
 */

export interface MriStackSlice {
  src: string;
  alt: string;
}

export interface MriStackViewerProps {
  slices: MriStackSlice[];
  title?: string;
  plane?: string;
  caption?: string;
  attribution: string;
  sourceUrl?: string;
  startIndex?: number;
  initialCineMs?: number;
  onSliceChange?: (sliceIndex: number) => void;
}

const MAX_ZOOM = 4;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function MriStackViewer({
  slices,
  title,
  plane,
  caption,
  attribution,
  sourceUrl,
  startIndex = 0,
  initialCineMs = 150,
  onSliceChange,
}: MriStackViewerProps) {
  const total = slices.length;
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(0, startIndex), Math.max(0, total - 1)),
  );
  const [cinePlaying, setCinePlaying] = useState(false);
  const [cineMs] = useState(initialCineMs);
  // Which slices have decoded in the on-screen <img>. Only the VISIBLE slice's
  // onLoad writes here — the background preloader below just warms the browser
  // cache and never touches state, so opening a plane doesn't fire ~N re-renders.
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());
  const [failedSet, setFailedSet] = useState<Set<number>>(new Set());
  const [retryRevision, setRetryRevision] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [gesturing, setGesturing] = useState(false);

  // Window/level practice: brightness + contrast (and invert) applied as a CSS
  // filter — calibration-free and reinforces the "adjust W/L per structure"
  // skill the modules teach. Persists across slices; resets when the stack changes.
  const [bright, setBright] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [invert, setInvert] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const wlAdjusted = bright !== 1 || contrast !== 1 || invert;
  const resetWl = () => {
    setBright(1);
    setContrast(1);
    setInvert(false);
  };

  const viewportRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<{
    mode: "scrub" | "pan" | "pinch";
    startIndex: number;
    startClientY: number;
    startClient: { x: number; y: number };
    startPan: { x: number; y: number };
    startZoom: number;
    startDist: number;
  } | null>(null);
  const lastTapRef = useRef(0);
  const downPtRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

  const maxIndex = Math.max(0, total - 1);
  const safeIndex = Math.min(index, maxIndex);
  const onSliceChangeRef = useRef(onSliceChange);

  useEffect(() => {
    onSliceChangeRef.current = onSliceChange;
  }, [onSliceChange]);

  useEffect(() => {
    onSliceChangeRef.current?.(safeIndex);
  }, [safeIndex, slices]);

  // Reset loaded/zoom/pan AND jump to the new stack's own startIndex whenever the
  // stack changes — adjusted during render (not in an effect) so a new plane never
  // shows a stale frame or carries the previous plane's slice position. Callers
  // must keep `slices` referentially stable across unrelated re-renders (memoize it)
  // or this reset fires spuriously and wipes zoom/pan.
  const [prevSlices, setPrevSlices] = useState(slices);
  if (slices !== prevSlices) {
    setPrevSlices(slices);
    setLoadedSet(new Set());
    setFailedSet(new Set());
    setRetryRevision(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBright(1);
    setContrast(1);
    setInvert(false);
    setIndex(Math.min(Math.max(0, startIndex), Math.max(0, slices.length - 1)));
  }

  // Preload the active plane, but in PRIORITY ORDER — the opening slice first,
  // then expanding outward — so the viewer paints immediately even on slow
  // hospital wifi while the rest of the plane streams in behind it (keeping fast
  // scrubbing spinner-free once loaded). Same URLs are deduped with the visible
  // <img> (which is marked fetchPriority="high"), so the on-screen slice wins.
  useEffect(() => {
    const center = Math.min(Math.max(0, startIndex), Math.max(0, slices.length - 1));
    const order: number[] = slices.length ? [center] : [];
    for (let d = 1; d < slices.length; d++) {
      if (center - d >= 0) order.push(center - d);
      if (center + d < slices.length) order.push(center + d);
    }
    // Construct the Image objects only to warm the browser cache in priority
    // order — we intentionally don't track their load state in React. The
    // on-screen <img> below (same deduped URL) owns the spinner via its own
    // onLoad, so background warming never re-renders this component. No cleanup:
    // these handler-less Images GC on their own, and letting in-flight fetches
    // finish is the whole point (they populate the cache for the next plane).
    order.forEach((i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = slices[i].src;
    });
  }, [slices, startIndex]);

  // Cine loop
  useEffect(() => {
    if (!cinePlaying || total <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), cineMs);
    return () => window.clearInterval(id);
  }, [cinePlaying, cineMs, total]);

  // Preserve ordinary vertical page scrolling over the large viewer. Horizontal
  // trackpad gestures and Shift+wheel retain fast radiology-style stack scrubbing.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || total <= 1) return;
    const onWheelNative = (e: WheelEvent) => {
      const step = wheelSliceStep(e);
      if (step === 0) return;
      e.preventDefault();
      setCinePlaying(false);
      setIndex((i) => Math.min(total - 1, Math.max(0, i + step)));
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [total]);

  const clampPan = useCallback((p: { x: number; y: number }, z: number) => {
    const el = viewportRef.current;
    if (!el) return p;
    const maxX = ((z - 1) * el.clientWidth) / 2;
    const maxY = ((z - 1) * el.clientHeight) / 2;
    return { x: clamp(p.x, -maxX, maxX), y: clamp(p.y, -maxY, maxY) };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const pts = [...pointersRef.current.values()];

      // Double-tap / double-click toggles zoom. Only a *stationary* tap arms the
      // next one (armed in onPointerUp): a scrub/pan drag must never register as a
      // tap, or rapid slice-flicking would trip an accidental zoom mid-scrub.
      const now = e.timeStamp;
      if (pts.length === 1 && lastTapRef.current > 0 && now - lastTapRef.current < 300) {
        const z = zoom > 1 ? 1 : 2.5;
        setZoom(z);
        setPan(z === 1 ? { x: 0, y: 0 } : (p) => clampPan(p, z));
        lastTapRef.current = 0;
      }
      downPtRef.current = { x: e.clientX, y: e.clientY };
      movedRef.current = false;

      if (pts.length === 2) {
        gestureRef.current = {
          mode: "pinch",
          startIndex: safeIndex,
          startClientY: e.clientY,
          startClient: { x: e.clientX, y: e.clientY },
          startPan: pan,
          startZoom: zoom,
          startDist: dist(pts[0], pts[1]) || 1,
        };
      } else if (total > 1 || zoom > 1) {
        gestureRef.current = {
          mode: zoom > 1 ? "pan" : "scrub",
          startIndex: safeIndex,
          startClientY: e.clientY,
          startClient: { x: e.clientX, y: e.clientY },
          startPan: pan,
          startZoom: zoom,
          startDist: 1,
        };
      }
      setGesturing(gestureRef.current !== null);
    },
    [safeIndex, total, zoom, pan, clampPan],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (!movedRef.current) {
        const dx = e.clientX - downPtRef.current.x;
        const dy = e.clientY - downPtRef.current.y;
        if (dx * dx + dy * dy > 100) movedRef.current = true; // moved > ~10px → a drag, not a tap
      }
      const g = gestureRef.current;
      if (!g) return;
      const pts = [...pointersRef.current.values()];

      if (g.mode === "pinch" && pts.length >= 2) {
        const z = clamp((g.startZoom * dist(pts[0], pts[1])) / g.startDist, 1, MAX_ZOOM);
        setZoom(z);
        if (z <= 1.02) setPan({ x: 0, y: 0 });
        else setPan((p) => clampPan(p, z));
      } else if (g.mode === "pan") {
        setPan(clampPan({ x: g.startPan.x + (e.clientX - g.startClient.x), y: g.startPan.y + (e.clientY - g.startClient.y) }, zoom));
      } else if (g.mode === "scrub") {
        // Taking manual control stops the cine timer — otherwise auto-advance
        // fights the drag and the slice jumps out from under the finger.
        setCinePlaying(false);
        const h = viewportRef.current?.clientHeight ?? 480;
        const pxPerSlice = clamp(h / Math.max(total, 1), 6, 16);
        const delta = Math.round((e.clientY - g.startClientY) / pxPerSlice);
        setIndex(Math.min(total - 1, Math.max(0, g.startIndex + delta)));
      }
    },
    [total, zoom, clampPan],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) {
      // Arm a double-tap only for a stationary single-finger lift (timed from UP);
      // any drag clears it, so fast flicking can't be misread as a double-tap zoom.
      lastTapRef.current = movedRef.current ? 0 : e.timeStamp;
      gestureRef.current = null;
      setGesturing(false);
    } else if (pointersRef.current.size === 1 && gestureRef.current?.mode === "pinch") {
      gestureRef.current = null; // drop out of pinch; next move starts fresh
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          if (total <= 1) return;
          e.preventDefault();
          setCinePlaying(false);
          setIndex((i) => Math.min(total - 1, i + 1));
          break;
        case "ArrowUp":
        case "ArrowLeft":
          if (total <= 1) return;
          e.preventDefault();
          setCinePlaying(false);
          setIndex((i) => Math.max(0, i - 1));
          break;
        case "Home":
          e.preventDefault();
          setCinePlaying(false);
          setIndex(0);
          break;
        case "End":
          e.preventDefault();
          setCinePlaying(false);
          setIndex(total - 1);
          break;
        case " ":
          if (total <= 1) return;
          e.preventDefault();
          setCinePlaying((p) => !p);
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom((z) => clamp(z + 0.5, 1, MAX_ZOOM));
          break;
        case "-":
          e.preventDefault();
          setZoom((z) => {
            const nz = clamp(z - 0.5, 1, MAX_ZOOM);
            if (nz === 1) setPan({ x: 0, y: 0 });
            return nz;
          });
          break;
      }
    },
    [total],
  );

  // A stable ref/onLoad callback prevents parent context updates from
  // detaching and reattaching the image ref, which would otherwise schedule a
  // state update during every commit in two-pane Compare mode.
  const markVisibleLoaded = useCallback(() => {
    setLoadedSet((prev) => (prev.has(safeIndex) ? prev : new Set(prev).add(safeIndex)));
    setFailedSet((prev) => {
      if (!prev.has(safeIndex)) return prev;
      const next = new Set(prev);
      next.delete(safeIndex);
      return next;
    });
  }, [safeIndex]);

  const markVisibleFailed = useCallback(() => {
    setLoadedSet((prev) => (prev.has(safeIndex) ? prev : new Set(prev).add(safeIndex)));
    setFailedSet((prev) => (prev.has(safeIndex) ? prev : new Set(prev).add(safeIndex)));
  }, [safeIndex]);

  if (total === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
        No images available for this stack.
      </div>
    );
  }

  const loaded = loadedSet.has(safeIndex);
  const failed = failedSet.has(safeIndex);

  const showPlay = total > 1;
  const zoomed = zoom > 1.02;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      {(title || plane) && (
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            {title && <span className="font-semibold text-gray-900">{title}</span>}
            {plane && (
              <span className="rounded bg-ucla-blue/10 px-2 py-0.5 text-xs font-medium text-ucla-blue">
                {plane}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-500 tabular-nums">
            {safeIndex + 1} / {total}
          </span>
        </div>
      )}

      {/* Image viewport.
          On phones the viewport is touch-locked (touch-action: none) so drags
          scrub slices (vertical) instead of scrolling. To keep that from trapping
          page scroll, small screens cap the height (max-h-[70svh]) and inset the
          box with generous auto side gutters (~2.5rem each) — a swipe starting in
          those gutters lands on the card (no touch-action) and scrolls the page
          normally, so the fellow can always scroll past the viewer with a thumb-
          width margin on either side. sm: restores the full-width / max-h-[600px]
          desktop layout unchanged. */}
      {/* Screen-reader live announcement of the current slice position. Suppressed
          during cine playback / active scrub so rapid changes don't flood the
          screen reader — only discrete, settled steps are announced. */}
      <span className="sr-only" role="status" aria-live="polite">
        {!cinePlaying && !gesturing ? `Slice ${safeIndex + 1} of ${total}` : ""}
      </span>
      <div
        ref={viewportRef}
        data-testid="mri-stack-viewer"
        data-slice-index={safeIndex}
        data-slice-count={total}
        role="group"
        aria-roledescription="MRI stack viewer"
        aria-label={`${[title, plane].filter(Boolean).join(" ") || "Normal"} MRI — ${total} ${
          total === 1 ? "slice" : "slices"
        }. Arrow keys, horizontal trackpad gestures, or Shift plus mouse wheel change slice; Home and End jump to first and last${
          showPlay ? "; Space plays or pauses the cine loop" : ""
        }.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // outline-none needs a replacement: this viewport is keyboard-focusable
        // (tabIndex=0, arrow/Home/End/Space controls) but showed no focus state.
        // ring-inset + gold reads against the black viewport.
        className={`relative mx-auto flex aspect-square max-h-[70svh] w-[calc(100%-5rem)] touch-none select-none items-center justify-center overflow-hidden bg-black outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ucla-gold sm:mx-0 sm:max-h-[600px] sm:w-full ${
          zoomed ? "cursor-grab" : "cursor-ns-resize"
        }`}
        style={{ touchAction: "none" }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-ucla-blue" />
          </div>
        )}
        <img
          key={`${slices[safeIndex].src}:${retryRevision}`}
          // Cached images can be `complete` before onLoad attaches and never
          // fire it, leaving the spinner stuck — clear it synchronously here.
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0) markVisibleLoaded();
          }}
          src={slices[safeIndex].src}
          alt={slices[safeIndex].alt}
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className={`max-h-full max-w-full select-none object-contain will-change-transform ${
            failed ? "invisible" : ""
          }`}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            filter: `brightness(${bright}) contrast(${contrast})${invert ? " invert(1)" : ""}`,
            transition: gesturing ? "none" : "transform 120ms ease-out",
          }}
          onLoad={markVisibleLoaded}
          onError={markVisibleFailed}
        />
        {failed && (
          <div
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white"
          >
            <p>This MRI slice could not be loaded.</p>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setLoadedSet((prev) => {
                  const next = new Set(prev);
                  next.delete(safeIndex);
                  return next;
                });
                setFailedSet((prev) => {
                  const next = new Set(prev);
                  next.delete(safeIndex);
                  return next;
                });
                setRetryRevision((revision) => revision + 1);
              }}
              className="rounded-md border border-white/60 bg-white/10 px-3 py-2 font-medium hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ucla-gold"
            >
              Retry image
            </button>
          </div>
        )}
        {/* Slice indicator + zoom badge */}
        <div className="pointer-events-none absolute bottom-2 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white tabular-nums">
          {safeIndex + 1} / {total}
        </div>
        {zoomed && (
          <button
            type="button"
            aria-label="Reset zoom"
            title="Reset zoom"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white hover:bg-black/80"
          >
            {zoom.toFixed(1)}× · reset
          </button>
        )}
      </div>

      {/* Slider + controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50 px-3 py-2 sm:flex-nowrap sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => setShowAdjust((v) => !v)}
          aria-pressed={showAdjust}
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition sm:h-7 sm:w-7 ${
            showAdjust || wlAdjusted
              ? "border-ucla-blue bg-ucla-blue/10 text-ucla-blue"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Adjust window/level (brightness and contrast)"
          title="Window / level"
        >
          <svg className="h-5 w-5 sm:h-3.5 sm:w-3.5" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 2.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" />
          </svg>
        </button>
        {showPlay && (
          <button
            type="button"
            onClick={() => setCinePlaying((p) => !p)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ucla-blue text-white transition hover:bg-ucla-dark sm:h-7 sm:w-7"
            aria-label={cinePlaying ? "Pause cine" : "Play cine"}
            title={cinePlaying ? "Pause" : "Play"}
          >
            {cinePlaying ? (
              <svg className="h-5 w-5 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 4.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-1.5 0v-9.5a.75.75 0 0 1 .75-.75zM14.25 4.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-1.5 0v-9.5a.75.75 0 0 1 .75-.75z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 translate-x-px sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 3.86A.75.75 0 0 0 5.25 4.5v11a.75.75 0 0 0 1.14.64l9-5.5a.75.75 0 0 0 0-1.28l-9-5.5z" />
              </svg>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setCinePlaying(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={safeIndex <= 0}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white sm:h-7 sm:w-7"
          aria-label="Previous slice"
          title="Previous slice"
        >
          <svg className="h-5 w-5 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.24a.75.75 0 0 1 0-1.06l4.25-4.24a.75.75 0 0 1 1.06 0z" />
          </svg>
        </button>
        <div className="relative order-last flex w-full flex-none items-center sm:order-none sm:flex-1">
          <input
            type="range"
            min={0}
            max={total - 1}
            value={safeIndex}
            onChange={(e) => {
              setCinePlaying(false);
              setIndex(Number(e.target.value));
            }}
            className="relative z-10 w-full accent-ucla-blue py-4 sm:py-0"
            aria-label="Slice position"
            aria-valuetext={`Slice ${safeIndex + 1} of ${total}`}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setCinePlaying(false);
            setIndex((i) => Math.min(total - 1, i + 1));
          }}
          disabled={safeIndex >= maxIndex}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white sm:h-7 sm:w-7"
          aria-label="Next slice"
          title="Next slice"
        >
          <svg className="h-5 w-5 sm:h-3.5 sm:w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.21 14.77a.75.75 0 0 1 0-1.06L10.94 10 7.21 6.29a.75.75 0 1 1 1.06-1.06l4.25 4.24a.75.75 0 0 1 0 1.06l-4.25 4.24a.75.75 0 0 1-1.06 0z" />
          </svg>
        </button>
      </div>

      {/* Window/level adjust panel — practice the W/L skill the modules teach */}
      {showAdjust && (
        <div className="flex flex-col gap-2.5 border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:gap-4">
          <label className="flex flex-1 items-center gap-2">
            <span className="w-16 shrink-0 text-gray-500">Brightness</span>
            <input
              type="range"
              min={0.4}
              max={1.8}
              step={0.02}
              value={bright}
              onChange={(e) => setBright(Number(e.target.value))}
              className="flex-1 accent-ucla-blue"
              aria-label="Brightness"
            />
          </label>
          <label className="flex flex-1 items-center gap-2">
            <span className="w-16 shrink-0 text-gray-500">Contrast</span>
            <input
              type="range"
              min={0.4}
              max={2.2}
              step={0.02}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="flex-1 accent-ucla-blue"
              aria-label="Contrast"
            />
          </label>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setInvert((v) => !v)}
              aria-pressed={invert}
              className={`rounded-md border px-2.5 py-1 font-medium transition ${
                invert
                  ? "border-ucla-blue bg-ucla-blue/10 text-ucla-blue"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Invert
            </button>
            <button
              type="button"
              onClick={resetWl}
              disabled={!wlAdjusted}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Caption + attribution */}
      {(caption || attribution) && (
        <div className="border-t border-gray-100 px-4 py-2 text-xs">
          {caption && <p className="text-gray-700">{caption}</p>}
          {attribution && (
            <p className="mt-1 text-gray-500">
              {attribution}
              {sourceUrl && (
                <>
                  {" · "}
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ucla-blue hover:underline"
                  >
                    source
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
