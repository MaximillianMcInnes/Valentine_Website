"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/link";
import Window from "@/components/Window";
import FileExplorerWindow from "@/components/windows/FileExplorerWindow";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_MUSIC_ID = "rv-ssyQIgak";

export default function Home() {
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [muted, setMuted] = useState(true);

  const playerRef = useRef<any>(null);
  const startedRef = useRef(false);

  // Load YouTube Iframe API once
  useEffect(() => {
    if (window.YT && window.YT.Player) return;

    const existing = document.querySelector('script[data-yt-iframe-api="1"]');
    if (existing) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.dataset.ytIframeApi = "1";
    document.body.appendChild(tag);
  }, []);

  // Create player (hidden) + start playback after first user gesture
  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const createPlayer = () => {
        if (playerRef.current) return;
        if (!window.YT || !window.YT.Player) return;

        playerRef.current = new window.YT.Player("yt-music-player", {
          videoId: YT_MUSIC_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            loop: 1,
            playlist: YT_MUSIC_ID, // required for looping a single video
          },
          events: {
            onReady: (e: any) => {
              // Start muted (autoplay-friendly), then play
              e.target.mute();
              e.target.playVideo();


              e.target.unMute();
              setMuted(false);
            },
          },
        });
      };

      // If API already loaded, create immediately; else wait for callback
      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          prev?.();
          createPlayer();
        };
      }

      window.removeEventListener("click", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };

    window.addEventListener("click", start);
    window.addEventListener("keydown", start);
    window.addEventListener("touchstart", start);

    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };
  }, []);

  // Apply mute/unmute without reloading the player
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;

    // make sure it's playing
    try {
      p.playVideo?.();
      if (muted) p.mute?.();
      else p.unMute?.();
    } catch {
      // ignore
    }
  }, [muted]);

  const toggleMusic = () => {
    // This click counts as a user gesture; unmute should work reliably here
    setMuted((m) => !m);
  };

  return (
    <>
      {/* Hidden player mount point */}
      <div
        id="yt-music-player"
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          left: -9999,
          top: -9999,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <Link onOpenExplorer={() => setExplorerOpen(true)} />

      <button className="musicToggle" onClick={toggleMusic} title="Toggle music">
        {muted ? "🔇" : "🎵"}
      </button>

      {explorerOpen && (
        <Window title="My Computer" onClose={() => setExplorerOpen(false)}>
          <FileExplorerWindow />
        </Window>
      )}
    </>
  );
}