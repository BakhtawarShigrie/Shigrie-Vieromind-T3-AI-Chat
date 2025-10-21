import type { Participant } from "../../lib/types";

export const ParticipantCard = ({ name, role, avatar, color, online, onSelect }: Participant & { onSelect: () => void }) => (
  <div onClick={onSelect} className={`flex items-center space-x-3 rounded-lg p-2 cursor-pointer transition-colors hover:bg-white/10`}>
    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xl  ${color}`}>
      {avatar}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-white">{name}</p>
      <p className="text-xs text-gray-400">{role}</p>
    </div>
    {online && <div className="h-2 w-2 rounded-full bg-green-400" />}
  </div>
);