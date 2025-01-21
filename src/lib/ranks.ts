export interface Rank {
  name: string;
  minPoints: number;
  color: string;
}

export const ranks: Rank[] = [
  { name: 'AI Novice', minPoints: 0, color: 'bg-gray-500' },
  { name: 'AI Apprentice', minPoints: 100, color: 'bg-blue-500' },
  { name: 'AI Explorer', minPoints: 250, color: 'bg-green-500' },
  { name: 'AI Innovator', minPoints: 500, color: 'bg-yellow-500' },
  { name: 'AI Pioneer', minPoints: 1000, color: 'bg-orange-500' },
  { name: 'AI Master', minPoints: 2000, color: 'bg-red-500' },
  { name: 'AI Virtuoso', minPoints: 4000, color: 'bg-purple-500' },
  { name: 'AI Sage', minPoints: 8000, color: 'bg-indigo-500' },
  { name: 'AI Oracle', minPoints: 16000, color: 'bg-pink-500' },
  { name: 'AI Champion', minPoints: 32000, color: 'bg-teal-500' },
  { name: 'AI Overlord', minPoints: 64000, color: 'bg-cyan-500' },
  { name: 'AI Transcendent', minPoints: 128000, color: 'bg-emerald-500' },
  { name: 'AI Sovereign', minPoints: 256000, color: 'bg-lime-500' },
  { name: 'AI Destroyer', minPoints: 512000, color: 'bg-amber-500' },
  { name: 'AI Conqueror', minPoints: 1024000, color: 'bg-rose-500' },
  { name: 'AI Emperor', minPoints: 2048000, color: 'bg-fuchsia-500' },
  { name: 'AI God', minPoints: 4096000, color: 'bg-violet-500' },
  { name: 'AI Ultimate', minPoints: 8192000, color: 'bg-sky-500' },
  { name: 'AI Infinite', minPoints: 16384000, color: 'bg-slate-500' },
  { name: 'AI Omnipotent', minPoints: 32768000, color: 'bg-zinc-500' }
];