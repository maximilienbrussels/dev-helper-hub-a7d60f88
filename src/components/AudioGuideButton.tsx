import { useEffect, useRef, useState } from "react";
import { Headphones, Pause } from "lucide-react";
import { audioGuideUrl } from "@/lib/audio-guide";

const LABEL: Record<string, [string, string]> = {
  nl: ["Beluister de audiogids", "Pauzeer"],
  fr: ["Écouter l'audioguide", "Pause"],
  en: ["Listen to the audio guide", "Pause"],
};

export function AudioGuideButton({ slug, lang }: { slug: string; lang: string }) {
  const url = audioGuideUrl(slug, lang);
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => ref.current?.pause(), [url]);
  if (!url) return null;
  const [play, pause] = LABEL[lang] ?? LABEL.nl!;
  const toggle = () => {
    if (!ref.current) {
      ref.current = new Audio(url);
      ref.current.onended = () => setPlaying(false);
    }
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { void ref.current.play(); setPlaying(true); }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
    >
      {playing ? <Pause className="size-4" aria-hidden /> : <Headphones className="size-4" aria-hidden />}
      {playing ? pause : play}
    </button>
  );
}
