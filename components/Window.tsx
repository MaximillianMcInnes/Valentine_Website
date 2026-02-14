"use client";

import { useEffect, useRef, useState } from "react";

export default function Window({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 120, y: 90 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };
    const onUp = () => (dragging.current = false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  return (
    <div
      ref={ref}
      className="window"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      <div className="titlebar" onMouseDown={onDown}>
        <div className="title">{title}</div>
        <button className="close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="content">{children}</div>
    </div>
  );
}