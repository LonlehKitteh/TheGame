/**
 * Formats total number of seconds into a string of time in HH:MM:SS format.
 *
 * @param totalSeconds - The total number of seconds to format.
 * @returns A string of time in HH:MM:SS format.
 */
export const formatTime = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (totalSeconds < 0) return `00:00:00`;

  return [h, m, s].map((e) => e.toString().padStart(2, "0")).join(":");
};
