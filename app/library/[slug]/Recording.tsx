"use client";

import { Stream } from "@/components/PlayerContext";
import { Program, Recording } from "@/db/schema";

export default function RecordingComponent({
  rec,
  play,
}: {
  rec: { recordings: Recording; programs: Program | null };
  play: (props: Stream) => void;
}) {
  if (!rec.recordings.fileUrl) return null;
  return (
    <button
      key={rec.recordings.id}
      onClick={() => {
        play({
          title: `${rec.programs?.name} – ${rec.recordings.episodeTitle}`,
          src: rec.recordings.fileUrl,
          isLive: false
        });
      }}
      className="text-right text-2xl hover:underline"
    >
      {rec.recordings.episodeTitle}
    </button>
  );
}
