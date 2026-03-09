"use client";

import { useEffect, useRef, useState } from "react";

type Dir = "down" | "left" | "right" | "up";

// ✅ move these ABOVE usage so TS is happy
type DecorKind = "rose" | "popcorn" | "tulip";

type CharacterKind = "link" | "zelda"

type SpriteConfig = {
  src: string;
  originX: number;
  originY: number;
  tile: number;
  tileGap: number;
  frameColsForDir: Record<Dir, number>;
  usesFlipLeft: boolean;
}


const SPRITES: Record<CharacterKind, SpriteConfig> = {
  link: {
    src: "/sprites/spritesheet.png",
    originX: 1,
    originY: 11,
    tile: 16,
    tileGap: 17,
    frameColsForDir: {
      down: 0,
      right: 2,
      left: 2,
      up: 4,
    },
    usesFlipLeft: true,
  },

  zelda: {
    src: "/sprites/zeldaspritesheet.png",
    originX: 0,
    originY: 2,
    tile: 22,
    tileGap: 20,
    frameColsForDir: {
      down: 0,
      right: 2,
      left: 6,
      up: 4,
    },
    usesFlipLeft: false,
  },
};


type Decor = {
  kind: DecorKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};



export default function Link({
  spriteSrc = "/sprites/spritesheet.png",
  onOpenExplorer,
}: {
  spriteSrc?: string;
  onOpenExplorer: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const posRef = useRef({ x: 0, y: 0 });
  const initRef = useRef(false);

  const wasOverlappingRef = useRef(false);

  const characterRef = useRef<CharacterKind>("zelda");
  const imagesRef = useRef<Record<CharacterKind, HTMLImageElement> | null>(null);
  const decorRef = useRef<Decor[] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // -------------------------
    // SPRITESHEET CONFIG
    // -------------------------
    const ORIGIN_X = 1;
    const ORIGIN_Y = 11;

    const WALK_COLS = [0, 1, 2];



    const FRAME_COL_FOR_DIR: Record<Dir, number> = {
      down: 0,
      right: 2,
      left: 2, // flipped
      up: 4,
    };

    // -------------------------
    // GAME FEEL
    // -------------------------
    const TILE = 16;
    const TILE_GAP = 17;
    const ANIM_FPS = 10;
    const SPEED = 144;
    const SCALE = 4;
    const SHOW_HELP = true;

    // -------------------------
    // STATE
    // -------------------------
    const keys = new Set<string>();
    let running = true;

    if (!initRef.current) {
      posRef.current.x = window.innerWidth / 2 - 32;
      posRef.current.y = window.innerHeight - 120;
      initRef.current = true;
    }

    let x = posRef.current.x;
    let y = posRef.current.y;
    let dir: Dir = "down";

    const dog = {
      x: () => window.innerWidth / 2 + 100,
      y: () => window.innerHeight / 2,
      size: 48,
    }

    let showDogText = false;

    const target = {
      w: 220,
      h: 90,
      x: () => window.innerWidth / 2 - 110,
      y: () => 40,
    };

    let frame = 0;
    let lastAnimTime = 0;
    let lastTime = performance.now();

    const img = new Image();
    img.src = spriteSrc;
    img.onload = () => setLoaded(true);

    // -------------------------
    // DECOR (persistent arrangement)
    // -------------------------
    const decorImgs: Record<DecorKind, HTMLImageElement> = {
      popcorn: new Image(),
      rose: new Image(),
      tulip: new Image(),
    };
    const dogImg = new Image()
    dogImg.src = "/sprites/chihuahua.png"

    decorImgs.popcorn.src = "/sprites/roncorn.png";
    decorImgs.rose.src = "/sprites/rose.png";
    decorImgs.tulip.src = "/sprites/tulip.png";

    const DECOR_COUNT = 90;

    const KIND_POOL: DecorKind[] = ["rose", "rose", "tulip", "tulip", "popcorn"];

    const randKindVal = (): DecorKind =>
      KIND_POOL[Math.floor(Math.random() * KIND_POOL.length)];

    const spawnDecor = () => {
      const arr: Decor[] = [];
      const topY = 140;
      const bottomY = window.innerHeight - 80;

      for (let i = 0; i < DECOR_COUNT; i++) {
        arr.push({
          kind: randKindVal(),
          x: 60 + Math.random() * (window.innerWidth - 120),
          y: topY + Math.random() * (bottomY - topY),
          vx: 0,
          vy: 0,
          size: 14 + Math.random() * 10,
        });
      }
      return arr;
    };


    if (!imagesRef.current) {
      const linkImg = new Image();
      const zeldaImg = new Image();

      linkImg.src = SPRITES.link.src;
      zeldaImg.src = SPRITES.zelda.src;

      imagesRef.current = {
        link: linkImg,
        zelda: zeldaImg,
      };

      let loadedCount = 0;
      const markLoaded = () => {
        loadedCount++;
        if (loadedCount >= 2) setLoaded(true);
      };

      linkImg.onload = markLoaded;
      zeldaImg.onload = markLoaded;
    }

    const images = imagesRef.current;

    // ✅ generate ONCE (unless you explicitly clear decorRef.current somewhere)
    if (!decorRef.current) {
      decorRef.current = spawnDecor();
    }
    const decor = decorRef.current;

    // -------------------------
    // Canvas resize
    // -------------------------
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key);
      if (e.key === "Enter") onOpenExplorer();
      
      if (e.key.toLowerCase() === "q") {
        characterRef.current = characterRef.current === "link" ? "zelda" : "link";
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const bounds = {
      left: 40,
      top: 80,
      right: () => window.innerWidth - 40,
      bottom: () => window.innerHeight - 60,
    };


  
  const drawDogSpeech = () => {
    if (!showDogText) return;

    const dx = dog.x();
    const dy = dog.y();

    const text = "bark awkwardly";
    const padding = 8;

    ctx.save();

    ctx.font = "14px Tahoma, Arial, sans-serif";
    const width = ctx.measureText(text).width;

    const boxW = width + padding * 2;
    const boxH = 30;
    const boxX = dx + dog.size + 10;
    const boxY = dy - 6;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = "black";
    ctx.fillText(text, boxX + padding, boxY + 20);

    ctx.restore();
  };
    const drawTarget = () => {
      const tx = target.x();
      const ty = target.y();

      ctx.save();
      ctx.fillStyle = "#d4d0c8";
      ctx.strokeStyle = "#8e8c86";
      ctx.lineWidth = 2;

      ctx.fillRect(tx, ty, target.w, target.h);
      ctx.strokeRect(tx, ty, target.w, target.h);

      ctx.fillStyle = "#084ea7";
      ctx.fillRect(tx, ty, target.w, 20);

      ctx.fillStyle = "#fff";
      ctx.font = "12px Tahoma, Arial, sans-serif";
      ctx.fillText("My Computer", tx + 8, ty + 14);

      ctx.fillStyle = "#111";
      ctx.font = "12px Tahoma, Arial, sans-serif";
      ctx.fillText("Open C:\\US", tx + 10, ty + 48);
      ctx.fillText("(walk into this)", tx + 10, ty + 66);

      ctx.restore();
    };


    const drawDog = () => {
      if (!dogImg || dogImg.naturalWidth === 0) return;

      const dx = dog.x();
      const dy = dog.y();
      const s = dog.size;

      ctx.drawImage(
        dogImg,
        Math.round(dx),
        Math.round(dy),
        s,
        s
      );
    };

    const drawDecor = () => {
      for (const d of decor) {
        const im = decorImgs[d.kind];
        if (!im || im.naturalWidth === 0) continue;
        const s = d.size;
        ctx.drawImage(
          im,
          Math.round(d.x - s / 2),
          Math.round(d.y - s / 2),
          s,
          s
        );
      }
    };

    const drawBackground = () => {
      const g = ctx.createLinearGradient(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );
      g.addColorStop(0, "#2a7fb0");
      g.addColorStop(1, "#1c5f88");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const drawUI = () => {
      if (!SHOW_HELP) return;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "14px Tahoma, Arial, sans-serif";
      ctx.fillText("Arrow keys / WASD to walk", 24, 28);
      ctx.fillText("Q to switch Link/Zelda", 24, 48);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "12px Tahoma, Arial, sans-serif";
    };

    const drawCharacter = () => {
      const active = characterRef.current;
      const cfg = SPRITES[active];
      const img = images[active];

      if (!img || img.naturalWidth === 0) return;

      const local = frame % 2;
      const baseCol = cfg.frameColsForDir[dir];
      const col = baseCol + local;

      const sx = cfg.originX + col * cfg.tileGap;
      const sy = cfg.originY;

      const dw = cfg.tile * SCALE;
      const dh = cfg.tile * SCALE;

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      if (dir === "left" && cfg.usesFlipLeft) {
        ctx.translate(Math.round(x) + dw, Math.round(y));
        ctx.scale(-1, 1);
        ctx.drawImage(img, sx, sy, cfg.tile, cfg.tile, 0, 0, dw, dh);
      } else {
        ctx.drawImage(
          img,
          sx,
          sy,
          cfg.tile,
          cfg.tile,
          Math.round(x),
          Math.round(y),
          dw,
          dh
        );
      }

      ctx.restore();
    };

    const step = (t: number) => {
      if (!running) return;

      const dt = Math.min(0.05, (t - lastTime) / 1000);
      lastTime = t;

      // Movement input
      let vx = 0;
      let vy = 0;

      if (keys.has("ArrowLeft") || keys.has("a")) vx -= 1;
      if (keys.has("ArrowRight") || keys.has("d")) vx += 1;
      if (keys.has("ArrowUp") || keys.has("w")) vy -= 1;
      if (keys.has("ArrowDown") || keys.has("s")) vy += 1;

      const moving = vx !== 0 || vy !== 0;

      if (moving) {
        if (Math.abs(vx) > Math.abs(vy)) dir = vx > 0 ? "right" : "left";
        else dir = vy > 0 ? "down" : "up";

        const mag = Math.hypot(vx, vy) || 1;
        vx /= mag;
        vy /= mag;

        x += vx * SPEED * dt;
        y += vy * SPEED * dt;

        posRef.current.x = x;
        posRef.current.y = y;

        if (t - lastAnimTime > 1000 / ANIM_FPS) {
          frame = (frame + 1) % 2;
          lastAnimTime = t;
        }
      } else {
        frame = 0;
      }

      // clamp
      x = Math.max(bounds.left, Math.min(x, bounds.right() - TILE * SCALE));
      y = Math.max(bounds.top, Math.min(y, bounds.bottom() - TILE * SCALE));

      // --- collision with target ---
      const dw = TILE * SCALE;
      const dh = TILE * SCALE;
      
      const dx = dog.x();
      const dy = dog.y();

      const nearDog = 
        x < dx + dog.size + 20 &&
        x + dw > dx - 20 &&
        y < dy + dog.size + 20 &&
        y + dh > dy - 20;



      showDogText = nearDog;

      
      const tx = target.x();
      const ty = target.y();

      const overlapTarget =
        x < tx + target.w &&
        x + dw > tx &&
        y < ty + target.h &&
        y + dh > ty;

      if (overlapTarget && !wasOverlappingRef.current) {
        onOpenExplorer();
      }

      wasOverlappingRef.current = overlapTarget;

      // --- decor pushing ---
      const linkFeet = {
        x: x + dw * 0.25,
        y: y + dh * 0.55,
        w: dw * 0.5,
        h: dh * 0.4,
      };

      const push = 220;
      const friction = 0.9;

      for (const d of decor) {
        const s = d.size * 3;

        const overlapDecor =
          linkFeet.x < d.x + s &&
          linkFeet.x + linkFeet.w > d.x &&
          linkFeet.y < d.y + s &&
          linkFeet.y + linkFeet.h > d.y;

        if (overlapDecor && moving) {
          const cx = d.x + s / 2;
          const cy = d.y + s / 2;
          const lx = x + dw / 2;
          const ly = y + dh * 0.8;

          let nx = cx - lx;
          let ny = cy - ly;
          const mag = Math.hypot(nx, ny) || 1;
          nx /= mag;
          ny /= mag;

          d.vx += nx * push * dt;
          d.vy += ny * push * dt;
        }

        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vx *= friction;
        d.vy *= friction;

        d.x = Math.max(30, Math.min(d.x, window.innerWidth - 30));
        d.y = Math.max(110, Math.min(d.y, window.innerHeight - 80));
      }

      // render
      drawBackground();
      drawDecor();
      drawTarget();
      drawDog();
      drawDogSpeech();
      drawUI();
      drawCharacter();

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [spriteSrc, onOpenExplorer]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      <canvas ref={canvasRef} />
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "white",
            fontFamily: "Tahoma, Arial, sans-serif",
            zIndex: 1,
          }}
        >
          Loading sprite…
        </div>
      )}
    </div>
  );
}