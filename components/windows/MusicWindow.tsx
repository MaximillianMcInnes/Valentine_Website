export default function MusicWindow() {
  return (
    <div>
      <p>📻 Zelda FM</p>
      <audio controls src="/audio/song1.mp3" />
      <p className="hint">Put mp3 files in <code>/public/audio</code></p>
    </div>
  );
}