"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import Window from "./Window";
import PhotosWindow from "./windows/PhotosWindow";
import LoreWindow from "./windows/LoreWindow";
import MusicWindow from "./windows/MusicWindow";
import GamesWindow from "./windows/GamesWindow";
import FileExplorerWindow from "./windows/FileExplorerWindow";

type WinId = "files" | "photos" | "lore" | "music" | "games";

export default function Desktop({openFilesOnLoad}: { openFilesOnLoad?: boolean}) {
  const [open, setOpen] = useState<Record<WinId, boolean>>({
    files: false,
    photos: false,
    lore: false,
    music: false,
    games: false,
  });

    useEffect(() => {
    if (openFilesOnLoad) {
      setOpen(prev => ({
        ...prev,
        files: true,   // opens File Explorer
      }));
    }
  }, [openFilesOnLoad]);
  
  const openWin = (id: WinId) => setOpen((p) => ({ ...p, [id]: true }));
  const closeWin = (id: WinId) => setOpen((p) => ({ ...p, [id]: false }));

  return (
    <div className="desktop">
      <div className="iconGrid">
        <Icon label="My Computer" iconSrc="/window.svg" onOpen={() => openWin("files")} />
      </div>
    {open.files && (
        <Window title="My Computer" onClose={() => closeWin("files")}>
        <FileExplorerWindow
            onOpenFolder={(id) => {
                if (id === "photos") openWin("photos");
                if (id === "lore") openWin("lore");
                if (id === "music") openWin("music");
                if (id === "games") openWin("games");
            }}
            />
    </Window>
    )}
   

      {open.games && (
        <Window title="Minigames" onClose={() => closeWin("games")}>
          <GamesWindow />
        </Window>
      )}

      <div className="taskbar">
            <div className="startBtn">♥</div>
            <div className="taskbarText">ifellinlovewithzeldagirl OS</div>
            <div className="clock">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
    </div>
    
  );
}