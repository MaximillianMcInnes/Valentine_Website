"use client";

export default function Icon({
  label,
  iconSrc,
  onOpen,
}: {
  label: string;
  iconSrc: string;
  onOpen: () => void;
}) {
  return (
    <button className="icon" onDoubleClick={onOpen} onClick={onOpen}>
      <img className="iconImg" src={iconSrc} alt="" draggable={false} />
      <div className="iconLabel">{label}</div>
    </button>
  );
}